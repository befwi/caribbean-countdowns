/* markdown Worker — content negotiation for caribbean.countdowns.co
 * On `Accept: text/markdown`, serve the pre-built .md for mapped page routes;
 * otherwise pass HTML through. HTML stays the default for browsers.
 * Scoped to page routes only (see wrangler.toml); /api/* and /images/* unaffected.
 */

const MD_MAP = {
  "":                         "/index.md",
  "/blog":                    "/blog/index.md",
  "/blog/top-carnivals-2026": "/blog/top-carnivals-2026.md",
  "/sustainability":          "/sustainability.md",
  "/ngo":                     "/ngo.md",
  "/security":                "/security.md",
  "/legal":                   "/legal.md",
  "/impact":                  "/impact.md",
  "/sponsor":                 "/sponsor.md",
};

const wantsMarkdown = (accept) =>
  !!accept && accept.split(",").some((p) => p.trim().split(";")[0] === "text/markdown");

// "/" → "", "/x/" → "/x", "/x" → "/x"
const normalize = (p) => (p === "/" ? "" : p.endsWith("/") ? p.slice(0, -1) : p);

function withVary(resp) {
  const r = new Response(resp.body, resp);
  r.headers.append("Vary", "Accept");
  return r;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Loop guard + direct .md access: never negotiate a .md request.
    if (url.pathname.endsWith(".md")) return fetch(request);

    // HTML is the default for anything not explicitly asking for markdown.
    if (!wantsMarkdown(request.headers.get("Accept"))) {
      return withVary(await fetch(request));
    }

    const mdPath = MD_MAP[normalize(url.pathname)];
    if (!mdPath) return withVary(await fetch(request));

    const mdResp = await fetch(new URL(mdPath, url.origin).toString());
    if (mdResp.status !== 200) return withVary(await fetch(request)); // fall back to HTML

    const body = await mdResp.text();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Vary": "Accept",
        "X-Markdown-Tokens": String(Math.ceil(body.length / 4)),
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
