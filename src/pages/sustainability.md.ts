import type { APIRoute } from "astro";
const md = `---
title: Sustainability — Caribbean Countdowns
description: How events are scored on ecological criteria.
url: https://caribbean.countdowns.co/sustainability
---

# Sustainability

Events on Caribbean Countdowns can carry an eco grade from A (best) to F, based on ecological criteria such as waste handling, transport, and local sourcing. Grades are shown as a ♻️ badge and can be filtered on the homepage. Ungraded events show no badge. See the live site for the current criteria and per-event grades.
`;
export const GET: APIRoute = () => new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
