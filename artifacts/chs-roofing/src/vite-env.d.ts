/// <reference types="vite/client" />

// Some founder-supplied photos are stored with an uppercase .JPG
// extension (drone exports). vite/client only declares lowercase
// asset extensions, so we add the uppercase variants here so the
// imports type-check on case-sensitive file systems (Linux / Replit).
declare module "*.JPG" {
  const src: string;
  export default src;
}
declare module "*.JPEG" {
  const src: string;
  export default src;
}
declare module "*.PNG" {
  const src: string;
  export default src;
}
