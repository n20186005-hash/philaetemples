# Philae independent visitor guide

Arabic at `/` and English at `/en/`, using Astro server output and the Cloudflare adapter. Existing package and lock versions are retained. The historical build environment uses Node22.14.0 and pnpm10.11.1: `pnpm install --frozen-lockfile`, `pnpm run build`, then `npx wrangler deploy`. Only the reviewed esbuild and workerd native installers are allowed; the exact versions are locked.

Weather is rendered at request time from fixed Philae-area coordinates, validated for model time and forecast dates, cached in process for at most15minutes and unavailable on failed/invalid refresh. It is not a temple observation, warning or boat/access clearance. The retired service worker deletes only this site's old cache namespace and does not intercept requests.

The Worker entry guards established HTTP/www and index aliases before static handling, serves locale-aware true404/noindex, and applies security headers to SSR too. The generated Cloudflare entry and default deploy dry-run must be checked after each build. Local verification is not proof of a production build or domain binding.

Hours and tariffs are dated source comparisons, including the official16:00 close, ticket portal15:00 last entry and later third-party Maps listing. The guide sells no tickets. Boat and evening-show arrangements require separate confirmation. See public source links, privacy disclosures and per-display photograph credits; this is an independent noncommercial information site, not a registered-charity claim.
