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
You are a local expert travel curator for Azerbaijan. Create a highly personalized travel plan.

Parameters: Days: ${days}, Group: ${group}, Budget: ${budget}, Interests: ${interests.join(", ")}, From: ${from}
${dietLine}
${paceLine}

CRITICAL HOTEL RULES:
- Match hotel to BOTH the day's location AND the budget
- If day is in Baku: recommend Baku hotels matching budget level
- If day is in Sheki/Guba/Quba/Lankaran/other regions: recommend hotels IN THAT REGION, not Baku
- Budget ${budget} means: low budget = hostels/guesthouses, mid = 3-4 star, high = 5 star luxury
- NEVER recommend a luxury hotel for low budget or vice versa
- Hotel name must be REAL and exist in Azerbaijan

CRITICAL CONTENT RULES:
- curator_note: 1 specific insider sentence (mention exact place, time, or local secret)
- descriptions: tailored to the group type (${group}) and interests (${interests.join(", ")})
- logistics: specific to the route (mention actual apps, real prices in local currency)
- Keep all text concise (1-2 sentences max per field)

Return ONLY valid JSON:
{
  "plan_title": "title",
  "total_budget_estimate": "budget",
  "days": [
    {
      "day": 1,
      "title": "day title",
      "morning": { "activity": "name", "description": "1-2 sentences tailored to group/interests", "tip": "specific tip", "curator_note": "1 specific insider sentence" },
      "afternoon": { "activity": "name", "description": "1-2 sentences", "tip": "specific tip", "curator_note": "1 specific insider sentence" },
      "evening": { "activity": "name", "description": "1-2 sentences", "tip": "specific tip", "curator_note": "1 specific insider sentence" },
      "hotel": { "name": "Real hotel name matching day location and budget", "booking_url": "https://ostrovok.tpk.ro/DDho2QGw" },
      "excursion": { "name": "excursion name", "search_query": "excursion name in English" }
    }
  ],
  "logistics": { "title": "short title", "content": "specific transport tips with real prices" },
  "flights": { "tip": "specific flight tip from ${from}", "url": "https://aviasales.tpk.ro/qyjqiTHn" },
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