/// <reference types="astro/client" />

// Festival JSON files live in R2, pulled at build time — not committed to the repo.
// These declarations satisfy TypeScript's resolveJsonModule requirement when files
// are absent (PR CI runs, local dev without R2 data).
type FestivalRecord = Record<string, unknown>;

declare module '*/festivals-2024.json' {
  const value: FestivalRecord[];
  export default value;
}
declare module '*/festivals-2025.json' {
  const value: FestivalRecord[];
  export default value;
}
declare module '*/festivals-2026.json' {
  const value: FestivalRecord[];
  export default value;
}
declare module '*/festivals-2027.json' {
  const value: FestivalRecord[];
  export default value;
}
