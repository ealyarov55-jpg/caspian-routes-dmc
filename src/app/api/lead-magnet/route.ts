import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, locale, guide } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const guideContent = guide === "checklist" ? getChecklistContent(locale) : getBakuTopContent(locale);

    // Письмо пользователю с гидом
    await resend.emails.send({
      from: "Caspian Routes <onboarding@resend.dev>",
      to: email,
      subject: guideContent.subject,
      html: guideEmailTemplate(guideContent, locale),
    });

    // Уведомление тебе
    await resend.emails.send({
      from: "Caspian Routes <onboarding@resend.dev>",
      to: "ealyarov55@gmail.com",
      subject: `📧 Новый подписчик: ${email}`,
      html: `<p>Email: <strong>${email}</strong><br>Гид: ${guide}<br>Язык: ${locale}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead magnet error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

function getChecklistContent(locale: string) {
  if (locale === "ru") return {
    subject: "Твой чек-лист путешественника в Азербайджан 🇦🇿",
    title: "Чек-лист путешественника в Азербайджан",
    subtitle: "Всё что нужно знать перед поездкой",
    items: [
      { category: "📋 Документы", points: ["Загранпаспорт (срок действия 6+ месяцев)", "Виза если нужна (evisa.gov.az)", "Копии документов в телефоне", "Медицинская страховка"] },
      { category: "💰 Деньги", points: ["Наличные рубли или доллары для обмена", "Карты Visa/Mastercard РФ не работают", "Снять манаты в банкомате по прилёту", "Bolt работает — скачай приложение"] },
      { category: "📱 Приложения", points: ["Bolt (такси)", "Google Maps (работает офлайн)", "Telegram (местные боты)", "Caspian Routes — AI маршрут"] },
      { category: "👗 Что взять", points: ["Лёгкая одежда (летом до +42°C)", "Шарф/платок для мечетей", "Солнцезащитный крем SPF 50+", "Удобная обувь для Старого города"] },
      { category: "🚫 Что нельзя", points: ["Ввозить дроны без разрешения", "Фотографировать военные объекты", "Пить воду из-под крана", "Ехать в такси без приложения"] },
    ]
  };

  return {
    subject: "Your Azerbaijan Travel Checklist 🇦🇿",
    title: "Azerbaijan Travel Checklist",
    subtitle: "Everything you need to know before your trip",
    items: [
      { category: "📋 Documents", points: ["Passport valid for 6+ months", "Visa if required (evisa.gov.az)", "Digital copies of documents", "Travel insurance"] },
      { category: "💰 Money", points: ["Bring cash USD or EUR to exchange", "Russian Visa/Mastercard cards don't work", "Withdraw Manat at airport ATM", "Download Bolt app for taxis"] },
      { category: "📱 Apps", points: ["Bolt (taxi)", "Google Maps (download offline)", "Telegram (local bots)", "Caspian Routes — AI itinerary"] },
      { category: "👗 What to Pack", points: ["Light clothing (up to +42°C in summer)", "Scarf for mosques", "Sunscreen SPF 50+", "Comfortable shoes for Old City"] },
      { category: "🚫 What to Avoid", points: ["Bringing drones without permit", "Photographing military objects", "Drinking tap water", "Street taxis — use apps only"] },
    ]
  };
}

function getBakuTopContent(locale: string) {
  if (locale === "ru") return {
    subject: "Топ-10 мест Баку — твой гид 🏙️",
    title: "Топ-10 мест Баку",
    subtitle: "Что обязательно увидеть в столице Азербайджана",
    items: [
      { category: "🏛️ История", points: ["Ичери Шехер (Старый город) — UNESCO, вход 15 AZN", "Девичья башня — лучший вид на Каспий", "Дворец Ширваншахов — средневековая архитектура"] },
      { category: "🏙️ Современный Баку", points: ["Пламенные башни — смотри ночью с Бульвара", "Центр Гейдара Алиева — архитектура Захи Хадид", "Приморский Бульвар — 25 км набережной"] },
      { category: "🍽️ Еда", points: ["Firuze — лучший ресторан на Площади Фонтанов", "Кутабы в Старом городе — 3-5 AZN/шт", "Чай в армудах с пахлавой"] },
      { category: "🌊 Природа рядом", points: ["Гобустан — петроглифы и грязевые вулканы (65 км)", "Пляжи Абшерона — Sea Breeze, Amburan", "Янардаг — горящая гора"] },
    ]
  };

  return {
    subject: "Top 10 Places in Baku — Your Guide 🏙️",
    title: "Top 10 Places in Baku",
    subtitle: "Must-see highlights of Azerbaijan's capital",
    items: [
      { category: "🏛️ History", points: ["Icheri Sheher (Old City) — UNESCO, entry 15 AZN", "Maiden Tower — best views of the Caspian", "Palace of the Shirvanshahs — medieval architecture"] },
      { category: "🏙️ Modern Baku", points: ["Flame Towers — watch at night from the Boulevard", "Heydar Aliyev Center — Zaha Hadid architecture", "Baku Boulevard — 25km seafront promenade"] },
      { category: "🍽️ Food", points: ["Firuze — best restaurant on Fountain Square", "Qutabs in the Old City — 3-5 AZN each", "Tea in armudu glass with pakhlava"] },
      { category: "🌊 Nature Nearby", points: ["Gobustan — petroglyphs and mud volcanoes (65km)", "Absheron beaches — Sea Breeze, Amburan", "Yanardag — burning mountain"] },
    ]
  };
}

function guideEmailTemplate(content: any, locale: string) {
  const itemsHtml = content.items.map((section: any) => `
    <div style="margin-bottom:24px;">
      <h3 style="color:#021a1a;font-size:15px;font-weight:600;margin:0 0 10px;font-family:Arial,sans-serif;">${section.category}</h3>
      <ul style="margin:0;padding-left:20px;">
        ${section.points.map((p: string) => `<li style="color:#4a6060;font-size:14px;line-height:1.8;margin-bottom:4px;">${p}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  const ctaText = locale === "ru" ? "Создать AI-маршрут бесплатно →" : "Create AI Itinerary Free →";
  const footerText = locale === "ru" ? "Создано на caspian-routes.com" : "Made at caspian-routes.com";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#f0f7f7;font-family:Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(4,46,46,0.1);">
        <div style="background:linear-gradient(135deg,#021a1a 0%,#065050 100%);padding:40px;text-align:center;">
          <p style="color:#2DD4BF;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px;font-family:Arial,sans-serif;">CASPIAN ROUTES</p>
          <h1 style="color:white;font-size:26px;font-weight:300;margin:0 0 8px;font-family:Georgia,serif;">${content.title}</h1>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;">${content.subtitle}</p>
        </div>
        <div style="padding:40px;">
          ${itemsHtml}
          <div style="text-align:center;margin-top:32px;padding-top:32px;border-top:1px solid #e2eded;">
            <a href="https://www.caspian-routes.com/${locale}/planner" style="display:inline-block;background:linear-gradient(135deg,#0a7070,#0d9090);color:white;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:15px;font-weight:600;">${ctaText}</a>
          </div>
        </div>
        <div style="background:#f8fafa;padding:24px 40px;text-align:center;border-top:1px solid #e2eded;">
          <p style="color:#94a3a3;font-size:12px;margin:0;">${footerText}</p>
        </div>
      </div>
    </body></html>`;
}