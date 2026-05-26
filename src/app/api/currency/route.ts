import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.exchangerate-api.com/v4/latest/AZN",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return NextResponse.json({
      rub: data.rates.RUB ? data.rates.RUB.toFixed(0) : null,
      usd: data.rates.USD ? data.rates.USD.toFixed(2) : null,
      eur: data.rates.EUR ? data.rates.EUR.toFixed(2) : null,
      try_: data.rates.TRY ? data.rates.TRY.toFixed(1) : null,
      aed: data.rates.AED ? data.rates.AED.toFixed(2) : null,
    });
  } catch {
    return NextResponse.json({ rub: null, usd: null, eur: null, try_: null, aed: null });
  }
}