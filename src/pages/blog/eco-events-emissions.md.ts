import type { APIRoute } from "astro";
const md = `---
title: Cutting event emissions in the Caribbean
description: Shared attendee transport (with local partners like Zotcar), renewable energy, carbon offsets, regional artists and low-carbon catering — the emissions playbook for Caribbean events.
url: https://caribbean.countdowns.co/blog/eco-events-emissions
---

# Cutting event emissions in the Caribbean

_Eco guide · dimension 1 of 5 · hub: https://caribbean.countdowns.co/blog/organize-eco-friendly-event_

Emissions are the biggest, most visible lever. Five things move the needle: how the crowd travels, how you power the site, who headlines, what's on the plates, and what you offset. Attendee transport dwarfs the rest.

## Shared attendee transport
Fan travel generates ~38× more CO₂ than artist travel, hotels and gear combined (REVERB, 2024) — the single highest-impact item on the list. Organize at least one option, then promote it on every ticket, the website and socials. Concrete partners:

- 🚗 **Carsharing** — event code / drop-off zone with a local operator (e.g. Zotcar, French West Indies).
- 🚕 **Taxi / VTC** — group flat rate + signposted pickup with a co-op or VTC; number on tickets.
- 🚌 **Shuttle** — charter a bus company for loops from relay car parks (the €5 Martinique Carnival model).
- 👥 **Carpool** — event page on a carpool platform (BlaBlaCar where it runs) or a shared form; reserve the best parking for full cars.
- 🚈 **Public transit** — ask the island bus network for event-day service, or bundle a transit pass.
- 🚲 **Active travel** — staffed bike parking + a walking/cycling map.

Rule: make solo driving the least convenient option — carpools & shuttles get the closest parking.

## Renewable or grid energy
Diesel generators are the biggest on-site emission source. Use grid power where available; off-grid, rent solar + battery generators instead of diesel, size to the real load, sub-meter each stage. Publish your energy mix.

## Carbon offset programme
Island isolation makes some emissions unavoidable (artist flights, freight). Partner with a Gold Standard or VCS-certified scheme, funded by a €1–2 per-ticket levy; publish the tonnes offset.

## Regional headliners
A Paris–Martinique return ≈ 1.2 t CO₂e/person; a transatlantic act + crew can equal a 2,000-person festival's ground transport. Prioritise Caribbean/regional artists — inter-island flights emit ~20× less.

## Low-carbon catering
Food ≈ 25% of global GHG; beef/lamb up to 20× more per serving than plant-based. Require each vendor to feature a plant-based dish (rice and peas, lentil soup, breadfruit, plantain); publish the plant-based:meat ratio.

---

Score your event across all five dimensions: https://caribbean.countdowns.co/eco-evaluator/
`;
export const GET: APIRoute = () => new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
