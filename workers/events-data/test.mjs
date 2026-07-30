/* Unit tests for the events-data Worker — run: node --test test.mjs
 * Mocks env (R2 get); uses global Request/Response (Node 18+). */
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import worker from "./index.js";

// Polyfill crypto.subtle.timingSafeEqual for Node.js (Cloudflare Workers uses it)
if (!crypto.subtle.timingSafeEqual) {
  crypto.subtle.timingSafeEqual = crypto.timingSafeEqual;
}

function makeEnv(files = {}) {
  const calls = [];
  return {
    calls,
    KEY_MEDIUM: "medium-secret",
    KEY_PREMIUM: "premium-secret",
    EVENTS_RL: { limit: async () => ({ success: true }) },
    CARIBBEAN_DATA: {
      get: async (key) => {
        calls.push(key);
        if (!(key in files)) return null;
        return { text: async () => files[key] };
      },
    },
  };
}

function get(path, headers = {}) {
  return new Request(`https://caribbean.countdowns.co${path}`, { headers });
}

const MAIN_EVENT = {
  name: "Test Fest", website: "https://example.com", description: "A test festival.",
  startDate: "2026-08-01", endDate: "2026-08-02", city: "Le Moule",
  country: "Guadeloupe", timezone: "America/Guadeloupe", type: "music festival",
  details: ["zouk"], image: "https://example.com/img.webp",
  tickets: [{ name: "Website", url: "https://example.com/tickets" }],
};

const CANDIDATE_EVENT = {
  name: "Soolang Pangui Fest", website: "", description: "",
  startDate: "2026-08-02", endDate: "2026-08-02", city: "Saint-Laurent du Maroni",
  country: "French Guiana", timezone: "America/Cayenne", type: "music festival",
  details: [], image: "",
  tickets: [{ name: "Tickets", url: "https://www.bizouk.com/events/details/soolang-pangui-fest/123800" }],
  createdYear: 2026,
};

test("premium: candidates merged in, listed:true on main events, listed:false on candidates", async () => {
  const env = makeEnv({
    "events-2026.json": JSON.stringify([MAIN_EVENT]),
    "events-2026-candidates.json": JSON.stringify([CANDIDATE_EVENT]),
  });
  const res = await worker.fetch(get("/api/events/2026", { "X-API-Key": "premium-secret" }), env);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.length, 2);
  const main = body.find(e => e.name === "Test Fest");
  const cand = body.find(e => e.name === "Soolang Pangui Fest");
  assert.equal(main.listed, true);
  assert.equal(cand.listed, false);
  assert.equal(res.headers.get("X-Total-Count"), "2");
});

test("premium: no candidates file for year → unchanged, no error", async () => {
  const env = makeEnv({ "events-2026.json": JSON.stringify([MAIN_EVENT]) });
  const res = await worker.fetch(get("/api/events/2026", { "X-API-Key": "premium-secret" }), env);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.length, 1);
  assert.equal(body[0].listed, true);
});

test("free tier: candidates file never fetched, listed field absent", async () => {
  const env = makeEnv({
    "events-2026.json": JSON.stringify([MAIN_EVENT]),
    "events-2026-candidates.json": JSON.stringify([CANDIDATE_EVENT]),
  });
  const res = await worker.fetch(get("/api/events/2026"), env);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.length, 1);
  assert.ok(!("listed" in body[0]));
  assert.ok(!env.calls.includes("events-2026-candidates.json"));
});

test("medium tier: candidates file never fetched, listed field absent", async () => {
  const env = makeEnv({
    "events-2026.json": JSON.stringify([MAIN_EVENT]),
    "events-2026-candidates.json": JSON.stringify([CANDIDATE_EVENT]),
  });
  const res = await worker.fetch(get("/api/events/2026", { "X-API-Key": "medium-secret" }), env);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.length, 1);
  assert.ok(!("listed" in body[0]));
  assert.ok(!env.calls.includes("events-2026-candidates.json"));
});

test("premium: country filter applies across merged main+candidate events", async () => {
  const env = makeEnv({
    "events-2026.json": JSON.stringify([MAIN_EVENT]),
    "events-2026-candidates.json": JSON.stringify([CANDIDATE_EVENT]),
  });
  const res = await worker.fetch(
    get("/api/events/2026?country=French%20Guiana", { "X-API-Key": "premium-secret" }),
    env
  );
  const body = await res.json();
  assert.equal(body.length, 1);
  assert.equal(body[0].name, "Soolang Pangui Fest");
  assert.equal(body[0].listed, false);
});

test("premium: malformed candidates JSON → 500, free tier for same year unaffected", async () => {
  const env = makeEnv({
    "events-2026.json": JSON.stringify([MAIN_EVENT]),
    "events-2026-candidates.json": "{not valid json",
  });
  const premiumRes = await worker.fetch(get("/api/events/2026", { "X-API-Key": "premium-secret" }), env);
  assert.equal(premiumRes.status, 500);

  const freeRes = await worker.fetch(get("/api/events/2026"), env);
  assert.equal(freeRes.status, 200);
  const freeBody = await freeRes.json();
  assert.equal(freeBody.length, 1);
});
