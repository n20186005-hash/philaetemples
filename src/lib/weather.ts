// Server-side weather via Open-Meteo (no API key required).
// Fetched at request time on the Cloudflare Worker and cached in-memory (TTL).
// Returns model fields and cautious planning advice derived from them,
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
  ageSeconds: number;
  timezone: string;
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

export interface Advice { travel:string[];activity:string[];items:string[];risks:string[] }
export function buildAdvice(w:WeatherData,locale:Locale='ar'):Advice {
 const a:Advice={travel:[],activity:[],items:[],risks:[]},d=w.days[0];if(!d)return a;
 const t=(ar:string,en:string)=>locale==='ar'?ar:en;const codes=[w.current.code,d.code];const has=(values:number[])=>codes.some(c=>values.includes(c));
 const storm=has([95,96,99]),freezing=has([56,57,66,67]),heavy=has([65,82]),moderate=has([63,81]),light=has([51,53,55,61,80]),snow=has([71,73,75,77,85,86]);
 if(storm){a.risks.push(t('عاصفة رعدية في النموذج: ابتعد عن الماء والأرض المكشوفة ولا تحتمِ تحت الأشجار. راجع التحذيرات الرسمية.','Thunderstorm in the model: leave exposed ground and the water; do not shelter under trees. Check official warnings.'));a.items.push(t('رداء مطر بغطاء للرأس.','A hooded raincoat.'));}
 if(freezing){a.risks.push(t('مطر أو رذاذ متجمد: قد يتكوّن الجليد على السطوح؛ أجّل المسار الزلق واطلب توجيهاً محلياً.','Freezing rain or drizzle: surfaces may ice. Delay slippery routes and seek local guidance.'));a.items.push(t('طبقات دافئة مقاومة للماء وحذاء مناسب.','Warm waterproof layers and suitable footwear.'));}
 if(heavy){a.risks.push(t('مطر غزير في النموذج: تجنب المناطق المنخفضة والماء الجاري والسطوح الزلقة.','Heavy rain in the model: avoid low ground, flowing water and slippery surfaces.'));a.items.push(t('رداء مطر وحذاء مقاوم للماء.','A raincoat and waterproof footwear.'));}
 if(moderate||light){a.travel.push(t(moderate?'مطر متوسط: انتبه للسطوح الزلقة.':'مطر خفيف أو رذاذ: انتبه للسطوح الزلقة.',moderate?'Moderate rain: watch slippery surfaces.':'Light rain or drizzle: watch slippery surfaces.'));a.items.push(t('مظلّة مدمجة أو رداء مطر حسب الرياح.','Compact umbrella or raincoat, subject to wind conditions.'));}
 if(snow){a.risks.push(t('ثلج في النموذج: افحص خطر الانزلاق وإمكانية الوصول محلياً.','Snow in the model: check slippery surfaces and access locally.'));a.items.push(t('طبقات دافئة وحذاء مقاوم للماء.','Warm layers and waterproof footwear.'));}
 if(d.rainProb>=60){a.travel.push(t('احتمال المطر مرتفع لكنه لا يحدد شدته. خطط بمرونة واحمل واقياً للمطر.','A high rain chance does not determine intensity. Keep plans flexible and carry rain protection.'));if(!a.items.length)a.items.push(t('مظلّة أو رداء مطر.','Umbrella or raincoat.'));}
 if(Math.max(d.tmax,w.current.temperature)>=32){a.travel.push(t('حرارة مرتفعة: قصّر الوقت المكشوف وخطط للماء والظل.','High heat: shorten exposed time and plan water and shade.'));a.items.push(t('ماء وغطاء رأس وواقي شمس.','Water, a hat and sun protection.'));}
 if(d.uvMax>=5)a.items.push(t('واقي شمس ونظارة وملابس تغطي الجلد.','Sun protection, sunglasses and covering clothing.'));
 if(d.tmax-d.tmin>8||d.tmax<=10)a.items.push(t('طبقة إضافية للبرودة.','An extra layer for cooler conditions.'));
 const force=windInfo(w.current.wind,locale).level;if(force>=7)a.risks.push(t('رياح قوية: ابتعد عن حافة الماء والمعدات غير المثبتة، واتبع تعليمات مشغّل القارب.','Strong wind: avoid exposed water edges and loose equipment; follow the boat operator’s instructions.'));else if(force>=5)a.travel.push(t('رياح نشطة: ثبّت الأغراض وافحص تعليمات الركوب.','Windy conditions: secure belongings and check boarding instructions.'));
 if(has([45,48]))a.risks.push(t('ضباب: قد تكون الرؤية ضعيفة؛ قيّم الطريق والعبور محلياً.','Fog: visibility may be poor; assess routes and crossings locally.'));
 if(!a.travel.length)a.travel.push(t('افحص الحرارة والرياح واحتمال المطر معاً؛ وصف السحاب وحده لا يثبت الراحة.','Check temperature, wind and rain probability together; cloud cover alone does not establish comfort.'));
 a.activity.push(t('البيانات ليست إعلان إغلاق أو تصريح إبحار. أكّد ساعات الدخول والقارب والعودة مع المشغّل واتبع التحذيرات المحلية.','These data are not a closure notice or sailing clearance. Confirm admission, boat operation and return arrangements with the operator, and follow local warnings.'));
 if(!a.items.length)a.items.push(t('ماء وحماية من الشمس مناسبة لظروف اليوم.','Water and sun protection appropriate to the day.'));return a;
}
const TTL=15*60*1000;
const URL='https://api.open-meteo.com/v1/forecast?latitude=24.0255836&longitude=32.8841021&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset&timezone=Africa%2FCairo&forecast_days=7&wind_speed_unit=kmh';
function stamp(time:string,offset:number){return Date.parse(time+'Z')-offset*1000;}
function valid(raw:any,now:number):boolean {
 const c=raw?.current,d=raw?.daily,o=raw?.utc_offset_seconds;if(!c||!d||raw.timezone!=='Africa/Cairo'||![7200,10800].includes(o)||typeof c.time!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(c.time))return false;
 const model=stamp(c.time,o);if(!Number.isFinite(model)||now-model>2*3600000||model-now>3600000)return false;
 if(!['temperature_2m','apparent_temperature','relative_humidity_2m','wind_speed_10m','weather_code','precipitation'].every(k=>typeof c[k]==='number'&&Number.isFinite(c[k])))return false;
 const times=d.time;if(!Array.isArray(times)||!times.length||times.length>7||times[0]!==new Date(now+o*1000).toISOString().slice(0,10))return false;
 if(!times.every((v:any,i:number)=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Date.parse(v+'T00:00:00Z')===Date.parse(times[0]+'T00:00:00Z')+i*86400000))return false;
 if(!['weather_code','temperature_2m_max','temperature_2m_min','precipitation_probability_max','uv_index_max'].every(k=>Array.isArray(d[k])&&d[k].length===times.length&&d[k].every((v:any)=>typeof v==='number'&&Number.isFinite(v))))return false;
 return ['sunrise','sunset'].every(k=>Array.isArray(d[k])&&d[k].length===times.length&&d[k].every((v:any)=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)));
}
export function createWeatherService(fetcher:typeof fetch=fetch,clock:()=>number=Date.now){
 let cache:{raw:any;data:WeatherData;ts:number}|null=null;
 return async function():Promise<WeatherData|null>{
  const now=clock();if(cache&&now-cache.ts>=0&&now-cache.ts<TTL&&valid(cache.raw,now))return {...cache.data,ageSeconds:Math.floor((now-cache.ts)/1000)};
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
  try{const response=await fetcher(URL,{signal:controller.signal});if(!response.ok)throw Error('Provider unavailable');const j=await response.json() as any,at=clock();if(!valid(j,at))throw Error('Invalid or old model');
   const data:WeatherData={current:{temperature:j.current.temperature_2m,apparent:j.current.apparent_temperature,humidity:j.current.relative_humidity_2m,wind:j.current.wind_speed_10m,code:j.current.weather_code,precipitation:j.current.precipitation,uv:j.daily.uv_index_max[0],time:j.current.time},days:j.daily.time.map((date:string,i:number)=>({date,code:j.daily.weather_code[i],tmax:j.daily.temperature_2m_max[i],tmin:j.daily.temperature_2m_min[i],rainProb:j.daily.precipitation_probability_max[i],uvMax:j.daily.uv_index_max[i],sunrise:j.daily.sunrise[i],sunset:j.daily.sunset[i]})),updated:new Date(at).toISOString(),ageSeconds:0,timezone:'Africa/Cairo'};
   cache={raw:j,data,ts:at};return data;
  }catch{return null;}finally{clearTimeout(timer);}
 };
}
export const getWeather=createWeatherService();
