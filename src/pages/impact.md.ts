import type { APIRoute } from "astro";
const md = `---
title: Impact — Caribbean Countdowns
description: Project impact summary.
url: https://caribbean.countdowns.co/impact
---

# Impact

Caribbean Countdowns curates verified dates for Caribbean festivals, carnivals, and regattas across multiple years and countries, in four languages, to help audiences and organisers plan around cultural events. See the live site for current reach and community figures.
`;
export const GET: APIRoute = () => new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
