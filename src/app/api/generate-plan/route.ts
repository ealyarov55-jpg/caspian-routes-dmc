import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { days, group, budget, interests, from, locale, diet, pace } = await req.json();

    const langInstruction = locale === "en" ? "Respond in English." : locale === "az" ? "Azərbaycan dilində cavab ver." : locale === "tr" ? "Türkçe yanıt ver." : "Отвечай на русском языке.";

    const dietLine = diet && diet.length > 0 ? `- Diet/Restrictions: ${diet.join(", ")}` : "";
    const paceLine = pace ? `- Pace/Rhythm: ${pace}` : "";

    const prompt = `${langInstruction}
You are the Editor-in-Chief of a high-end, premium travel magazine (like Kinfolk or Condé Nast Traveler) curating an exclusive itinerary for Azerbaijan and the Caucasus.

Context:
- Days: ${days} | Group: ${group} | Budget: ${budget}
- Focus: ${interests.join(", ")}
- Departure from: ${from}
${dietLine}
${paceLine}

CRITICAL TONE & STYLE RULES:
1. Tone: Elegant, cinematic, sensory, and highly opinionated. 
2. Ban cliches: NEVER use phrases like "hidden gem", "city of contrasts", "must-see", or "amazing views". Focus on authentic atmosphere, lighting, local rhythm, and architectural details.
3. Keep text concise but poetic (max 15-20 words per description). 

CRITICAL ARCHITECTURE RULES:
- DO NOT put hotels inside the daily schedule. Provide 3-4 curated hotels AT THE END in the "curated_stays" array.
- "curated_stays" must perfectly match the budget level (${budget}) and the regions visited. (Low = stylish guesthouses/boutique hostels, Mid = aesthetic 4-star boutiques, High = 5-star luxury/design).
- ALL hotel names, streets, and cafes must be 100% REAL and exist in Azerbaijan.

Return ONLY valid JSON matching this exact structure:
{
  "plan_title": "Cinematic editorial title for the trip",
  "total_budget_estimate": "Short aesthetic budget summary",
  "days": [
    {
      "day": 1,
      "title": "Editorial day title (e.g., 'The Silent Stone of Icherisheher')",
      "morning": { "activity": "Specific aesthetic location", "description": "Sensory, elegant description", "tip": "Practical local tip", "curator_note": "1 highly specific insider secret" },
      "afternoon": { "activity": "location", "description": "1-2 sentences", "tip": "tip", "curator_note": "insider secret" },
      "evening": { "activity": "location", "description": "1-2 sentences", "tip": "tip", "curator_note": "insider secret" },
      "excursion": { "name": "Curated experience name", "search_query": "English search query for GetYourGuide" }
    }
  ],
  "curated_stays": [
    { 
      "name": "Real hotel name", 
      "description": "Editorial review focusing on interior, vibe, or view (max 20 words)"
    }
  ],
  "logistics": { "title": "Frictionless Logistics", "content": "Specific transport facts, real prices in AZN, Bolt/Uber tips." },
  "flights": { "tip": "Editorial flight tip from ${from}", "url": "https://aviasales.tpk.ro/qyjqiTHn" },
  "car_rental": { "tip": "1 sentence on driving context", "url": "https://localrent.tpk.ro/BAFUsMGN" }
}`;

    const message = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 5000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let plan;
    try {
      plan = JSON.parse(clean);
    } catch {
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) {
        plan = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON");
      }
    }

    if (plan.days) {
      plan.days = plan.days.map((day: any) => ({
        ...day,
        excursion: day.excursion?.name ? {
          ...day.excursion,
          url: `https://www.getyourguide.com/s/?q=${encodeURIComponent(day.excursion.search_query || day.excursion.name)}&partner_id=YNRQ0A3&utm_medium=online_publisher`
        } : day.excursion,
      }));
    }

    // Буллетпруф прямые партнерские ссылки через Hotellook (понимает текст и ищет везде)
    if (plan.days) {
      plan.days = plan.days.map((day: any) => ({
        ...day,
        excursion: day.excursion?.name ? {
          ...day.excursion,
          url: `https://www.getyourguide.com/s/?q=${encodeURIComponent(day.excursion.search_query || day.excursion.name)}&partner_id=YNRQ0A3&utm_medium=online_publisher`
        } : day.excursion,
      }));
    }

    // Буллетпруф прямые партнерские ссылки через Hotellook с твоим ID
    if (plan.curated_stays) {
      plan.curated_stays = plan.curated_stays.map((stay: any) => {
        const query = `${stay.name}, Azerbaijan`;
        const hotellookUrl = `https://search.hotellook.com/?q=${encodeURIComponent(query)}&marker=724413&language=${locale}`;

        return {
          ...stay,
          booking_url: hotellookUrl
        };
      });
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}