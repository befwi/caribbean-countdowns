/* visits Worker — caribbean.countdowns.co/api/hit
 * First-party privacy-preserving visit counter. Replaces visitor-badge.laobi.icu.
 * KV binding: VISITS_KV · secret: SALT_SECRET · optional AE binding: TRAFFIC
 *
 * GET /api/hit              → SVG badge with total view count
 * GET /api/hit?format=json  → { views, uniquesToday }
 *
 * Privacy: no IP is ever stored. Daily uniques are estimated from
 * SHA-256(secret : date : ip) — non-reversible without the secret, and the
 * date component makes each day's fingerprints unlinkable to the next.
 * Dedupe keys expire after 24h. No cookies, no third party.
 */

async function dailyHash(env, ip) {
  const date = new Date().toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${env.SALT_SECRET}:${date}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

async function count(env, request) {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const date = new Date().toISOString().slice(0, 10);
  const hash = await dailyHash(env, ip);

  const views = parseInt((await env.VISITS_KV.get("views")) || "0", 10) + 1;
  await env.VISITS_KV.put("views", String(views));

  let uniques = parseInt((await env.VISITS_KV.get(`uniq:${date}`)) || "0", 10);
  const seen = await env.VISITS_KV.get(`seen:${hash}`);
  if (!seen) {
    uniques += 1;
    await env.VISITS_KV.put(`seen:${hash}`, "1", { expirationTtl: 86400 });
    await env.VISITS_KV.put(`uniq:${date}`, String(uniques));
  }

  if (env.TRAFFIC) {
    const referer = request.headers.get("Referer") || "";
    let path = "/";
    try { path = new URL(referer).pathname; } catch { /* no referer */ }
    env.TRAFFIC.writeDataPoint({
      blobs: [path, request.cf?.country || "XX"],
      doubles: [1],
      indexes: [hash]
    });
  }

  return { views, uniquesToday: uniques };
}

function badge(text) {
  const label = "visits";
  const labelW = 46;
  const valueW = 14 + text.length * 8;
  const w = labelW + valueW;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="20" role="img" aria-label="${label}: ${text}">` +
    `<rect width="${labelW}" height="20" fill="#1a1a1a"/>` +
    `<rect x="${labelW}" width="${valueW}" height="20" fill="#0d9488"/>` +
    `<g fill="#e0e0e0" text-anchor="middle" font-family="Verdana,Geneva,sans-serif" font-size="11">` +
    `<text x="${labelW / 2}" y="14">${label}</text>` +
    `<text x="${labelW + valueW / 2}" y="14" fill="#001a1a" font-weight="bold">${text}</text>` +
    `</g></svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/hit") {
      return new Response("Not found", { status: 404 });
    }
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      // over the limit: serve the badge without counting, never break the page
      const views = (await env.VISITS_KV.get("views")) || "0";
      return badge(views);
    }

    try {
      const stats = await count(env, request);
      if (url.searchParams.get("format") === "json") {
        return Response.json(stats, { headers: { "Cache-Control": "no-store" } });
      }
      return badge(String(stats.views));
    } catch {
      return badge("–");
    }
  }
};
