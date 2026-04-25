export const CURRENCIES = [
  { code: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", flag: "🇪🇺" },
  { code: "RUB", symbol: "₽", flag: "🇷🇺" },
  { code: "AZN", symbol: "₼", flag: "🇦🇿" },
  { code: "AED", symbol: "د.إ", flag: "🇦🇪" },
  { code: "GBP", symbol: "£", flag: "🇬🇧" },
];

const API_KEY = "7bc1b71b020b67f49f38f2c3";

let cachedRates: Record<string, number> = {};
let lastFetched = 0;

export async function getRates(): Promise<Record<string, number>> {
  const now = Date.now();
  // Cache for 1 hour
  if (cachedRates.USD && now - lastFetched < 3600000) {
    return cachedRates;
  }
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    const data = await res.json();
    if (data.result === "success") {
      cachedRates = data.conversion_rates;
      lastFetched = now;
      return cachedRates;
    }
  } catch (e) {
    console.error("Currency fetch error:", e);
  }
  // Fallback rates
  return { USD: 1, EUR: 0.92, RUB: 90, AED: 3.67, GBP: 0.79 };
}

export function convertPrice(amount: number, rates: Record<string, number>, currency: string): string {
  if (!amount) return "—";
  const rate = rates[currency] || 1;
  const converted = Math.round(amount * rate);
  const sym = CURRENCIES.find(c => c.code === currency)?.symbol || "$";
  if (currency === "RUB") return `${converted.toLocaleString("ru-RU")} ${sym}`;
  if (currency === "AZN") return `${converted.toLocaleString()} ${sym}`;
  if (currency === "AED") return `${sym} ${converted.toLocaleString()}`;
  return `${sym}${converted.toLocaleString()}`;
}