/**
 * Browser polyfills — must be the very first import in main.tsx so they are
 * in place before any library code (e.g. @react-pdf/renderer) runs.
 */
import { Buffer as BufferPolyfill } from "buffer";

// @react-pdf/renderer calls Buffer.from / Buffer.alloc internally.
// The `buffer` npm package is a browser-compatible port of Node's Buffer.
if (typeof globalThis.Buffer === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Buffer = BufferPolyfill;
}
