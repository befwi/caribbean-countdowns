import type { APIRoute } from "astro";
const md = `---
title: Blog — Caribbean Countdowns
description: Articles about Caribbean festivals and carnivals.
url: https://caribbean.countdowns.co/blog/
---

# Blog

- [Eco-Friendly Events in the Caribbean: Why They're Worth It](https://caribbean.countdowns.co/blog/why-organize-eco-friendly-event)
- [Why Choose a Sustainable Event?](https://caribbean.countdowns.co/blog/why-choose-sustainable-event)
- [Top 5 Caribbean carnivals — summer 2026](https://caribbean.countdowns.co/blog/top-carnivals-2026)
`;
export const GET: APIRoute = () => new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
