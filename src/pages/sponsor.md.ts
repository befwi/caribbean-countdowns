import type { APIRoute } from "astro";
const md = `---
title: Sponsorship — Caribbean Countdowns
description: Sponsorship opportunities.
url: https://caribbean.countdowns.co/sponsor
---

# Sponsorship

Organisations can sponsor Caribbean Countdowns to reach an engaged, culturally-focused Caribbean audience. See the live /sponsor page for current options and how to get in touch.
`;
export const GET: APIRoute = () => new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
