import type { APIRoute } from "astro";
const md = `---
title: Blog — Caribbean Countdowns
description: Articles about Caribbean festivals and carnivals.
url: https://caribbean.countdowns.co/blog/
---

# Blog

- [Top 5 Caribbean carnivals — summer 2026](https://caribbean.countdowns.co/blog/top-carnivals-2026)
`;
export const GET: APIRoute = () => new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
