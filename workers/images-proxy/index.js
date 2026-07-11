/* images-proxy Worker — caribbean.countdowns.co/images/*
 * R2 binding: CARIBBEAN_DATA (bucket: caribbean-data)
 * GET /images/reggaesumfest.webp → R2 key: images/reggaesumfest.webp
 * GET /images/ngos/assomer.webp  → R2 key: images/ngos/assomer.webp
 * No auth — images are publicly cacheable by URL.
 * Discovery of image URLs is gated by the API tier (premium only).
 */

const CONTENT_TYPES = {
  webp: 'image/webp',
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  svg:  'image/svg+xml',
  gif:  'image/gif',
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url  = new URL(request.url);
    const path = url.pathname.replace(/^\/images\//, '').replace(/^\/+/, '');

    if (!path) {
      return new Response('Not found', { status: 404 });
    }

    const ext = path.split('.').pop().toLowerCase();
    const contentType = CONTENT_TYPES[ext];

    if (!contentType) {
      return new Response('Not found', { status: 404 });
    }

    const key = `images/${path}`;
    const headers = {
      ...CORS,
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    if (request.method === 'HEAD') {
      const object = await env.CARIBBEAN_DATA.head(key);
      if (!object) {
        return new Response(null, { status: 404 });
      }
      headers['Content-Length'] = object.size;
      return new Response(null, { headers });
    }

    const object = await env.CARIBBEAN_DATA.get(key);

    if (!object) {
      return new Response('Not found', { status: 404 });
    }

    return new Response(object.body, { headers });
  },
};
