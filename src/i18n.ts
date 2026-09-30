export type Locale = 'ar' | 'en';

export const locales: Locale[] = ['ar', 'en'];
export const defaultLocale: Locale = 'ar';

export const htmlLang: Record<Locale, string> = { ar: 'ar', en: 'en' };
export const dir: Record<Locale, 'rtl' | 'ltr'> = { ar: 'rtl', en: 'ltr' };
export const ogLocale: Record<Locale, string> = { ar: 'ar_EG', en: 'en_US' };

/** BCP-47 code used for Intl formatting (weekday, dates). */
export const bcp47: Record<Locale, string> = { ar: 'ar-EG', en: 'en-GB' };

/**
 * Maps a pathname to its equivalent on the given locale.
 * Root page: ar -> "/", en -> "/en/".
 * (Extend here when sub-pages are added.)
 */
export function localizedPath(locale: Locale, currentPath: string): string {
  const clean = currentPath.replace(/^\/+/, '').replace(/\/+$/, '');
  const segs = clean.split('/').filter(Boolean);
  if (segs[0] === 'en') segs.shift();
  const rest = segs.join('/');
  if (locale === 'ar') return rest ? `/${rest}/` : '/';
  return rest ? `/en/${rest}/` : '/en/';
}

/** hreflang alternates for the current page path. */
export function hreflangAlternates(site: URL, currentPath: string): { hreflang: string; href: string }[] {
  const base = site.toString().replace(/\/$/, '');
  const ar = base + localizedPath('ar', currentPath);
  const en = base + localizedPath('en', currentPath);
  return [
    { hreflang: 'ar', href: ar },
    { hreflang: 'en', href: en },
    { hreflang: 'x-default', href: ar },
  ];
}
