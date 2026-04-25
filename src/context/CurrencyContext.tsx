"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getRates, CURRENCIES } from "@/lib/currency";

interface CurrencyContextType {
  currency: string;
  setCurrency: (c: string) => void;
  rates: Record<string, number>;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  rates: {},
  loading: true,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState("USD");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved currency from localStorage
    const saved = localStorage.getItem("currency");
    if (saved && CURRENCIES.find(c => c.code === saved)) {
      setCurrencyState(saved);
    }
    // Fetch rates
    getRates().then(r => {
      setRates(r);
      setLoading(false);
    });
  }, []);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem("currency", c);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);