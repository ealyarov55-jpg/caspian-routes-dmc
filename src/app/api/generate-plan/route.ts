import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { days, group, budget, interests, from, locale, diet, pace } = await req.json();

    const langInstruction = locale === "en" ? "Respond in English." : locale === "az" ? "Azərbaycan dilində cavab ver." : locale === "tr" ? "Türkçe yanıt ver." : "Отвечай на русском языке.";

    const dietLine = diet && diet.length > 0 ? `- Diet: ${diet.join(", ")}` : "";
    const paceLine = pace ? `- Pace: ${pace}` : "";

    const prompt = `${langInstruction}
You are a travel curator for Azerbaijan. Create a concise travel plan.

Parameters: Days: ${days}, Group: ${group}, Budget: ${budget}, Interests: ${interests.join(", ")}, From: ${from}
${dietLine}
${paceLine}

Rules:
- curator_note: 1 short sentence insider tip per activity
- logistics: 2 sentences max on local transport
- hotel name: clean English name only, no descriptions
- Keep descriptions short (1-2 sentences max)

Return ONLY valid JSON:
{
  "plan_title": "title",
  "total_budget_estimate": "budget",
  "days": [
    {
      "day": 1,
      "title": "day title",
      "morning": { "activity": "name", "description": "1-2 sentences", "tip": "short tip", "curator_note": "1 sentence" },
      "afternoon": { "activity": "name", "description": "1-2 sentences", "tip": "short tip", "curator_note": "1 sentence" },
      "evening": { "activity": "name", "description": "1-2 sentences", "tip": "short tip", "curator_note": "1 sentence" },
      "hotel": { "name": "choose from: Fairmont Baku, JW Marriott Absheron Baku, Holiday Inn Baku, Movenpick Winter Park Baku, Baku Marriott Hotel Boulevard, ibis Baku City, Four Seasons Hotel Baku, InterContinental Baku, Old Baku Boutique Hotel, Boutique 19 Hotel, Sultan INN Baku, Moss Art Hotel, Hazz Hotel Baku, Promenade Hotel Baku, Twelve Inn Boutique Hotel. Pick the most suitable for the day and budget.", "booking_url": "https://ostrovok.tpk.ro/DDho2QGw" },
      "excursion": { "name": "excursion name", "search_query": "excursion name in English" }
    }
  ],
  "logistics": { "title": "short title", "content": "2 sentences max" },
  "flights": { "tip": "1 sentence", "url": "https://aviasales.tpk.ro/qyjqiTHn" },
  "car_rental": { "tip": "1 sentence", "url": "https://localrent.tpk.ro/BAFUsMGN" }
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

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}