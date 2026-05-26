import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.exchangerate-api.com/v4/latest/AZN",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return NextResponse.json({
      rub: data.rates.RUB ? (1 / data.rates.RUB * 100).toFixed(1) : null,
      usd: data.rates.USD ? (1 / data.rates.USD).toFixed(2) : null,
      eur: data.rates.EUR ? (1 / data.rates.EUR).toFixed(2) : null,
      try_: data.rates.TRY ? (1 / data.rates.TRY).toFixed(2) : null,
      aed: data.rates.AED ? (1 / data.rates.AED).toFixed(2) : null,
    });
  } catch {
    return NextResponse.json({ rub: null, usd: null, eur: null, try_: null, aed: null });
  }
}