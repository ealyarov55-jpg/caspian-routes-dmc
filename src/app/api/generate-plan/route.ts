import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { days, group, budget, interests, from, locale } = await req.json();

    const lang = locale === "ru" ? "русском" : locale === "az" ? "азербайджанском" : "English";
    const langInstruction = locale === "en" ? "Respond in English." : locale === "az" ? "Azərbaycan dilində cavab ver." : "Отвечай на русском языке.";

    const prompt = `${langInstruction}

Ты — эксперт по туризму в Азербайджане. Составь детальный план путешествия.

Параметры:
- Количество дней: ${days}
- Состав группы: ${group}
- Бюджет на человека: ${budget}
- Интересы: ${interests.join(", ")}
- Откуда летят: ${from}

Верни ТОЛЬКО валидный JSON без markdown, без блоков кода, без пояснений. Структура:

{
  "plan_title": "название плана",
  "total_budget_estimate": "примерный бюджет",
  "days": [
    {
      "day": 1,
      "title": "название дня",
      "morning": {
        "activity": "что делать",
        "description": "описание",
        "tip": "совет"
      },
      "afternoon": {
        "activity": "что делать",
        "description": "описание",
        "tip": "совет"
      },
      "evening": {
        "activity": "что делать",
        "description": "описание",
        "tip": "совет"
      },
      "hotel": {
        "name": "название отеля или района",
        "booking_url": "https://ostrovok.tpk.ro/DDho2QGw"
      },
      "excursion": {
        "name": "название экскурсии если есть",
        "url": "https://www.getyourguide.com/baku-l1408/?partner_id=YNRQ0A3&utm_medium=online_publisher"
      }
    }
  ],
  "flights": {
    "tip": "совет по билетам",
    "url": "https://aviasales.tpk.ro/qyjqiTHn"
  },
  "car_rental": {
    "tip": "совет по аренде авто если нужно",
    "url": "https://localrent.tpk.ro/BAFUsMGN"
  }
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const plan = JSON.parse(text);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}