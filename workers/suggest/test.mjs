/* Unit tests for the suggest Worker — run: node --test test.mjs
 * Mocks env (R2 put + rate limiter); uses global Request/Response (Node 18+). */
import test from "node:test";
import assert from "node:assert/strict";
import worker from "./index.js";

function makeEnv(overrides = {}) {
  const puts = [];
  return {
    puts,
    CARIBBEAN_DATA: { put: async (key, value) => { puts.push({ key, value }); } },
    RATE_LIMITER: { limit: async () => ({ success: true }) },
    ...overrides,
  };
}

function post(body, headers = {}) {
  return new Request("https://caribbean.countdowns.co/api/suggest", {
    method: "POST",
    headers: { "Content-Type": "application/json", "CF-Connecting-IP": "1.2.3.4", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const VALID = {
  name: "Test Fest", website: "https://example.com", description: "A test festival.",
  startDate: "2026-08-01", endDate: "2026-08-02", city: "Le Moule",
  country: "Guadeloupe", timezone: "America/Guadeloupe", type: "music festival",
  details: ["zouk", "kompa"], image: "https://example.com/img.webp",
  tickets: [{ name: "Website", url: "https://example.com/tickets" }],
  eco: ["water", "reusable"], notes: "2nd edition",
};

test("valid POST → 201, object stored under suggestions/, no PII", async () => {
  const env = makeEnv();
  const res = await worker.fetch(post(VALID), env);
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(env.puts.length, 1);
  assert.match(env.puts[0].key, /^suggestions\/\d{4}-\d{2}-\d{2}-[0-9a-f-]{8}\.json$/);
  const stored = JSON.parse(env.puts[0].value);
  assert.ok(stored.receivedAt);
  assert.equal(stored.suggestion.name, "Test Fest");
  assert.ok(!env.puts[0].value.includes("1.2.3.4"));
});

test("CORS header restricted to site origin", async () => {
  const res = await worker.fetch(post(VALID), makeEnv());
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), "https://caribbean.countdowns.co");
});

test("OPTIONS preflight → 204", async () => {
  const req = new Request("https://caribbean.countdowns.co/api/suggest", { method: "OPTIONS" });
  const res = await worker.fetch(req, makeEnv());
  assert.equal(res.status, 204);
});

test("GET → 405", async () => {
  const req = new Request("https://caribbean.countdowns.co/api/suggest", { method: "GET" });
  const res = await worker.fetch(req, makeEnv());
  assert.equal(res.status, 405);
});

test("wrong Content-Type → 415", async () => {
  const res = await worker.fetch(post(VALID, { "Content-Type": "text/plain" }), makeEnv());
  assert.equal(res.status, 415);
});

test("oversized body → 413", async () => {
  const big = { ...VALID, description: "x".repeat(11 * 1024) };
  const res = await worker.fetch(post(big), makeEnv());
  assert.equal(res.status, 413);
});

test("rate limited → 429, nothing stored", async () => {
  const env = makeEnv({ RATE_LIMITER: { limit: async () => ({ success: false }) } });
  const res = await worker.fetch(post(VALID), env);
  assert.equal(res.status, 429);
  assert.equal(env.puts.length, 0);
});

test("invalid JSON → 400", async () => {
  const res = await worker.fetch(post("{nope"), makeEnv());
  assert.equal(res.status, 400);
});

test("missing required fields → 400 with field", async () => {
  for (const [omit, field] of [["name", "name"], ["startDate", "dates"], ["country", "country"], ["type", "type"]]) {
    const bad = { ...VALID }; delete bad[omit];
    const res = await worker.fetch(post(bad), makeEnv());
    assert.equal(res.status, 400, omit);
    assert.equal((await res.json()).field, field);
  }
});

test("bad date format → 400", async () => {
  const res = await worker.fetch(post({ ...VALID, startDate: "01/08/2026" }), makeEnv());
  assert.equal(res.status, 400);
});

test("unknown type → 400", async () => {
  const res = await worker.fetch(post({ ...VALID, type: "rave" }), makeEnv());
  assert.equal(res.status, 400);
});

test("non-http image URL → 400", async () => {
  const res = await worker.fetch(post({ ...VALID, image: "javascript:alert(1)" }), makeEnv());
  assert.equal(res.status, 400);
});

test("name over 120 chars → 400", async () => {
  const res = await worker.fetch(post({ ...VALID, name: "x".repeat(121) }), makeEnv());
  assert.equal(res.status, 400);
});

test("unknown eco id → 400", async () => {
  const res = await worker.fetch(post({ ...VALID, eco: ["greenwashing"] }), makeEnv());
  assert.equal(res.status, 400);
});

test("bad ticket shape → 400", async () => {
  const res = await worker.fetch(post({ ...VALID, tickets: ["not-an-object"] }), makeEnv());
  assert.equal(res.status, 400);
});

test("unknown keys are dropped, never stored", async () => {
  const env = makeEnv();
  const res = await worker.fetch(post({ ...VALID, email: "leak@example.com", admin: true }), env);
  assert.equal(res.status, 201);
  assert.ok(!env.puts[0].value.includes("leak@example.com"));
  assert.ok(!("admin" in JSON.parse(env.puts[0].value).suggestion));
});
