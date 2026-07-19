import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://caribbean.countdowns.co',
  base: '/',
  build: {
    // Emit ALL CSS as external files (no inline <style>) so the CSP can drop
    // 'unsafe-inline' from style-src → required for Observatory A+ under algorithm v5.
    inlineStylesheets: 'never'
  }
});
