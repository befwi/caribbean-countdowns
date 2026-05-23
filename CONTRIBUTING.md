# Contributing

Thank you for your interest in contributing to Caribbean Countdowns. This document explains how the project works and what is expected from contributors.

## Ways to contribute

- **Report a bug** — open a GitHub issue describing what you observed and what you expected
- **Suggest a festival** — use the [suggest-event form](https://caribbean.countdowns.co/suggest-event/) on the live site
- **Propose a feature** — open an issue before writing code; discuss the approach first
- **Submit a pull request** — see the workflow below

## Branch protection and pull request requirement

All changes to `main` require a pull request. Direct pushes to `main` are blocked. Every PR must pass the `build` CI check before it can be merged.

Branch naming:

| Type | Pattern | Example |
|---|---|---|
| New event / data | `content/…` | `content/crop-over-2026` |
| New feature | `feat/…` | `feat/music-page` |
| Bug fix | `fix/…` | `fix/countdown-timezone` |
| Config / CI | `chore/…` | `chore/dependabot` |
| Docs | `docs/…` | `docs/architecture` |

## Tech stack

- **Astro** (static output) — pages in `src/pages/`, components in `src/components/`
- **JavaScript** — all scripts in `public/scripts/*.js` as classic (non-module) files
- **Data** — festival JSON files in `src/data/`
- **Images** — WebP format, `public/images/`

## Coding standards

The project follows these style guides for its primary languages. Contributions must generally comply. ESLint automatically enforces compliance for JavaScript on every PR.

### JavaScript

Style guide: [MDN JavaScript guidelines](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript). Key rules enforced by ESLint (`eslint.config.js`):

- Strict equality (`===`) required — `==` is an error
- No undefined variables (`no-undef` error)
- No unused variables (`no-unused-vars` warning)
- Scripts go in `public/scripts/` — never inline in `.astro` files
- Script tags must use: `<script is:inline src="/scripts/x.js" defer></script>`
- Never use `onclick` attributes — use `addEventListener` from the external script file
- The CSP enforces `script-src 'self'` — inline scripts are blocked at the browser level

### HTML / Astro

Style guide: [Astro documentation](https://docs.astro.build/en/basics/astro-syntax/). Key rules:

- Semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`)
- ARIA attributes where needed for interactive elements
- No hardcoded English-only strings in templates — use the `t-en`/`t-fr`/`t-kr`/`t-es` class pattern

### Languages

The site supports four languages: English (`t-en`), French (`t-fr`), Kréyol haïtien (`t-kr`), Spanish (`t-es`). Any user-facing text added to `.astro` pages must include all four language variants.

### Dependencies

- Adding a new npm dependency requires justification in the PR description
- New dependencies must pass `npm audit` at high severity level before merging

## Tests and CI

The CI pipeline (`build` job in `.github/workflows/deploy.yml`) runs on every PR:

1. Runs `npm test` (`astro check`) — validates all Astro components and TypeScript types
2. Runs `npm run lint` (ESLint) — checks JavaScript files in `public/scripts/` for errors
3. Validates all JSON files with a Python schema check — invalid JSON fails the build
4. Runs `npm audit` — high-severity CVEs block the merge
5. Runs `npm run build` — Astro must build without errors

Run the test suite and linter locally:

```bash
npm test
npm run lint
```

**Policy:** when major new functionality is added, tests for that functionality must be added to the automated test suite before the PR is merged.

## Sign-off (DCO)

By submitting a pull request you certify that you have the right to contribute the code under the project's MIT licence, and you agree to the [Developer Certificate of Origin](https://developercertificate.org). Add a sign-off line to your commits:

```
git commit -s -m "feat: add Crop Over festival"
```

This adds `Signed-off-by: Your Name <your@email.com>` to the commit message automatically.

## Security issues

Do not open a public issue for security vulnerabilities. Follow the process described in [SECURITY.md](SECURITY.md).
