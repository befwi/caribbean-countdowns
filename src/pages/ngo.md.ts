import type { APIRoute } from "astro";
const md = `---
title: NGO & community — Caribbean Countdowns
description: The non-profit angle and community stats.
url: https://caribbean.countdowns.co/ngo
---

# NGO & community

Caribbean Countdowns supports Caribbean cultural and environmental non-profits. This page surfaces community stats and partner NGOs. The project is independent and privacy-first — no visitor tracking, no personal data stored.
`;
export const GET: APIRoute = () => new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
