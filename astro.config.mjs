import { defineConfig } from 'astro/config';
import preact from '@astrojs/renderer-preact';

export default defineConfig({
  site: 'https://befwi.github.io',
  base: '/caribbean-countdowns',
  integrations: [preact()],
});