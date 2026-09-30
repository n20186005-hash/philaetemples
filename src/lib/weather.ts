// Server-side weather via Open-Meteo (no API key required).
// Fetched at request time on the Cloudflare Worker and cached in-memory (TTL).
// Returns raw readings and a visitor-facing "smart advice" derived from them,
// localized for Arabic and English.

import type { Locale } from '../i18n';

export interface CurrentWeather {
  temperature: number;
  apparent: number;
  humidity: number;
  wind: number;
  code: number;
  precipitation: number;
  uv: number;
  time: string;
}

export interface DayForecast {
  date: string;
  code: number;
  tmax: number;
  tmin: number;
  rainProb: number;
  uvMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  current: CurrentWeather;
  days: DayForecast[];
  updated: string;
}

export interface WeatherInfo {
  label: string;
  icon: string;
}

const ICON: Record<number, string> = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️', 56: '🌧️', 57: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️', 66: '🌧️', 67: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '❄️', 77: '🌨️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  85: '🌨️', 86: '❄️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
};

const LABEL: Record<Locale, Record<number, string>> = {
  ar: {
    0: 'صافٍ', 1: 'صافٍ مع بعض السحب', 2: 'غائم جزئياً', 3: 'غائم',
    45: 'ضباب', 48: 'ضباب متجمّد',
    51: 'رذاذ خفيف', 53: 'رذاذ', 55: 'رذاذ كثيف', 56: 'رذاذ متجمّد', 57: 'رذاذ متجمّد كثيف',
    61: 'مطر خفيف', 63: 'مطر', 65: 'مطر غزير', 66: 'مطر متجمّد', 67: 'مطر متجمّد غزير',
    71: 'ثلوج خفيفة', 73: 'ثلوج', 75: 'ثلوج كثيفة', 77: 'حُبيبات ثلج',
    80: 'زخات مطر', 81: 'زخات مطر', 82: 'زخات مطر غزيرة',
    85: 'زخات ثلج', 86: 'زخات ثلج كثيفة',
    95: 'عاصفة رعدية', 96: 'عاصفة رعدية مع بَرَد', 99: 'عاصفة رعدية شديدة مع بَرَد',
  },
  en: {
    0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Dense drizzle', 56: 'Freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Heavy freezing rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Rain showers', 81: 'Rain showers', 82: 'Violent rain showers',
    85: 'Snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm with hail',
  },
};

export function describeCode(code: number, locale: Locale = 'ar'): WeatherInfo {
  return { label: LABEL[locale][code] ?? (locale === 'ar' ? 'غير محدّد' : 'Unspecified'), icon: ICON[code] ?? '🌡️' };
}

export interface WindInfo {
  level: number;
  word: string;
}

const WIND_WORD: Record<Locale, (level: number) => string> = {
  ar: (l) => (l <= 2 ? 'هادئة' : l <= 4 ? 'خفيفة' : l <= 6 ? 'نشطة' : 'قوية'),
  en: (l) => (l <= 2 ? 'calm' : l <= 4 ? 'light' : l <= 6 ? 'fresh' : 'strong'),
};

export function windInfo(kmh: number, locale: Locale = 'ar'): WindInfo {
  let level: number;
  if (kmh < 1) level = 0;
  else if (kmh <= 5) level = 1;
  else if (kmh <= 11) level = 2;
  else if (kmh <= 19) level = 3;
  else if (kmh <= 28) level = 4;
  else if (kmh <= 38) level = 5;
  else if (kmh <= 49) level = 6;
  else if (kmh <= 61) level = 7;
  else if (kmh <= 74) level = 8;
  else if (kmh <= 88) level = 9;
  else if (kmh <= 102) level = 10;
  else level = 11;
  return { level, word: WIND_WORD[locale](level) };
}

function rainCategory(code: number): 'none' | 'light' | 'medium' | 'storm' {
  if (code >= 95) return 'storm';
  if ([61, 63, 65, 66, 67, 81, 82].includes(code)) return 'medium';
  if ([51, 53, 55, 56, 57, 80].includes(code)) return 'light';
  return 'none';
}

export interface Advice {
  travel: string[];
  activity: string[];
  items: string[];
  risks: string[];
}

const ADVICE: Record<Locale, {
  rainHi: string; rainHiAct: string; rainHiItem: string;
  rainLight: string; rainLightItem: string;
  rainMedRisk: string; rainMedAct: string; rainMedItem: string;
  rainStormRisk: string; rainStormItem: string;
  hotTravel: string; hotAct: string; hotItem: string;
  uvTravel: string; uvItem: string;
  diffTravel: string; diffItem: string;
  coldTravel: string; coldItem: string;
  windHiRisk: string; windHiAct: string;
  windMedTravel: string; windMedAct: string; windMedItem: string;
  clearTravel: string; clearAct: string;
  cloudTravel: string; cloudAct: string;
  fogRisk: string; fogAct: string; fogItem: string;
  calm: string;
}> = {
  ar: {
    rainHi: 'احتمال المطر مرتفع اليوم، خذ مظلّةً أو رداءَ مطر.',
    rainHiAct: 'فضّل المسارات المظلّلة؛ ورحلةُ القارب إلى الجزيرة قد تتأثر بالأمطار.',
    rainHiItem: 'مظلّةٌ قابلة للطي أو رداء مطر.',
    rainLight: 'أمطارٌ خفيفة محتملة، الأرض زلقة فانتبه أثناء المشي.',
    rainLightItem: 'مظلّةٌ صغيرة.',
    rainMedRisk: 'مطرٌ متوسط إلى غزير — تجنّب المنحدرات والمناطق المنخفضة؛ وقد يتوقف القارب النهري.',
    rainMedAct: 'لا تجلس طويلاً في العراء؛ احمل رداءَ مطرٍ لا مظلّةً طويلة (تقلّب الرياح).',
    rainMedItem: 'رداءُ مطر.',
    rainStormRisk: 'عاصفةٌ رعدية — لا تصعد المرتفعات، ولا تجلس تحت الأشجار؛ وتتوقف المراكبُ المائية غالباً.',
    rainStormItem: 'رداءُ مطر.',
    hotTravel: 'الحرارة مرتفعة، تجنّب الخروج وقت الظهيرة.',
    hotAct: 'قصّر وقتَ البقاء في العراء، واسترح في الظل بين الحين والآخر.',
    hotItem: 'واقٍ شمسي، ماءٌ كافٍ، وأدواتُ تبريد.',
    uvTravel: 'الأشعةُ الشمسية قوية، احمِ بشرتك منها.',
    uvItem: 'كريمُ وقاية شمسية، نظارةٌ شمسية، وقبعة.',
    diffTravel: 'فارقُ الحرارة بين النهار والليل كبير؛ احمل طبقةً إضافية لتلبسها لاحقاً.',
    diffItem: 'جاكيتٌ خفيف.',
    coldTravel: 'الحرارة منخفضة، دفّئ نفسك جيداً.',
    coldItem: 'معطفٌ سميك ووشاح.',
    windHiRisk: 'رياحٌ قوية — ابتعد عن حواف الماء؛ وتتوقف المراكبُ النهرية غالباً.',
    windHiAct: 'المشاريعُ المائية مغلقةٌ في الغالب اليوم.',
    windMedTravel: 'الرياح نشطة بعض الشيء اليوم.',
    windMedAct: 'قد تتأثر مراكبُ النيل بالرياح؛ تحقّق قبل الركوب.',
    windMedItem: 'القبعة قد تطير؛ تجنّب الثياب الواسعة الطويلة.',
    clearTravel: 'الجو صافٍ ومناسب للزيارة الخارجية.',
    clearAct: 'وقتٌ ممتاز لمشاهدة الشروق والغروب على النيل.',
    cloudTravel: 'الضوء ناعم ومناسب جداً للتصوير.',
    cloudAct: 'بلا حرٍّ لاهب، مناسب للتجوّل الطويل.',
    fogRisk: 'ضبابٌ كثيف — الرؤية ضعيفة، وقد تتأخر المراكبُ النهرية.',
    fogAct: 'غير مناسب لمشاهدة المناظر البعيدة اليوم.',
    fogItem: 'كمامة.',
    calm: 'أحوالٌ معتدلة عموماً اليوم — استمتع بزيارتك دون قلق خاص.',
  },
  en: {
    rainHi: 'High chance of rain today — bring a folding umbrella or raincoat.',
    rainHiAct: 'Favour shaded routes; the boat crossing to the island can be affected by rain.',
    rainHiItem: 'A packable umbrella or raincoat.',
    rainLight: 'Possible light rain; surfaces may be slippery, watch your step.',
    rainLightItem: 'A small umbrella.',
    rainMedRisk: 'Moderate to heavy rain — avoid slopes and low areas; the ferry may stop running.',
    rainMedAct: 'Do not sit out in the open long; carry a raincoat rather than a long umbrella (gusty wind).',
    rainMedItem: 'A raincoat.',
    rainStormRisk: 'Thunderstorm — do not climb heights or sit under trees; watercraft usually stop.',
    rainStormItem: 'A raincoat.',
    hotTravel: 'High heat — avoid going out at midday.',
    hotAct: 'Keep time in the open short and rest in the shade now and then.',
    hotItem: 'Sun protection, plenty of water, and cooling items.',
    uvTravel: 'Strong UV — protect your skin.',
    uvItem: 'Sunscreen, sunglasses, and a hat.',
    diffTravel: 'Large day-to-night temperature swing — carry an extra layer for later.',
    diffItem: 'A light jacket.',
    coldTravel: 'Low temperatures — keep warm.',
    coldItem: 'A thick coat and scarf.',
    windHiRisk: 'Strong wind — stay away from water edges; river ferries often stop.',
    windHiAct: 'Water activities are generally closed today.',
    windMedTravel: 'A little breezy today.',
    windMedAct: 'Nile ferries may be affected by wind; check before boarding.',
    windMedItem: 'Your hat may blow away; avoid long, loose clothing.',
    clearTravel: 'Clear and pleasant for an outdoor visit.',
    clearAct: 'A great time for sunrise and sunset over the Nile.',
    cloudTravel: 'Soft light, excellent for photography.',
    cloudAct: 'No scorching heat — good for long walks.',
    fogRisk: 'Dense fog — poor visibility; river ferries may be delayed.',
    fogAct: 'Not ideal for distant views today.',
    fogItem: 'A mask.',
    calm: 'Generally mild conditions today — enjoy your visit without special concern.',
  },
};

export function buildAdvice(w: WeatherData, locale: Locale = 'ar'): Advice {
  const a: Advice = { travel: [], activity: [], items: [], risks: [] };
  const t = ADVICE[locale];
  const today = w.days[0];
  if (!today) return a;

  const tmax = today.tmax;
  const tmin = today.tmin;
  const rainProb = today.rainProb;
  const uvMax = today.uvMax;
  const code = today.code;
  const wind = w.current.wind;
  const { level: windLvl } = windInfo(wind, locale);

  if (rainProb >= 60) {
    a.travel.push(t.rainHi);
    a.activity.push(t.rainHiAct);
    a.items.push(t.rainHiItem);
  }

  const rc = rainCategory(code);
  if (rc === 'light') {
    a.travel.push(t.rainLight);
    a.items.push(t.rainLightItem);
  } else if (rc === 'medium') {
    a.risks.push(t.rainMedRisk);
    a.activity.push(t.rainMedAct);
    a.items.push(t.rainMedItem);
  } else if (rc === 'storm') {
    a.risks.push(t.rainStormRisk);
    a.items.push(t.rainStormItem);
  }

  const hot = Math.max(tmax, w.current.temperature) >= 32;
  if (hot) {
    a.travel.push(t.hotTravel);
    a.activity.push(t.hotAct);
    a.items.push(t.hotItem);
  }

  if (uvMax >= 5) {
    a.travel.push(t.uvTravel);
    a.items.push(t.uvItem);
  }

  if (tmax - tmin > 8) {
    a.travel.push(t.diffTravel);
    a.items.push(t.diffItem);
  }
  if (tmax <= 10) {
    a.travel.push(t.coldTravel);
    a.items.push(t.coldItem);
  }

  if (windLvl >= 7) {
    a.risks.push(t.windHiRisk);
    a.activity.push(t.windHiAct);
  } else if (windLvl >= 5) {
    a.travel.push(t.windMedTravel);
    a.activity.push(t.windMedAct);
    a.items.push(t.windMedItem);
  }

  if ((code === 0 || code === 1) && !hot) {
    a.travel.push(t.clearTravel);
    a.activity.push(t.clearAct);
  } else if (code === 2 || code === 3) {
    a.travel.push(t.cloudTravel);
    a.activity.push(t.cloudAct);
  }

  if (code === 45 || code === 48) {
    a.risks.push(t.fogRisk);
    a.activity.push(t.fogAct);
    a.items.push(t.fogItem);
  }

  return a;
}

interface CacheEntry {
  data: WeatherData;
  ts: number;
}

let cache: CacheEntry | null = null;
const TTL = 30 * 60 * 1000; // 30 minutes

const LAT = 24.0255836;
const LNG = 32.8841021;

export async function getWeather(): Promise<WeatherData | null> {
  const now = Date.now();
  if (cache && now - cache.ts < TTL) return cache.data;

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset` +
    `&timezone=Africa%2FCairo&forecast_days=7&wind_speed_unit=kmh`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`weather ${res.status}`);
    const j = (await res.json()) as any;
    const data: WeatherData = {
      current: {
        temperature: j.current.temperature_2m,
        apparent: j.current.apparent_temperature,
        humidity: j.current.relative_humidity_2m,
        wind: j.current.wind_speed_10m,
        code: j.current.weather_code,
        precipitation: j.current.precipitation,
        uv: j.current.uv_index,
        time: j.current.time,
      },
      days: j.daily.time.map((d: string, i: number) => ({
        date: d,
        code: j.daily.weather_code[i],
        tmax: j.daily.temperature_2m_max[i],
        tmin: j.daily.temperature_2m_min[i],
        rainProb: j.daily.precipitation_probability_max[i],
        uvMax: j.daily.uv_index_max[i],
        sunrise: j.daily.sunrise[i],
        sunset: j.daily.sunset[i],
      })),
      updated: new Date().toISOString(),
    };
    cache = { data, ts: now };
    return data;
  } catch {
    return cache?.data ?? null;
  }
}
