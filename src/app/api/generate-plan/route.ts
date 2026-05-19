import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { days, group, budget, interests, from, locale, diet, pace } = await req.json();

    const langInstruction = locale === "en" ? "Respond in English." : locale === "az" ? "Azərbaycan dilində cavab ver." : locale === "tr" ? "Türkçe yanıt ver." : "Отвечай на русском языке.";

    const dietLine = diet && diet.length > 0 ? `- Питание/аллергии: ${diet.join(", ")}` : "";
    const paceLine = pace ? `- Темп поездки: ${pace}` : "";

    const prompt = `${langInstruction}
КРИТИЧЕСКИ ВАЖНО: В поле booking_url ВСЕГДА используй ТОЛЬКО ссылку https://ostrovok.tpk.ro/DDho2QGw — никогда не генерируй ссылки на Booking.com или любые другие сайты отелей.

Ты — эксперт по туризму в Азербайджане. Составь детальный план путешествия.

Параметры:
- Количество дней: ${days}
- Состав группы: ${group}
- Бюджет на человека: ${budget}
- Интересы: ${interests.join(", ")}
- Откуда летят: ${from}
${dietLine}
${paceLine}

${diet && diet.length > 0 ? `ВАЖНО: Учти ограничения питания (${diet.join(", ")}) при рекомендации ресторанов и блюд.` : ""}
${pace === "Расслабленный" || pace === "Relaxed" ? "ВАЖНО: Расслабленный темп — не более 2-3 активностей в день, обязательно время для отдыха." : ""}
${pace === "Насыщенный" || pace === "Intensive" ? "ВАЖНО: Насыщенный темп — максимум активностей, эффективные переезды, ранние подъёмы." : ""}

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
        "name": "название отеля или района для ночёвки",
        "booking_url": "https://ostrovok.tpk.ro/DDho2QGw"
      },
      "excursion": {
        "name": "название экскурсии если релевантна для этого дня",
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
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const plan = JSON.parse(clean);

    return NextResponse.json({ plan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}