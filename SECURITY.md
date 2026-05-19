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

## Security Measures

See https://caribbean.countdowns.co/security for third-party audit results and CI/CD hardening details.
