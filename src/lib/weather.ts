// Server-side weather via Open-Meteo (no API key required).
// Fetched at request time on the Cloudflare Worker and cached in-memory (TTL).
// Returns both raw readings and a visitor-facing "smart advice" derived from them.

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

const CODE_MAP: Record<number, WeatherInfo> = {
  0: { label: 'صافٍ', icon: '☀️' },
  1: { label: 'صافٍ مع بعض السحب', icon: '🌤️' },
  2: { label: 'غائم جزئياً', icon: '⛅' },
  3: { label: 'غائم', icon: '☁️' },
  45: { label: 'ضباب', icon: '🌫️' },
  48: { label: 'ضباب متجمّد', icon: '🌫️' },
  51: { label: 'رذاذ خفيف', icon: '🌦️' },
  53: { label: 'رذاذ', icon: '🌦️' },
  55: { label: 'رذاذ كثيف', icon: '🌧️' },
  56: { label: 'رذاذ متجمّد', icon: '🌧️' },
  57: { label: 'رذاذ متجمّد كثيف', icon: '🌧️' },
  61: { label: 'مطر خفيف', icon: '🌧️' },
  63: { label: 'مطر', icon: '🌧️' },
  65: { label: 'مطر غزير', icon: '🌧️' },
  66: { label: 'مطر متجمّد', icon: '🌧️' },
  67: { label: 'مطر متجمّد غزير', icon: '🌧️' },
  71: { label: 'ثلوج خفيفة', icon: '🌨️' },
  73: { label: 'ثلوج', icon: '🌨️' },
  75: { label: 'ثلوج كثيفة', icon: '❄️' },
  77: { label: 'حُبيبات ثلج', icon: '🌨️' },
  80: { label: 'زخات مطر', icon: '🌦️' },
  81: { label: 'زخات مطر', icon: '🌧️' },
  82: { label: 'زخات مطر غزيرة', icon: '⛈️' },
  85: { label: 'زخات ثلج', icon: '🌨️' },
  86: { label: 'زخات ثلج كثيفة', icon: '❄️' },
  95: { label: 'عاصفة رعدية', icon: '⛈️' },
  96: { label: 'عاصفة رعدية مع بَرَد', icon: '⛈️' },
  99: { label: 'عاصفة رعدية شديدة مع بَرَد', icon: '⛈️' },
};

export function describeCode(code: number): WeatherInfo {
  return CODE_MAP[code] ?? { label: 'غير محدّد', icon: '🌡️' };
}

export interface WindInfo {
  level: number;
  word: string;
}

export function windInfo(kmh: number): WindInfo {
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

  let word: string;
  if (level <= 2) word = 'هادئة';
  else if (level <= 4) word = 'خفيفة';
  else if (level <= 6) word = 'نشطة';
  else word = 'قوية';

  return { level, word };
}

function rainCategory(code: number): 'none' | 'light' | 'medium' | 'storm' {
  if (code >= 95) return 'storm';
  if ([61, 63, 65, 66, 67, 81, 82].includes(code)) return 'medium';
  if ([51, 53, 55, 56, 57, 80].includes(code)) return 'light';
  return 'none';
}

// ---- Visitor-facing smart advice (dynamic, jargon-free) ----
export interface Advice {
  travel: string[]; // 出行穿搭 / الاستعداد والملبس
  activity: string[]; // 游玩安排 / ترتيب الزيارة
  items: string[]; // 随身物品 / ما تأخذ معك
  risks: string[]; // 风险提醒 / تنبيه
}

export function buildAdvice(w: WeatherData): Advice {
  const a: Advice = { travel: [], activity: [], items: [], risks: [] };
  const today = w.days[0];
  if (!today) return a;

  const tmax = today.tmax;
  const tmin = today.tmin;
  const rainProb = today.rainProb;
  const uvMax = today.uvMax;
  const code = today.code;
  const wind = w.current.wind;
  const { level: windLvl } = windInfo(wind);

  // 降水概率（≠一定会下雨）
  if (rainProb >= 60) {
    a.travel.push('احتمال المطر مرتفع اليوم، خذ مظلّةً أو رداءَ مطر.');
    a.activity.push('فضّل المسارات المظلّلة؛ ورحلةُ القارب إلى الجزيرة قد تتأثر بالأمطار.');
    a.items.push('مظلّةٌ قابلة للطي أو رداء مطر.');
  }

  // 实际降水状况
  const rc = rainCategory(code);
  if (rc === 'light') {
    a.travel.push('أمطارٌ خفيفة محتملة، الأرض زلقة فانتبه أثناء المشي.');
    a.items.push('مظلّةٌ صغيرة.');
  } else if (rc === 'medium') {
    a.risks.push('مطرٌ متوسط إلى غزير — تجنّب المنحدرات والمناطق المنخفضة؛ وقد يتوقف القارب النهري.');
    a.activity.push('لا تجلس طويلاً في العراء؛ احمل رداءَ مطرٍ لا مظلّةً طويلة (تقلّب الرياح).');
    a.items.push('رداءُ مطر.');
  } else if (rc === 'storm') {
    a.risks.push('عاصفةٌ رعدية — لا تصعد المرتفعات، ولا تجلس تحت الأشجار؛ وتتوقف المراكبُ المائية غالباً.');
    a.items.push('رداءُ مطر.');
  }

  // 高温
  const hot = Math.max(tmax, w.current.temperature) >= 32;
  if (hot) {
    a.travel.push('الحرارة مرتفعة، تجنّب الخروج وقت الظهيرة.');
    a.activity.push('قصّر وقتَ البقاء في العراء، واسترح في الظل بين الحين والآخر.');
    a.items.push('واقٍ شمسي، ماءٌ كافٍ، وأدواتُ تبريد.');
  }

  // 紫外线
  if (uvMax >= 5) {
    a.travel.push('الأشعةُ الشمسية قوية، احمِ بشرتك منها.');
    a.items.push('كريمُ وقاية شمسية، نظارةٌ شمسية، وقبعة.');
  }

  // 低温 / 昼夜温差
  if (tmax - tmin > 8) {
    a.travel.push('فارقُ الحرارة بين النهار والليل كبير؛ احمل طبقةً إضافية لتلبسها لاحقاً.');
    a.items.push('جاكيتٌ خفيف.');
  }
  if (tmax <= 10) {
    a.travel.push('الحرارة منخفضة، دفّئ نفسك جيداً.');
    a.items.push('معطفٌ سميك ووشاح.');
  }

  // 风力（影响尼罗河摆渡船）
  if (windLvl >= 7) {
    a.risks.push('رياحٌ قوية — ابتعد عن حواف الماء واللوحات؛ وتتوقف المراكبُ النهرية غالباً.');
    a.activity.push('المشاريعُ المائية مغلقةٌ في الغالب اليوم.');
  } else if (windLvl >= 5) {
    a.travel.push('الرياح نشطة بعض الشيء اليوم.');
    a.activity.push('قد تتأثر مراكبُ النيل بالرياح؛ تحقّق قبل الركوب.');
    a.items.push('القبعة قد تطير؛ تجنّب الثياب الواسعة الطويلة.');
  }

  // 晴 / 阴
  if ((code === 0 || code === 1) && !hot) {
    a.travel.push('الجو صافٍ ومناسب للزيارة الخارجية.');
    a.activity.push('وقتٌ ممتاز لمشاهدة الشروق والغروب على النيل.');
  } else if (code === 2 || code === 3) {
    a.travel.push('الضوء ناعم ومناسب جداً للتصوير.');
    a.activity.push('بلا حرٍّ لاهب، مناسب للتجوّل الطويل.');
  }

  // 雾
  if (code === 45 || code === 48) {
    a.risks.push('ضبابٌ كثيف — الرؤية ضعيفة، وقد تتأخر المراكبُ النهرية.');
    a.activity.push('غير مناسب لمشاهدة المناظر البعيدة اليوم.');
    a.items.push('كمامة.');
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
