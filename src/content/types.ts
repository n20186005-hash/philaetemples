export interface Card {
  icon?: string;
  tag: string;
  title: string;
  text?: string;
}

export interface Option {
  tag: string;
  title: string;
  text: string;
}

export interface SeasonRow {
  season: string;
  range: string;
  climate: string;
  nile: string;
  advice: string;
  photo: string;
}

export interface PlanCard {
  icon: string;
  title: string;
  items: string[];
}

export interface RouteCard {
  title: string;
  steps: string[];
}

export interface ServiceItem {
  icon: string;
  title: string;
  text: string;
}

export interface ResponsibilityItem {
  title: string;
  text: string;
  accent?: boolean;
}

export interface AroundItem {
  tag: string;
  title: string;
  text: string;
  accent?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface GuideContent {
  dir: 'rtl' | 'ltr';
  /** Header / language switch */
  nav: { story: string; history: string; gettingThere: string; weather: string; services: string; faq: string };
  switchLabel: { to: string; href: string };
  openMap: string;

  /** Hero */
  hero: { kicker: string; h1a: string; h1b: string; subtitle: string; ctaPlan: string; ctaHow: string; coords: string };

  /** 01 Story */
  story: {
    label: string; h2a: string; h2b: string;
    p1: string; p2: string;
    cards: Card[];
  };

  /** 02 History */
  history: {
    label: string; h2: string;
    paras: string[];
    myth: { label: string; text: string };
    light: { label: string; text: string };
  };

  /** 03 Visit */
  visit: {
    label: string; h2: string;
    ratingNote: string;
    cards: Card[];
    expenses: { title: string; items: { label: string; value: string }[]; note: string };
    parking: { title: string; text: string };
  };

  /** 04 Reviews */
  reviews: {
    label: string; h2a: string; h2b: string;
    score: string; scoreNote: string;
    sourceNote1: string; sourceNote2: string;
    cta: string;
  };

  /** 05 Getting there */
  gettingThere: { label: string; h2: string; intro: string; options: Option[] };

  /** 06 Weather */
  weather: { label: string; h2: string; sub: string; fall: string; nowLabel: string };

  /** 07 Seasons */
  seasons: { label: string; h2: string; intro: string; tableNote: string; rows: SeasonRow[] };

  /** 08 Plans */
  plans: { label: string; h2: string; cards: PlanCard[] };

  /** 09 Routes */
  routes: { label: string; h2: string; half: RouteCard; full: RouteCard };

  /** 10 Services */
  services: { label: string; h2: string; intro: string; items: ServiceItem[] };

  /** 11 Responsibility */
  responsibility: { label: string; h2a: string; h2b: string; items: ResponsibilityItem[] };

  /** 12 Around */
  around: { label: string; h2a: string; h2b: string; intro: string; items: AroundItem[] };

  /** 13 Map */
  map: { label: string; h2: string; address: string; officialNote: string };

  /** 14 FAQ */
  faq: { label: string; h2: string; items: FaqItem[] };

  /** Sources */
  sources: { label: string; h2: string; texts: string[] };

  /** Footer */
  footer: { brand: string; tagline: string; disclaimer: string };
}
