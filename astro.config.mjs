import { defineConfig } from 'astro/config';
import * as preactMod from '@astrojs/renderer-preact';

const preact = preactMod.default ?? preactMod.preact ?? preactMod;

export default defineConfig({
  site: 'https://befwi.github.io',
  base: '/caribbean-countdowns',
  integrations: [typeof preact === 'function' ? preact() : preact],
});
