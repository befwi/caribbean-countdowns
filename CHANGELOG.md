# Changelog

All notable changes to this project are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning uses [Calendar Versioning](https://calver.org): `vYYYY.MM`.

---

## [v2026.05] — 2026-05-20

### Added

- **OpenSSF Scorecard workflow** — automated supply-chain security analysis on every push and weekly; results published to api.securityscorecards.dev (score: 8.0/10)
- **SECURITY.md** — vulnerability disclosure policy with 48h acknowledgement and 14-day fix commitment
- **CODEOWNERS** — maintainer review enforced on all pull requests
- **Dependabot** — automated weekly dependency updates for npm packages and GitHub Actions
- **Build Integrity section** on `/security` page — visual checklist of CI/CD hardening measures
- **OpenSSF Scorecard badge** on `/security` page and README
- **CII Best Practices badge** — project registered at bestpractices.dev (ID 12911)
- **Deploy CC status badge** in README
- **CODE_OF_CONDUCT.md** — Contributor Covenant-based code of conduct
- **CONTRIBUTING.md** — contribution guide with coding standards and DCO sign-off requirement
- **GOVERNANCE.md** — project governance and continuity documentation
- **ROADMAP.md** — planned direction for next 12+ months
- **Eco-evaluator step** in the suggest-festival wizard — optional sustainability self-assessment for festival organisers (5 criteria)
- **9 new festivals** for 2026: Festival Ceiba, SXM Festival, Tout Moun An Dlo, Rivages Film Festival, Lézard Ti Show, Festival International de la Randonnée, Anguilla Summer Festival, Sandy Ground Village Festival, Semi Marathon International Fort-de-France
- **16 new festival images** (WebP) for 2026 events and upcoming 2027 events

### Changed

- **deploy.yml** — added `pull_request` trigger so the `build` job runs CI on every PR; `deploy` job skipped on PRs (only fires on merge to main)
- **deploy.yml** — added `workflow_dispatch` trigger for manual deploys after R2 uploads
- **deploy.yml** — added `--quiet` flag to R2 sync to avoid leaking JSON inventory in public build logs
- **All GitHub Actions SHA-pinned** — all workflow steps use commit SHAs instead of mutable tags, preventing tag-overwrite attacks
- **.gitignore** — `src/data/*.json` excluded from git; festival data served from Cloudflare R2

### Security

- Branch protection fully enabled on `main`: PR required, build check required, stale review dismissal, CODEOWNERS review, last-push approval, up-to-date branch required, administrators included
- All Actions pinned to commit SHAs (Pinned-Dependencies: 10/10)
- `npm audit` gate blocks deploys on high-severity CVEs
- JSON validation in CI prevents malformed data from reaching the live site

---

## [v2026.01] — 2026-01-01

### Added

- Initial public release
- Festival countdown timers for Caribbean and French Guiana events
- 4 languages: English, French, Kréyol haïtien, Spanish
- NGO spotlight page — L'Asso-Mer community progress tracker with quiz and gamification
- Sponsor page
- Suggest-a-festival wizard — 12-step submission form
- Legal page
- Cloudflare CDN with security headers: CSP, HSTS, X-Frame-Options, Referrer-Policy
- GitHub Actions deploy pipeline — automated build and publish to GitHub Pages on push to main
- MIT licence
