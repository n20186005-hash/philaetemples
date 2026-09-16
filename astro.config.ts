import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.PUBLIC_SITE_URL || undefined;

export default defineConfig({
  site,
  output: 'server',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: site ? [sitemap()] : [],
  vite: { plugins: [tailwindcss()] },
});
