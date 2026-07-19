import type { APIRoute } from "astro";
const md = `---
title: How to organize a REAL eco-friendly event
description: A practical Caribbean playbook — the 5 dimensions of a genuinely low-impact festival (emissions, waste, water, biodiversity, community), with concrete steps and local partners.
url: https://caribbean.countdowns.co/blog/organize-eco-friendly-event
---

# How to organize a REAL eco-friendly event

_July 2026 · countdowns.co editorial · the eco guide_

Most "green event" claims are marketing — a reusable-cup photo and a hashtag. A genuinely low-impact festival is measured across five dimensions, not one. In the Caribbean the stakes are higher: island isolation makes some emissions unavoidable, and venues often sit metres from coral reefs, mangroves and turtle-nesting beaches.

This is the practical playbook: what to actually do in each dimension, and which local partners make it happen. Start by measuring your event with the free interactive evaluator: https://caribbean.countdowns.co/eco-evaluator/

## The five dimensions

- 💨 **Emissions** — shared attendee transport, renewable energy, low-carbon catering, regional artists, offsets. The biggest single lever (attendee travel) lives here. Guide: https://caribbean.countdowns.co/blog/eco-events-emissions
- ♻️ **Waste** — single-use plastic bans, on-site sorting, reusable cups, composting, published waste data. _(coming soon)_
- 💧 **Water** — refill stations, no bottled water, consumption tracking, wastewater plan, drought awareness. _(coming soon)_
- 🐢 **Biodiversity** — distance from protected areas, wildlife briefings, leave-no-trace, light-pollution control, an eco NGO on board. _(coming soon)_
- 🤝 **Community** — local vendors and line-up, an NGO partnership, accessible pricing, social inclusion. _(coming soon)_

Every dimension in the scorecard links back to its guide. Score your event, then work through them: https://caribbean.countdowns.co/eco-evaluator/
`;
export const GET: APIRoute = () => new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
