import type { APIRoute } from "astro";
const md = `---
title: Legal & privacy — Caribbean Countdowns
description: Privacy policy and terms.
url: https://caribbean.countdowns.co/legal
---

# Legal & privacy

Privacy-first: no personal data is stored and there is no cross-site tracking. Visit counting is first-party and anonymous (hashed, never storing raw IPs). Language preference is kept in local storage only. See the live /legal page for the full policy and terms, available in English, French, Kréyòl, and Spanish.
`;
export const GET: APIRoute = () => new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
