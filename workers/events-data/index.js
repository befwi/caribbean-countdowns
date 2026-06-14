/* events-data Worker — caribbean.countdowns.co/api/events/:year
 * R2 binding: CARIBBEAN_DATA (bucket: caribbean-data)
 * GET /api/events/2026          → full events-2026.json
 * GET /api/events/2026?country=TT → filtered by country
 * GET /api/events/2026?type=music  → filtered by type
 */

const ALLOWED_YEARS = ['2026', '2027'];
const API_VERSION   = '1';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age':       '86400',
};

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

    // Optional query filters — stackable
    const country = url.searchParams.get('country');
    const type    = url.searchParams.get('type');

    if (country) events = events.filter(e => e.country === country);
    if (type)    events = events.filter(e => e.type    === type);

    return jsonResponse(events, 200, {
      'Cache-Control': 'public, max-age=3600',
      'X-Total-Count': String(events.length),
    });
  },
};
