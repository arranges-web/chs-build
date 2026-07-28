---
name: react-pdf browser gotchas
description: Known failures and fixes when using @react-pdf/renderer v4 in a Vite browser app (not SSR/Node).
---

# @react-pdf/renderer v4 — Browser Gotchas

## Rule 1: Buffer polyfill required
**Why:** pdfkit (react-pdf's engine) calls `Buffer.from()` internally. In a browser, `globalThis.Buffer` is undefined.
**How to apply:** Install the `buffer` npm package and add `import "./polyfills"` as the **first** import in `main.tsx`. The polyfill file must set `globalThis.Buffer = Buffer` before any library runs.

## Rule 2: No WOFF2 fonts — use TTF/OTF or built-in PDF fonts
**Why:** pdfkit's font subsetter (`_addGlyph`) throws `RangeError: Offset is outside the bounds of the DataView` when parsing WOFF2. This includes WOFF2 variable fonts from Google Fonts CDN (e.g. Inter v13, Oswald v53 — both are variable fonts).
**How to apply:** Either (a) use built-in PDF fonts (`Helvetica`, `Helvetica-Bold`, `Times-Roman`, etc.) which require no fetch at all, or (b) download static TTF/OTF files to `public/fonts/` and register them with local paths.

## Rule 3: No WebP images
**Why:** react-pdf's image handler rejects WebP with "Not valid image extension".
**How to apply:** Import PNG or JPG versions from `attached_assets/`. All assets in this project have PNG/JPG counterparts.

## Rule 4: PDFDownloadLink renders eagerly on mount
**Why:** `PDFDownloadLink` begins generating the PDF immediately when the component mounts (not on click). The `loading` state covers this. Always handle the `error` render prop to surface failures instead of showing a stuck button.

## Summary fix sequence (if PDF download breaks)
1. Check browser console for `Buffer is not defined` → add Buffer polyfill to `main.tsx`
2. Check for `RangeError: Offset is outside DataView` → font format issue → switch to built-in fonts or TTF
3. Check for `Not valid image extension` → switch image imports from `.webp` to `.png`/`.JPG`
4. Always handle `{({ loading, error }) => ...}` in the `PDFDownloadLink` render prop
