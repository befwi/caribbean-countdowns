/* events-data Worker — caribbean.countdowns.co/api/events/:year
 * R2 binding: CARIBBEAN_DATA (bucket: caribbean-data)
 * Secrets (wrangler secret put): KEY_MEDIUM, KEY_PREMIUM
 *
 * GET /api/events/2026                          → events-2026.json (tier-filtered)
 * GET /api/events/2026?country=Trinidad%20and%20Tobago → filtered by country (full name)
 * GET /api/events/2026?type=music               → filtered by type
 *
 * Tiers (header X-API-Key, silent fallback to free on missing/unknown key):
 *   free    (no key)   → name, startDate, endDate, country
 *   medium  KEY_MEDIUM → + description, type, website
 *   premium KEY_PREMIUM→ all fields
 */

const ALLOWED_YEARS = ['2026', '2027'];
const API_VERSION   = '1';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'X-API-Key',
  'Access-Control-Max-Age':       '86400',
};

const FIELDS = {
  free:    ['name', 'startDate', 'endDate', 'country'],
  medium:  ['name', 'startDate', 'endDate', 'country', 'description', 'type', 'website'],
  premium: null,   // all fields
};

// Missing or unknown key → free (no leakage, no 401).
const getTier = (apiKey, env) =>
  !apiKey                    ? 'free'
  : apiKey === env.KEY_PREMIUM ? 'premium'
  : apiKey === env.KEY_MEDIUM  ? 'medium'
  : 'free';

const project = (ev, tier) =>
  FIELDS[tier] ? Object.fromEntries(FIELDS[tier].map(f => [f, ev[f] ?? null])) : ev;

function jsonResponse(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS,
      'Content-Type':  'application/json',
      'X-API-Version': API_VERSION,
      ...extra,
    },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const url   = new URL(request.url);
    // pathname: /api/events/2026  →  parts: ['api','events','2026']
    const parts = url.pathname.split('/').filter(Boolean);
    const year  = parts[2];

    if (!year || !ALLOWED_YEARS.includes(year)) {
      return jsonResponse({ error: 'Not found', allowedYears: ALLOWED_YEARS }, 404);
    }

    const key    = `events-${year}.json`;
    const object = await env.CARIBBEAN_DATA.get(key);

    if (!object) {
      return jsonResponse({ error: 'Data not available', key }, 404);
    }

    let events;
    try {
      events = JSON.parse(await object.text());
    } catch {
      return jsonResponse({ error: 'Data parse error' }, 500);
    }

    // Optional query filters — stackable, applied before tier projection.
    const country = url.searchParams.get('country');
    const type    = url.searchParams.get('type');

    if (country) events = events.filter(e => e.country === country);
    if (type)    events = events.filter(e => e.type    === type);

    // X-Total-Count reflects the (post-filter) result set, before projection.
    const total = events.length;
    const tier  = getTier(request.headers.get('X-API-Key'), env);
    events = events.map(e => project(e, tier));

    return jsonResponse(events, 200, {
      'Cache-Control': tier === 'free' ? 'public, max-age=3600' : 'private, max-age=300',
      'X-Total-Count': String(total),
      'X-API-Tier':    tier,
    });
  },
};
