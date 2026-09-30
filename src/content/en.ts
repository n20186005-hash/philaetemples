import type { GuideContent } from './types';

export const en: GuideContent = {
  dir: 'ltr',
  nav: { story: 'The Place', history: 'History', gettingThere: 'Getting There', weather: 'Weather', services: 'Services', faq: 'FAQ' },
  switchLabel: { to: 'العربية', href: '/' },
  openMap: 'Open Map',

  hero: {
    kicker: 'Aswan · Upper Egypt',
    h1a: 'Philae',
    h1b: 'Where the Nile grows still',
    subtitle: 'The Temple of Isis above Agilkia Island. Here the monuments are not behind glass — you hear them approach with the dip of the oar.',
    ctaPlan: 'Plan your day',
    ctaHow: 'How to get there',
    coords: '24° 01′ 32″ N\n32° 53′ 03″ E',
  },

  story: {
    label: '01 · The Place',
    h2a: 'An island that holds',
    h2b: 'a whole memory',
    p1: 'Philae was dedicated to the goddess Isis, and its parts were built across successive Ptolemaic and Roman eras. When the waters of the High Dam threatened the old island, the whole complex was moved stone by stone to Agilkia Island in an international rescue project.',
    p2: 'Today the journey is part of the meaning: a small boat, wide water, then a stone gateway slowly appearing out of the Nile’s blue.',
    cards: [
      { tag: 'The approach', title: 'Begin from the water', text: '' },
      { tag: 'The scene', title: 'Rock, palm, and light', text: '' },
      { tag: 'The rhythm', title: 'Leave time for sunset', text: '' },
    ],
  },

  history: {
    label: '02 · History & Story',
    h2: 'A temple across three thousand years',
    paras: [
      'The name “Philae” comes from Greek, a corruption of the ancient Egyptian “Pilak” meaning “the remote island” or “the end place” — it marked the southern limit of Egyptian temple architecture at the First Cataract of the Nile.',
      'Philae was a destination for the worship of Isis, goddess of magic and motherhood; Egyptians and Nubians gathered there, as did pilgrims from Greece and Rome. The temple flourished until the 6th century AD.',
      'The complex was built in stages: a core from the reign of Nectanebo I (30th Dynasty), then Ptolemaic and Roman additions, including the famous Trajan’s Kiosk with its slender façade.',
      'After the High Dam raised the level of Lake Nasser, UNESCO and an international team relocated the temple stone by stone (1972–1980) to the nearby, higher and safer Agilkia Island — one of the most successful heritage rescues in the world.',
    ],
    myth: {
      label: 'In the myths',
      text: 'In Egyptian mythology, Isis gathered the pieces of Osiris and restored him to life for a few hours; Philae was one of the sacred stops on her journey. This story made the place a symbol of motherhood and eternity across the ages.',
    },
    light: {
      label: 'Sound & Light Show',
      text: 'The island’s history is told at night through a multilingual “Sound and Light” show — another way to discover Philae after sunset, when the heat eases and light dances across the stones.',
    },
  },

  visit: {
    label: '03 · Plan Your Visit',
    h2: 'The map of a perfect day',
    ratingNote: 'Visitor rating 4.8 / 5 from 14,836 reviews',
    cards: [
      { icon: '◌', title: 'Timing', text: 'Open daily; maps show closing at 5 pm. Verify locally before you set off.' },
      { icon: '↝', title: 'The boat', text: 'Reaching it by boat is central to the experience. Agree the boat fare before boarding; it is usually not included in the site ticket.' },
      { icon: '✧', title: 'Rhythm', text: 'Allow 2–3 hours for the temple, the boat, and photos — more if you want the Sound and Light show.' },
      { icon: '☼', title: 'Season', text: 'Winter is gentler. In summer, choose early morning and bring water, a hat, and comfortable shoes.' },
    ],
    expenses: {
      title: 'Costs in brief',
      items: [
        { label: 'Site ticket', value: 'Varies by category' },
        { label: 'Boat trip', value: 'Agreed with the boatman' },
        { label: 'Sound & Light show', value: 'Optional extra' },
      ],
      note: 'Prices change; we do not rely on an outdated fixed figure.',
    },
    parking: {
      title: 'Parking & getting around',
      text: 'Do not expect a car park at the temple itself; park near the marina or departure point, then continue by boat. From central Aswan, a taxi or ride app to the marina is the simplest option. Ask the driver for “Philae Temple boat dock”.',
    },
  },

  reviews: {
    label: '04 · Visitor Voices',
    h2a: 'What do',
    h2b: 'visitors say?',
    score: '4.8',
    scoreNote: '/ 5 · from 14,836 reviews',
    sourceNote1: 'Ratings and review counts are synced from Google Maps user ratings · September 2026 ·',
    sourceNote2: 'Synced from Google Maps user ratings, sync time September 2026; copyright belongs to the original authors and Google Maps.',
    cta: 'See all reviews on Google Maps',
  },

  gettingThere: {
    label: '05 · Getting There',
    h2: 'How do you reach Philae?',
    intro: 'Every route starts at the “Philae Temple marina” near the High Dam, where you take a boat to the island. Here are options by your starting point.',
    options: [
      { tag: '01 · From the airport', title: 'Aswan International Airport (ASW)', text: 'About 18 km south of the city. Simplest: a taxi or ride app straight from the airport to the marina (20–30 min). No train from the airport, and public transport here is almost nonexistent.' },
      { tag: '02 · By train / bus', title: 'From Cairo or Luxor', text: 'Arrive at Aswan station, then a taxi or ride app to the marina (10–15 min). The station is close to the city centre and lodging areas.' },
      { tag: '03 · Within Aswan', title: 'Public transport', text: 'Minibuses and servees reach the High Dam / marina area for a small fare, but with no fixed schedule. Ask the driver for “Philae marina” or “High Dam”.' },
      { tag: '04 · Taxi / app', title: 'Clearest and most comfortable', text: 'Request “Philae Temple boat dock” or “Philae Temple marina”, and agree the fare in advance or via the app / meter to avoid confusion.' },
      { tag: '05 · Marina → temple', title: 'The final boat', text: 'A small boat (motor or sail) crosses you to Agilkia Island in minutes. Agree the boat fare before boarding, and do not expect a car park at the temple itself.' },
    ],
  },

  weather: {
    label: '06 · Weather & Tips',
    h2: 'Current weather and visit advice',
    sub: 'Do not settle for the numbers — here is what the weather practically means for your trip to the island.',
    fall: 'Weather data could not be loaded right now; please try again later.',
    nowLabel: 'Now in Aswan',
  },

  seasons: {
    label: '07 · When to Visit?',
    h2: 'A four-season strategy',
    intro: 'Aswan has an extremely dry desert climate. Here is a simplified comparison based on general annual climate averages, to plan your trip.',
    tableNote: 'General climate averages for guidance; actual conditions vary — check live weather before visiting.',
    rows: [
      { season: 'Winter', range: 'December–February', climate: 'Days 23–25°C, nights 8–11°C. Dry and sunny.', nile: 'Low, clear water level; soft light.', advice: 'Peak and most comfortable season; book early, mornings are ideal.', photo: 'Long golden hours and clear skies.' },
      { season: 'Spring', range: 'March–May', climate: '30–38°C rising; warm “Khamsin” winds carrying dust at times.', nile: 'Warm water, surface wind movement.', advice: 'A good transitional season; watch dust and stay hydrated.', photo: 'Potentially dramatic dust skies.' },
      { season: 'Summer', range: 'June–August', climate: '40–45°C, very dry, scorching sun, very little rain.', nile: 'Calm, hot Nile.', advice: 'Avoid midday; go at opening / closing, bring water and a hat.', photo: 'Harsh by day, but the blue hour is gentle; Sound & Light is comfortable.' },
      { season: 'Autumn', range: 'September–November', climate: '32–38°C easing gradually, pleasant by November.', nile: 'Stable level.', advice: 'Excellent shoulder season with less crowding than winter.', photo: 'Return of warm colours.' },
    ],
  },

  plans: {
    label: '08 · Tailored Plans',
    h2: 'By type of trip',
    cards: [
      { icon: '👨‍👩‍👧', title: 'Families with children', items: [
        'The boat trip is fun for kids; make sure little ones have life jackets.',
        'Choose a cool morning and avoid the midday heat peak.',
        'Use toilets and facilities at the marina before boarding.',
        'A stroller helps on paved paths, but watch the steps.',
      ] },
      { icon: '📷', title: 'Photography lovers', items: [
        'The golden hour at opening / closing is most beautiful on the stones.',
        'The temple’s reflection on the Nile is a classic shot.',
        'A wide lens for the temple gates, a telephoto for carving details.',
        'Do not miss the Sound and Light show at night for dramatic mood.',
      ] },
      { icon: '♿', title: 'Limited mobility', items: [
        'Paved paths exist on Agilkia; ask about boat ramps.',
        'Allow more time and rest at shaded points.',
        'Avoid unpaved stairways where found.',
        'A helper companion is advisable when moving within the complex.',
      ] },
    ],
  },

  routes: {
    label: '09 · Suggested Routes',
    h2: 'Half day or full day?',
    half: {
      title: 'Half-day route · 3–4 hours',
      steps: [
        'Arrive at the Philae Temple marina near the High Dam.',
        'Boat to Agilkia Island and the first gateway.',
        'Isis court, Trajan’s Kiosk, and the view over the Nile.',
        'Return and rest at the harbour.',
      ],
    },
    full: {
      title: 'Full-day route · 7–8 hours',
      steps: [
        'The above temple and boat visit.',
        'The High Dam and the story around the Nile.',
        'The Nubia Museum to understand the local culture.',
        'Elephantine Island or a Nubian village, and sunset on the Nile.',
      ],
    },
  },

  services: {
    label: '10 · Visitor Services',
    h2: 'Facilities & their type (a neutral view)',
    intro: 'We do not recommend any particular shop or restaurant; we only clarify the types available so you can plan objectively. Verify availability and prices locally.',
    items: [
      { icon: '🚻', title: 'Toilets', text: 'Public types available near the marina and site entrance; we suggest using them before boarding the boat.' },
      { icon: '🅿️', title: 'Parking', text: 'A public car park near the departure point; no car park at the temple itself since it is an island.' },
      { icon: '🍽️', title: 'Food & drink', text: 'Options from kiosk, café, and restaurant around the marina and city; Nubian dishes available in their types.' },
      { icon: '🛏️', title: 'Accommodation', text: 'A range from budget stays to Nile-side hotels in Aswan; choose by your budget and location.' },
      { icon: '🛍️', title: 'Shopping & crafts', text: 'Markets and shops selling crafts (Nubian pottery, antiques, textiles) near the marina.' },
      { icon: '⛽🔌', title: 'Fuel & EV charging', text: 'Fuel stations within Aswan, and EV charging points spread around the city — check coverage before a long trip.' },
    ],
  },

  responsibility: {
    label: '11 · Education & Responsibility',
    h2a: 'An aware visitor',
    h2b: 'preserves the memory',
    items: [
      { title: 'Do not touch the carvings', text: 'Soft stone is affected by hand contact over time. Do not climb the monuments or write on the walls.' },
      { title: 'Leave no trace', text: 'Take back what you brought on the return boat. Do not throw anything into the Nile or onto the island.' },
      { title: 'Respect the Nile', text: 'The Nile is a living system; protecting it is part of protecting this place for those after us.' },
      { title: 'A lesson in rescue', text: 'The relocation of Philae was an international heritage rescue campaign. Your visit is an acknowledgement of the value of preserving human memory.', accent: true },
    ],
  },

  around: {
    label: '12 · Around Philae',
    h2a: 'After you return',
    h2b: 'from the island',
    intro: 'Make Philae a point in an Aswan day, not the whole day. These nearby stops are worth adding.',
    items: [
      { tag: '01', title: 'The High Dam', text: 'Modern engineering that changed Aswan’s relation with the Nile, near the boat point.' },
      { tag: '02', title: 'Nubia Museum', text: 'A rich entry to understanding the history and culture of the region beyond the First Cataract.' },
      { tag: '03', title: 'Elephantine Island', text: 'A Nubian village, the Nileometer, and ruins among palms and calm water.' },
      { tag: '04', title: 'What to eat?', text: 'Try Nubian cuisine: koshari, fattah, Nile fish, and sun bread with hibiscus tea.', accent: true },
    ],
  },

  map: {
    label: '13 · Getting Here',
    h2: 'Follow the blue of the Nile',
    address: 'Aswan 1, Red Sea 1240271, Egypt\n24.0255836° N · 32.8841021° E',
    officialNote: 'For updates and official tourism, please visit',
  },

  faq: {
    label: '14 · Frequently Asked',
    h2: 'Before you go',
    items: [
      { q: 'How do I get to Philae Temple?', a: 'From the Philae Temple marina near the High Dam, take a short boat to Agilkia Island; agree the boat fare before setting off.' },
      { q: 'What is the best time to visit?', a: 'Winter (December–February) is the most comfortable, with days around 23–25°C. Summer is scorching, so visit at opening or closing if you come then.' },
      { q: 'Is the boat included in the ticket?', a: 'Usually the boat trip is paid separately from the site ticket; ask about the total price before boarding.' },
      { q: 'Where is Philae Temple located?', a: 'It is on Agilkia Island in Aswan, Egypt, reached by boat across the waters of the Nile.' },
      { q: 'What are the opening hours?', a: 'It is generally open daily from about 07:00 to 17:00, and hours may shift seasonally; verify locally before travelling.' },
      { q: 'Why was the temple moved?', a: 'After the High Dam raised the Nile’s water level, the temple was dismantled and rebuilt stone by stone on Agilkia Island in a UNESCO-led international rescue project.' },
    ],
  },

  sources: {
    label: 'Sources · synced September 2026',
    h2: 'Information sources',
    texts: [
      'Ratings: synced from Google Maps user ratings, sync time September 2026; copyright belongs to the original authors and Google Maps.',
      'Map and coordinates: Google Maps.',
      'Official tourism: the official tourism portal of Egypt.',
    ],
  },

  footer: {
    brand: 'Philae · Aswan Guide',
    tagline: 'An independent, non-profit educational site · island, temple, and Nile',
    disclaimer: 'This site is an independent, unofficial, non-profit guide and does not represent the Egyptian Ministry of Tourism and Antiquities or the management of the Philae Temple site. Verify hours and fees locally before visiting.',
  },
};
