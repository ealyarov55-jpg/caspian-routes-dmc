import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { days, group, budget, currency, interests, from, locale, diet, pace, date } = await req.json();

    const langInstruction = locale === "en" ? "Respond in English." : locale === "az" ? "Azərbaycan dilində cavab ver." : locale === "tr" ? "Türkçe yanıt ver." : "Отвечай на русском языке.";

    const dietLine = diet && diet.length > 0 ? `- Diet/Restrictions: ${diet.join(", ")}` : "";
    const paceLine = pace ? `- Pace/Rhythm: ${pace}` : "";

   const prompt = `${langInstruction} ALL content must be in this language — every word. Zero English if locale is not English.

You are a premium travel curator for Azerbaijan. Create an editorial itinerary.

Context: Days: ${days} | Group: ${group} | Budget: ${budget} ${currency} | Focus: ${interests.join(", ")} | Travel date: ${date || new Date().toISOString().split('T')[0]} | Month: ${new Date(date || Date.now()).toLocaleString('en', { month: 'long' })}

DESTINATION: "${from}"
${from !== "Весь Азербайджан" ? `CRITICAL: The ENTIRE itinerary must be based in and around "${from}". Every single day, every activity, every location must be in "${from}" or within 30km of "${from}". Do NOT include other cities or regions. Hotels must be in "${from}" or nearest town.` : "Cover the best of Azerbaijan based on interests and duration."}
${dietLine}
${paceLine}

RULES:
- Tone: punchy, evocative, highly specific. No cliches ("hidden gem", "must-see", "breathtaking" banned).
- Max 8 words per description field. Be extremely concise.
- tip: max 8 words
- curator_note: max 8 words
- logistics content: max 15 words
- flights tip: max 8 words
- car_rental tip: max 6 words
- hotel description: max 8 words
- BUDGET: be realistic. Azerbaijan is NOT cheap for tourists. Use these real price benchmarks: budget hotel 50-80 AZN/night, mid hotel 150-250 AZN/night, luxury hotel 400-800 AZN/night, restaurant meal 15-40 AZN/person, taxi cross-city 10-20 AZN, intercity bus 10-30 AZN, Gobustan tour 50-80 AZN. Calculate total_budget_estimate honestly based on actual days and group size.
- budget_breakdown: realistic per-person cost ranges for entire trip. accommodation = hotels × nights. food = meals × days. transport = taxis + intercity. attractions = entry fees. total = sum of all categories.
- curated_stays: ALWAYS include exactly 3 hotels. Use EXACTLY these hotel names (copy-paste, no alterations):
  Economy: "ibis Baku City", "Sultan Inn Baku", "Boutique 19 Hotel Baku"
  Comfort: "Holiday Inn Baku", "Baku Marriott Hotel Boulevard", "Moss Art Hotel Baku"
  Business: "JW Marriott Absheron Baku", "InterContinental Baku", "Hazz Hotel Baku"
  Luxury: "Four Seasons Hotel Baku", "Fairmont Baku Flame Towers"
  For regions outside Baku add 1 regional hotel with realistic name.
- For trips outside Baku (Sheki, Gabala, Guba etc) include regional hotels, not only Baku hotels.
- NO hotels in daily schedule — only in curated_stays
- curated_stays: 3 real hotels matching budget and regions visited
- All hotel/cafe/street names must be real and exist in Azerbaijan
- lat/lng must be REAL GPS coordinates of the actual location in Azerbaijan
- maps_url: real Google Maps search URL for the place
- rating: real approximate rating from Google Maps (e.g. "4.6")
- tripadvisor_url: real TripAdvisor search URL for the place
- photo_query: Optimized English search query for Pexels API. Pexels has very limited Azerbaijan coverage, so follow this strategy strictly:
  1. For world-famous landmarks use simple English: "[Name] Azerbaijan" or "[Name] Baku" (e.g. "Gobustan Azerbaijan", "Flame Towers Baku", "Sheki Khan Palace").
  2. For local/specific places (local cafes, restaurants, small museums, bus stations) NEVER use their exact names. Instead generate a general high-aesthetic atmospheric query conveying the vibe (e.g. instead of "Firuze restaurant Baku" write "Baku traditional restaurant cozy"; instead of "Autovokzal Gabala" write "Azerbaijan mountain road sunny").
  3. SEASONALITY: Analyze "Month" and "Travel date" fields. If trip is June-August add "summer" or "sunny" keywords and strictly avoid anything that could return snow/winter images. For winter trips use "winter", "moody", "snowy".
  4. NO FOREIGN TEXT: Avoid queries that may return images with non-matching signs, billboards or city names on buildings.
  5. FORBIDDEN WORDS: Never use "travel", "nature", "tourism", "photo", "scenery" or exact names of non-famous venues.
- FAMILY WITH CHILDREN: if group contains "дети" or "children" or "С детьми" or "Family" or "Uşaqlarla" or "Çocuklarla": NO long walks over 3km, NO difficult terrain, NO activities lasting over 2 hours without a break, ALWAYS include 1 indoor activity per day, recommend family-friendly restaurants with kids menus, hotels must have family rooms, pace must be relaxed regardless of selected pace, avoid Khinalug/Lahij difficult roads.
- COUPLE: if group contains "Пара" or "Couple" or "Cütlük" or "Çift": prioritize romantic dinners, rooftop restaurants, sunset viewpoints, boutique hotels, spa experiences, evening walks on Baku boulevard. Include at least 1 romantic restaurant per day.
- FRIENDS: if group contains "Друзья" or "Friends" or "Dostlar" or "Arkadaşlar": include nightlife options, group-friendly restaurants, adventure activities (ATV, zipline, hiking), street food spots, flexible schedule with free time blocks.
- SOLO: if group contains "Один" or "Solo" or "Tək" or "Yalnız": recommend hostels or budget boutique hotels, solo-friendly cafes with wifi, walking tours, local markets, safety tips for solo travelers in Azerbaijan.
- GEOGRAPHY: group locations by proximity. NEVER put Gobustan and Ateshgah on the same day — they are opposite directions from Baku. NEVER put Nardaran and Sumgait on the same day as central Baku. Max 2 distant locations per day.
- SEASONALITY: adjust recommendations based on current month. June-August: avoid midday outdoor activities (heat 35-42°C), recommend early morning starts (7-8am), suggest Gabala/Sheki mountains as cool escape, warn about Caspian beach crowds. September-November: perfect weather, ideal for all regions, wine harvest in Shamakhi. December-February: Shahdag skiing, fewer tourists, some mountain roads closed, Baku mild (5-12°C). March-May: blooming nature, best for Lerik/Lankaran, occasional rain.
- TRANSPORT COSTS: Bolt taxi Baku center to Gobustan = 25-35 AZN one way. Baku to Nardaran = 15-20 AZN. Baku to Ateshgah = 10-15 AZN. Intercity Baku-Sheki bus = 10-12 AZN. Be honest — if itinerary needs 3 taxi rides, budget 60-90 AZN for transport that day.
- RESTAURANT PRICES: Firuze, Shirvanshahlar, Chinar = 30-60 AZN per person minimum. Street food = 5-10 AZN. Teze Bazar snacks = 10-20 AZN. Never underestimate food costs.
- ATTRACTIONS: Gobustan museum = 10 AZN. Ateshgah = 10 AZN. Icheri Sheher palaces = 15 AZN each. Mud volcanoes = free but need local jeep 20-30 AZN.
- total_budget_estimate: provide a realistic range in ${currency} currency (e.g. if currency is RUB write "45000-60000 RUB per person", if AZN write "780-1020 AZN per person"). Always use the specified currency symbol.
- budget_breakdown: all amounts must be in ${currency} currency. Do NOT sum numbers. Base range on: economy=$300-500, comfort=$500-900, business=$900-1800, luxury=$1800+. Adjust up if itinerary includes expensive restaurants or distant regions.
Return ONLY valid JSON:
{
  "plan_title": "editorial title",
  "total_budget_estimate": "budget summary",
  "days": [
    {
      "day": 1,
      "title": "editorial day title",
      "morning": { "activity": "real place name", "description": "max 15 words", "tip": "practical tip", "curator_note": "1 insider secret", "lat": 40.3953, "lng": 49.8822, "maps_url": "https://maps.google.com/?q=Place+Name+Baku+Azerbaijan", "rating": "4.7", "tripadvisor_url": "https://www.tripadvisor.com/Search?q=Place+Name+Baku", "photo_query": "Maiden Tower Baku Azerbaijan" },
      "afternoon": { "activity": "real place name", "description": "max 15 words", "tip": "tip", "curator_note": "insider secret", "lat": 40.3667, "lng": 49.8370, "maps_url": "https://maps.google.com/?q=Place+Name+Baku+Azerbaijan", "rating": "4.5", "tripadvisor_url": "https://www.tripadvisor.com/Search?q=Place+Name+Baku", "photo_query": "Flame Towers Baku night" },
      "evening": { "activity": "real place name", "description": "max 15 words", "tip": "tip", "curator_note": "insider secret", "lat": 40.3777, "lng": 49.8920, "maps_url": "https://maps.google.com/?q=Place+Name+Baku+Azerbaijan", "rating": "4.4", "tripadvisor_url": "https://www.tripadvisor.com/Search?q=Place+Name+Baku", "photo_query": "Baku boulevard Caspian Sea evening" },
      "excursion": { "name": "experience name", "search_query": "English search query" }
    }
  ],
  "curated_stays": [
    { "name": "Real hotel name", "description": "max 15 words on vibe/interior" }
  ],
  "logistics": { "title": "short title", "content": "max 30 words with real prices in AZN" },
  "flights": { "tip": "max 15 words", "url": "https://aviasales.tpk.ro/qyjqiTHn" },
  "car_rental": { "tip": "max 10 words", "url": "https://localrent.tpk.ro/BAFUsMGN" },
  "budget_breakdown": { "accommodation": "$120-160", "food": "$80-120", "transport": "$40-60", "attractions": "$20-30", "total": "$260-370" }
Output strictly valid JSON only. No markdown, no explanations, no text before or after the JSON object.}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let plan;
    try {
      plan = JSON.parse(clean);
    } catch {
      // Try to extract and fix truncated JSON
      let extracted = clean;
      const match = clean.match(/\{[\s\S]*/);
      if (match) extracted = match[0];
      
      // Find last complete day object and truncate there
      const lastGoodDay = extracted.lastIndexOf('"excursion"');
      if (lastGoodDay > 0) {
        const afterExcursion = extracted.indexOf('}', extracted.indexOf('}', lastGoodDay) + 1);
        if (afterExcursion > 0) {
          const fallbackLogistics = locale === "tr" ? "Bolt taksi, metro 0.30 AZN." : locale === "az" ? "Bolt taksi, metro 0.30 AZN." : locale === "en" ? "Bolt taxi, metro 0.30 AZN." : "Такси через Bolt, метро 0.30 AZN.";
const fallbackLogisticsTitle = locale === "tr" ? "Ulaşım" : locale === "az" ? "Nəqliyyat" : locale === "en" ? "Transport" : "Транспорт";
const fallbackFlights = locale === "tr" ? "Erken rezervasyon yapın" : locale === "az" ? "Erkən rezerv edin" : locale === "en" ? "Book early for best prices" : "Ищите билеты заранее";
const fallbackCar = locale === "tr" ? "Ortak kiralama" : locale === "az" ? "Tərəfdaş kiralama" : locale === "en" ? "Partner car rental" : "Аренда от партнёров";
extracted = extracted.substring(0, afterExcursion + 1) + `],"curated_stays":[],"logistics":{"title":"${fallbackLogisticsTitle}","content":"${fallbackLogistics}"},"flights":{"tip":"${fallbackFlights}","url":"https://aviasales.tpk.ro/qyjqiTHn"},"car_rental":{"tip":"${fallbackCar}","url":"https://localrent.tpk.ro/BAFUsMGN"}}`;
        }
      }
      
      try {
        plan = JSON.parse(extracted);
      } catch {
        throw new Error("Invalid JSON");
      }
    }

    // Force affiliate links regardless of what Claude generated
    plan.flights = {
      tip: plan.flights?.tip || "Ищите билеты заранее для лучших цен",
      url: "https://aviasales.tpk.ro/qyjqiTHn"
    };
    plan.car_rental = {
      tip: plan.car_rental?.tip || "Аренда авто от надёжных партнёров",
      url: "https://localrent.tpk.ro/BAFUsMGN"
    };

    if (plan.days) {
      plan.days = plan.days.map((day: any) => ({
        ...day,
        excursion: day.excursion?.name ? {
          ...day.excursion,
          url: `https://www.getyourguide.com/s/?q=${encodeURIComponent(day.excursion.search_query || day.excursion.name)}&partner_id=YNRQ0A3&utm_medium=online_publisher`
        } : day.excursion,
      }));
    }

    const OSTROVOK_LINKS: Record<string, string> = {
      "Fairmont Baku": "https://ostrovok.tpk.ro/wpc5B7AO",
      "Fairmont Baku Flame Towers": "https://ostrovok.tpk.ro/wpc5B7AO",
      "JW Marriott Absheron Baku": "https://ostrovok.tpk.ro/oQIB2sPb",
      "Holiday Inn Baku": "https://ostrovok.tpk.ro/mkCHuDrU",
      "Movenpick Winter Park Baku": "https://ostrovok.tpk.ro/w6Yq5r46",
      "Movenpick Baku": "https://ostrovok.tpk.ro/w6Yq5r46",
      "Baku Marriott Hotel Boulevard": "https://ostrovok.tpk.ro/6D6EzJFn",
      "ibis Baku City": "https://ostrovok.tpk.ro/P3ooM2K8",
      "ibis Baku": "https://ostrovok.tpk.ro/P3ooM2K8",
      "Four Seasons Hotel Baku": "https://ostrovok.tpk.ro/G4GPMPsg",
      "Four Seasons Baku": "https://ostrovok.tpk.ro/G4GPMPsg",
      "InterContinental Baku": "https://ostrovok.tpk.ro/ld9Ni4pT",
      "Old Baku Boutique Hotel": "https://ostrovok.tpk.ro/KkU6aEyq",
      "Boutique 19 Hotel": "https://ostrovok.tpk.ro/LAGpLULR",
      "Boutique 19 Hotel Baku": "https://ostrovok.tpk.ro/LAGpLULR",
      "Sultan INN Baku": "https://ostrovok.tpk.ro/tfMnPtHQ",
      "Sultan Inn Baku": "https://ostrovok.tpk.ro/tfMnPtHQ",
      "Moss Art Hotel": "https://ostrovok.tpk.ro/coPVmFEA",
      "Moss Art Hotel Baku": "https://ostrovok.tpk.ro/coPVmFEA",
      "Art Club Hotel": "https://ostrovok.tpk.ro/f8hd97eZ",
      "Art Club Hotel Baku": "https://ostrovok.tpk.ro/f8hd97eZ",
      "Hazz Hotel Baku": "https://ostrovok.tpk.ro/IGg58vAS",
      "Hazz Hotel": "https://ostrovok.tpk.ro/IGg58vAS",
      "Boutique Hotel Grandview": "https://ostrovok.tpk.ro/KDpWlTSP",
      "Grandview Boutique Hotel": "https://ostrovok.tpk.ro/KDpWlTSP",
    };

    if (plan.curated_stays) {
      plan.curated_stays = plan.curated_stays.map((stay: any) => ({
        ...stay,
        booking_url: OSTROVOK_LINKS[stay.name] || "https://ostrovok.tpk.ro/DDho2QGw"
      }));
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}