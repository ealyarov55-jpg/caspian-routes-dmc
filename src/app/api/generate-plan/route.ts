import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { days, group, budget, interests, from, locale, diet, pace } = await req.json();

    const langInstruction = locale === "en" ? "Respond in English." : locale === "az" ? "Azərbaycan dilində cavab ver." : locale === "tr" ? "Türkçe yanıt ver." : "Отвечай на русском языке.";

    const dietLine = diet && diet.length > 0 ? `- Diet/Restrictions: ${diet.join(", ")}` : "";
    const paceLine = pace ? `- Pace/Rhythm: ${pace}` : "";

    const prompt = `${langInstruction} ALL content must be in this language — every word. Zero English if locale is not English.

You are a premium travel curator for Azerbaijan. Create an editorial itinerary.

Context: Days: ${days} | Group: ${group} | Budget: ${budget} | Focus: ${interests.join(", ")} | From: ${from}
${dietLine}
${paceLine}

RULES:
- Tone: cinematic, sensory, no cliches ("hidden gem", "must-see" banned)
- Max 15 words per description field
- NO hotels in daily schedule — only in curated_stays
- curated_stays: 3 real hotels matching budget and regions visited
- All hotel/cafe/street names must be real and exist in Azerbaijan

Return ONLY valid JSON:
{
  "plan_title": "editorial title",
  "total_budget_estimate": "budget summary",
  "days": [
    {
      "day": 1,
      "title": "editorial day title",
      "morning": { "activity": "location", "description": "max 15 words", "tip": "practical tip", "curator_note": "1 insider secret" },
      "afternoon": { "activity": "location", "description": "max 15 words", "tip": "tip", "curator_note": "insider secret" },
      "evening": { "activity": "location", "description": "max 15 words", "tip": "tip", "curator_note": "insider secret" },
      "excursion": { "name": "experience name", "search_query": "English search query" }
    }
  ],
  "curated_stays": [
    { "name": "Real hotel name", "description": "max 15 words on vibe/interior" }
  ],
  "logistics": { "title": "short title", "content": "max 30 words with real prices in AZN" },
  "flights": { "tip": "max 15 words", "url": "https://aviasales.tpk.ro/qyjqiTHn" },
  "car_rental": { "tip": "max 10 words", "url": "https://localrent.tpk.ro/BAFUsMGN" }
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
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

    if (plan.curated_stays) {
      plan.curated_stays = plan.curated_stays.map((stay: any) => ({
        ...stay,
        booking_url: `https://search.hotellook.com/?q=${encodeURIComponent(stay.name + ", Azerbaijan")}&marker=724413&language=${locale}`
      }));
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}