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
