# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it **privately** before disclosing it publicly.

**GitHub Security Advisories (preferred):**
https://github.com/countdowns-co/caribbean-countdowns/security/advisories/new

We will acknowledge your report within 48 hours and aim to release a fix within 14 days for confirmed issues.

Please do not open a public GitHub issue for security vulnerabilities.

## Scope

This repository hosts a static site (caribbean.countdowns.co). The attack surface includes:

- Cloudflare CDN and security headers configuration
- GitHub Actions CI/CD pipeline
- npm dependencies
- Event data pipeline (Cloudflare R2 → GitHub Actions → GitHub Pages)

## Out of Scope

- The GitHub Pages infrastructure itself (report to GitHub)
- The Cloudflare infrastructure itself (report to Cloudflare)
- Social engineering attacks

## Security Expectations

**What users can expect:**

- All traffic is served over HTTPS with TLS enforced — plain HTTP is not accepted
- Security headers are applied on every response: Content Security Policy, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- The site collects no personal data and sets no tracking cookies
- There is no login system — no passwords or credentials are stored by this project
- Dependencies are monitored automatically for known vulnerabilities; high-severity issues block deployment
- All changes to the codebase go through a reviewed pull request before reaching production

**What users cannot expect:**

- Protection against vulnerabilities in underlying hosting or delivery infrastructure — those are the responsibility of the respective providers
- Authentication or access control — the site is fully public
- Confidentiality of community API interactions — the NGO stats endpoint is unauthenticated and rate-limited only
- Guaranteed uptime — the project provides no SLA

## Assurance Case

### Threat model

The site is a public-facing static website with one stateful endpoint (community stats). Plausible threats are:

- **Web attacks** (XSS, injection, clickjacking) targeting site visitors
- **Supply chain compromise** via malicious or vulnerable npm dependencies or CI actions
- **Data tampering** via unauthorised modification of festival data or community stats
- **Denial of service** via abusive requests to the community API

Data exfiltration and authentication bypass are not applicable — the site stores no personal data and has no login system.

### Trust boundaries

| Boundary | Description |
|---|---|
| Browser ↔ CDN | TLS terminates here; security headers are enforced at this edge |
| CDN ↔ static files | Served by the hosting provider; outside project control |
| Browser ↔ community API | Single HTTPS endpoint; all inputs validated server-side |
| CI pipeline ↔ private storage | Build-time only; credentials are CI secrets, never in source |
| Repository ↔ npm registry | Dependency boundary; all packages locked and audited |

### Secure design principles applied

- **Fail-safe defaults** — CSP denies all inline scripts and non-origin resources by default; the API returns errors on unexpected input
- **Economy of mechanism** — fully static architecture; no server, no database, minimal moving parts
- **Least privilege** — CI credentials are scoped to deployment only; no write access to the repository from the API
- **Separation of privilege** — festival data is separated from source code; all code changes require a reviewed pull request
- **Complete mediation** — every dependency change is audited automatically; every code change is reviewed before reaching production

### Common implementation weaknesses countered

| OWASP Top 10 | Countermeasure |
|---|---|
| A01 Broken Access Control | No access control needed — site is fully public; API has no privileged operations |
| A02 Cryptographic Failures | HTTPS enforced on all connections; no cryptographic operations in project code |
| A03 Injection / XSS | CSP `script-src 'self'` blocks all inline script execution; API validates all inputs with numeric clamping and allowlist path check |
| A04 Insecure Design | Secure design principles applied (see above); threat model documented here |
| A05 Security Misconfiguration | Security headers set on every response; no default credentials; no debug endpoints |
| A06 Vulnerable Components | Automated dependency monitoring blocks high-severity CVEs from reaching production |
| A07 Authentication Failures | No authentication system exists — not applicable |
| A08 Software and Data Integrity | All CI actions are SHA-pinned; branch protection requires reviewed PRs; dependency lock file committed |
| A09 Logging and Monitoring | CI logs every build and audit result; supply chain is monitored via OpenSSF Scorecard |
| A10 SSRF | No server-side requests to user-controlled URLs — not applicable |

## Security Measures

See https://caribbean.countdowns.co/security for third-party audit results and CI/CD hardening details.

---

## R2 Credential Rotation

### Secrets in use

| Secret | Used in | Purpose |
|--------|---------|---------|
| `R2_ACCESS_KEY` | `.github/workflows/deploy.yml` | AWS-compat Access Key ID for R2 |
| `R2_SECRET_KEY` | `.github/workflows/deploy.yml` | AWS-compat Secret Access Key for R2 |
| `CF_ACCOUNT_ID` | `.github/workflows/deploy.yml` | Endpoint URL construction — identifier, no rotation needed |

### When to rotate

- Every 90 days (quarterly)
- Immediately if a contributor with access leaves the project
- Immediately if a secret is accidentally exposed (commit, log, screenshot)
- If suspicious R2 activity is detected in Cloudflare logs

### Procedure

**Step 1 — Generate new R2 API token**
1. Cloudflare Dashboard → R2 → top-right "Manage R2 API Tokens"
2. Click "Create API token"
3. Name: `github-deploy-YYYY-MM-DD`
4. Permissions: Object Read & Write
5. Specify bucket: `caribbean-data`
6. Click "Create API Token"
7. Copy the **Access Key ID** and **Secret Access Key** — shown once only

**Step 2 — Update GitHub Secrets**
1. GitHub → `countdowns-co/caribbean-countdowns` → Settings → Secrets and variables → Actions
2. Update `R2_ACCESS_KEY` → paste new Access Key ID
3. Update `R2_SECRET_KEY` → paste new Secret Access Key

**Step 3 — Verify**
1. Actions → "Deploy CC" → "Run workflow" (manual trigger)
2. Confirm "Pull data from R2" step succeeds (green)
3. Confirm site builds and deploys correctly

**Step 4 — Revoke old token**
1. Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Find the previous token (by name/date)
3. Click "..." → Delete

### Last rotated

Not yet documented — establish baseline on first rotation.
