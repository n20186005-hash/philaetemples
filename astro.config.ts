import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Always set an absolute site so canonical / OG / sitemap URLs are produced.
// Override with PUBLIC_SITE_URL in CI / production if needed.
const site = process.env.PUBLIC_SITE_URL || 'https://philaetemples.com';

export default defineConfig({
  site,
  output: 'server',
  adapter: cloudflare({ imageService: 'compile', configPath:'./wrangler.jsonc' }),
  integrations: [sitemap({filter:url=>!/^\/(?:en\/)?404(?:\/|\.html)?$/.test(new URL(url).pathname)})],
  vite: { plugins: [tailwindcss()] },
});
