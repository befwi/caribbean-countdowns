import type { APIRoute } from "astro";
const md = `---
title: Security — Caribbean Countdowns
description: Security posture and practices.
url: https://caribbean.countdowns.co/security
---

# Security

Caribbean Countdowns follows OpenSSF best practices (CII Silver, Scorecard ~8.9). The site is a static build served over HTTPS with a strict CSP; the API runs on isolated Cloudflare Workers. No personal data is stored. See the live site for the current posture.
`;
export const GET: APIRoute = () => new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
