import { test } from 'node:test';
import assert from 'node:assert';
import worker from './index.js';

// Stub global.fetch: Request (passthrough) → HTML; string ending .md → md/404.
function withStub(mdStatus, fn) {
  const orig = globalThis.fetch;
  globalThis.fetch = async (input) => {
    if (typeof input !== 'string' && !(input instanceof URL)) {
      return new Response('<html>hi</html>', { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    const u = String(input);
    if (u.endsWith('.md')) {
      return mdStatus === 200
        ? new Response('# md\nbody', { status: 200 })
        : new Response('not found', { status: 404 });
    }
    return new Response('<html>hi</html>', { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  };
  return Promise.resolve(fn()).finally(() => { globalThis.fetch = orig; });
}
const req = (path, accept) =>
  new Request('https://caribbean.countdowns.co' + path, accept ? { headers: { Accept: accept } } : undefined);

test('markdown Accept on / returns text/markdown + Vary', () => withStub(200, async () => {
  const r = await worker.fetch(req('/', 'text/markdown'));
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /text\/markdown/);
  assert.equal(r.headers.get('vary'), 'Accept');
  assert.equal(await r.text(), '# md\nbody');
}));

test('no Accept on / passes through HTML, adds Vary', () => withStub(200, async () => {
  const r = await worker.fetch(req('/'));
  assert.match(r.headers.get('content-type'), /text\/html/);
  assert.match(r.headers.get('vary') || '', /Accept/);
}));

test('.md path is passed through (loop guard) even with markdown Accept', () => withStub(200, async () => {
  const r = await worker.fetch(req('/index.md', 'text/markdown'));
  assert.match(r.headers.get('content-type'), /text\/html/); // stub returns HTML for Request passthrough
}));

test('markdown Accept but .md missing → falls back to HTML', () => withStub(404, async () => {
  const r = await worker.fetch(req('/sustainability', 'text/markdown'));
  assert.match(r.headers.get('content-type'), /text\/html/);
}));

test('unmapped path with markdown Accept → passthrough', () => withStub(200, async () => {
  const r = await worker.fetch(req('/eco-evaluator', 'text/markdown'));
  assert.match(r.headers.get('content-type'), /text\/html/);
}));

test('trailing slash maps (/sustainability/ → /sustainability.md)', () => withStub(200, async () => {
  const r = await worker.fetch(req('/sustainability/', 'text/markdown'));
  assert.match(r.headers.get('content-type'), /text\/markdown/);
}));
