import { SITE, HERO_IMG } from '../data/site';
import type { Locale } from '../i18n';

export function attractionSchema(locale: Locale) {
  const site = `https://${SITE.domain}`;
  const description =
    locale === 'ar'
      ? `دليل زائر شامل لمعبد فيله في أسوان: الموقع، طريقة الوصول بالقارب، الطقس الحيّ، الاستراتيجية الموسمية، وخدمات الزوّار.`
      : `Comprehensive visitor guide to Philae Temple in Aswan, Egypt: location, how to reach it by boat, live weather, seasonal strategy, and visitor services.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${site}/#attraction`,
    name: SITE.attractionFull,
    alternateName: [SITE.attractionShort, `${SITE.city} ${SITE.attractionFull}`, SITE.attractionAr],
    description,
    url: site,
    image: [`${site}${HERO_IMG}`],
    isAccessibleForFree: false,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.addressLine,
      addressLocality: SITE.locality,
      addressRegion: SITE.state,
      postalCode: SITE.postal,
      addressCountry: SITE.countryCode,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.lat, longitude: SITE.lng },
    openingHours: SITE.openingHours,
    hasMap: SITE.mapsShare,
    sameAs: [SITE.mapsShare, SITE.govtUrl],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: SITE.rating,
      reviewCount: SITE.reviews,
      bestRating: 5,
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}
