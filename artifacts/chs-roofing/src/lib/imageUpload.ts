/**
 * Resize + recompress an image file in the browser before we send it
 * to the server. Outputs a JPEG data URL that fits in a single
 * Postgres TEXT column without needing object storage. Defaults are
 * tuned for roof / job-site photos viewed on a phone or laptop —
 * roughly 60–150 KB per photo.
 */
export async function compressImage(
  file: File,
  opts: { maxWidth?: number; quality?: number } = {},
): Promise<string> {
  const maxWidth = opts.maxWidth ?? 1200;
  const quality = opts.quality ?? 0.8;

  if (!file.type.startsWith("image/")) {
    throw new Error("That doesn't look like an image file.");
  }

  const bitmap = await loadBitmap(file);
  const ratio = Math.min(1, maxWidth / bitmap.width);
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Browser doesn't support canvas — try a different browser.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  // Free GPU memory when possible.
  if ("close" in bitmap && typeof (bitmap as ImageBitmap).close === "function") {
    (bitmap as ImageBitmap).close();
  }

  return canvas.toDataURL("image/jpeg", quality);
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // createImageBitmap respects EXIF orientation in modern browsers
  // and is faster than an <img> round-trip.
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Fall through to <img> fallback below.
    }
  }
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load this image."));
    };
    img.src = url;
  });
}

/** Friendly byte-size formatter for upload UI. */
export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} kB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** Approximate byte length of a data URL (base64-encoded payload). */
export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(",");
  if (comma < 0) return dataUrl.length;
  const b64 = dataUrl.slice(comma + 1);
  return Math.floor((b64.length * 3) / 4);
}
