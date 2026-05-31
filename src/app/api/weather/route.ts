import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const lang = req.nextUrl.searchParams.get("lang") || "ru";
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Baku,az&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=${lang}`,
      { next: { revalidate: 1800 } }
    );
    const data = await res.json();
    return NextResponse.json({
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch {
    return NextResponse.json({ temp: null, description: null });
  }
}