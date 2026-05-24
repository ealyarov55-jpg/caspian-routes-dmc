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
CRITICAL: booking_url must ALWAYS be https://ostrovok.tpk.ro/DDho2QGw

You are an expert travel curator for Azerbaijan. Create a travel plan.

Parameters:
- Days: ${days}
- Group: ${group}
- Budget: ${budget}
- Interests: ${interests.join(", ")}
- From: ${from}
${dietLine}
${paceLine}

For each activity add "curator_note" — 1 sentence insider tip from a local friend.
Add "logistics" with a short title and 2-3 sentence practical transport guide (apps, prices, tips).

Return ONLY valid JSON:

{
  "plan_title": "title",
  "total_budget_estimate": "budget",
  "days": [
    {
      "day": 1,
      "title": "day title",
      "morning": { "activity": "what", "description": "desc", "tip": "tip", "curator_note": "insider tip" },
      "afternoon": { "activity": "what", "description": "desc", "tip": "tip", "curator_note": "insider tip" },
      "evening": { "activity": "what", "description": "desc", "tip": "tip", "curator_note": "insider tip" },
      "hotel": { "name": "hotel name", "booking_url": "https://ostrovok.tpk.ro/DDho2QGw" },
      "excursion": { "name": "excursion name", "url": "https://www.getyourguide.com/baku-l1408/?partner_id=YNRQ0A3&utm_medium=online_publisher" }
    }
  ],
  "logistics": { "title": "Getting around", "content": "practical transport tips" },
  "flights": { "tip": "flight tip", "url": "https://aviasales.tpk.ro/qyjqiTHn" },
  "car_rental": { "tip": "car tip", "url": "https://localrent.tpk.ro/BAFUsMGN" }
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

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}