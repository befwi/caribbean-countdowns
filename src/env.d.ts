/// <reference types="astro/client" />

// Event JSON files live in R2, pulled at build time — not committed to the repo.
// These declarations satisfy TypeScript's resolveJsonModule requirement when files
// are absent (PR CI runs, local dev without R2 data).
// Typed as any[] to preserve index signature through spread operations in Astro pages.

declare module '*/events-2024.json' {
  const value: any[];
  export default value;
}
declare module '*/events-2025.json' {
  const value: any[];
  export default value;
}
declare module '*/events-2026.json' {
  const value: any[];
  export default value;
}
declare module '*/events-2027.json' {
  const value: any[];
  export default value;
}
