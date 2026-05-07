"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

const content = {
  ru: {
    title: "AI-планировщик маршрутов",
    subtitle: "Ответь на 5 вопросов — получи готовый маршрут по Азербайджану",
    step1: "Сколько дней?",
    step2: "Состав группы",
    step3: "Бюджет на человека",
    step4: "Интересы",
    step5: "Откуда летишь?",
    generate: "Создать маршрут →",
    generating: "Создаём маршрут...",
    days: ["3 дня", "5 дней", "7 дней", "10+ дней"],
    groups: ["Один", "Пара", "Семья с детьми", "Друзья"],
    budgets: ["$300-500", "$500-1000", "$1000-2000", "$2000+"],
    interests: ["История и культура", "Природа", "Гастрономия", "Фото", "Активный отдых", "Шопинг"],
    cities: ["Москва", "Санкт-Петербург", "Казань", "Другой город России", "Другая страна"],
    morning: "Утро",
    afternoon: "День",
    evening: "Вечер",
    hotel: "Отель",
    bookHotel: "Найти отель →",
    excursion: "Экскурсия",
    bookExcursion: "Забронировать →",
    flights: "Авиабилеты",
    bookFlight: "Найти билеты →",
    carRental: "Аренда авто",
    bookCar: "Найти авто →",
    restart: "Создать новый маршрут",
  },
  en: {
    title: "AI Trip Planner",
    subtitle: "Answer 5 questions — get a personalized Azerbaijan itinerary",
    step1: "How many days?",
    step2: "Group type",
    step3: "Budget per person",
    step4: "Interests",
    step5: "Flying from?",
    generate: "Create Itinerary →",
    generating: "Creating itinerary...",
    days: ["3 days", "5 days", "7 days", "10+ days"],
    groups: ["Solo", "Couple", "Family with kids", "Friends"],
    budgets: ["$300-500", "$500-1000", "$1000-2000", "$2000+"],
    interests: ["History & Culture", "Nature", "Food", "Photography", "Adventure", "Shopping"],
    cities: ["Moscow", "St. Petersburg", "Other Russian city", "Other country"],
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    hotel: "Hotel",
    bookHotel: "Find hotel →",
    excursion: "Excursion",
    bookExcursion: "Book now →",
    flights: "Flights",
    bookFlight: "Find flights →",
    carRental: "Car rental",
    bookCar: "Find car →",
    restart: "Create new itinerary",
  },
  az: {
    title: "AI Marşrut Planlayıcısı",
    subtitle: "5 suala cavab ver — Azərbaycana fərdi marşrut al",
    step1: "Neçə gün?",
    step2: "Qrup növü",
    step3: "Adam başına büdcə",
    step4: "Maraqlar",
    step5: "Haradan uçursunuz?",
    generate: "Marşrut Yarat →",
    generating: "Marşrut yaradılır...",
    days: ["3 gün", "5 gün", "7 gün", "10+ gün"],
    groups: ["Tək", "Cütlük", "Uşaqlı ailə", "Dostlar"],
    budgets: ["$300-500", "$500-1000", "$1000-2000", "$2000+"],
    interests: ["Tarix və mədəniyyət", "Təbiət", "Qastronomiya", "Foto", "Aktiv istirahət", "Alış-veriş"],
    cities: ["Moskva", "Sankt-Peterburq", "Digər şəhər"],
    morning: "Səhər",
    afternoon: "Gündüz",
    evening: "Axşam",
    hotel: "Otel",
    bookHotel: "Otel tap →",
    excursion: "Ekskursiya",
    bookExcursion: "Rezerv et →",
    flights: "Aviabiletlər",
    bookFlight: "Bilet tap →",
    carRental: "Avtomobil icarəsi",
    bookCar: "Avtomobil tap →",
    restart: "Yeni marşrut yarat",
  },
};

type Plan = {
  plan_title: string;
  total_budget_estimate: string;
  days: Array<{
    day: number;
    title: string;
    morning: { activity: string; description: string; tip: string };
    afternoon: { activity: string; description: string; tip: string };
    evening: { activity: string; description: string; tip: string };
    hotel: { name: string; booking_url: string };
    excursion: { name: string; url: string };
  }>;
  flights: { tip: string; url: string };
  car_rental: { tip: string; url: string };
};

export default function PlannerPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const lang = (locale === "ru" || locale === "az") ? locale : "en";
  const t = content[lang];

  const [step, setStep] = useState(0);
  const [days, setDays] = useState("");
  const [group, setGroup] = useState("");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, group, budget, interests, from, locale }),
      });
      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
        setStep(5);
      } else {
        setError("Ошибка генерации. Попробуй ещё раз.");
      }
    } catch {
      setError("Ошибка сети. Попробуй ещё раз.");
    }
    setLoading(false);
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "20px 24px",
    marginBottom: 24,
  };

  const btnStyle = (selected: boolean) => ({
    padding: "12px 20px",
    borderRadius: 10,
    border: selected ? "2px solid #2DD4BF" : "1px solid rgba(255,255,255,0.15)",
    background: selected ? "rgba(45,212,191,0.15)" : "rgba(255,255,255,0.04)",
    color: selected ? "#2DD4BF" : "rgba(255,255,255,0.8)",
    cursor: "pointer",
    fontFamily: "DM Sans, sans-serif",
    fontSize: 14,
    fontWeight: selected ? 500 : 400,
    transition: "all 0.2s",
  });

  return (
    <main style={{ background: "#021a1a", minHeight: "100vh" }}>
      <Navbar locale={locale} />
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "100px 24px 80px" }}>

        {step < 5 && (
          <>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 12, textAlign: "center" }}>
              {t.title}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, textAlign: "center", marginBottom: 48 }}>
              {t.subtitle}
            </p>

            {/* Progress */}
            <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= step ? "#2DD4BF" : "rgba(255,255,255,0.1)" }} />
              ))}
            </div>
          </>
        )}

        {/* Step 0: Days */}
        {step === 0 && (
          <div style={cardStyle}>
            <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20 }}>{t.step1}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {t.days.map(d => (
                <button key={d} onClick={() => { setDays(d); setStep(1); }} style={btnStyle(days === d)}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Group */}
        {step === 1 && (
          <div style={cardStyle}>
            <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20 }}>{t.step2}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {t.groups.map(g => (
                <button key={g} onClick={() => { setGroup(g); setStep(2); }} style={btnStyle(group === g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <div style={cardStyle}>
            <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20 }}>{t.step3}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {t.budgets.map(b => (
                <button key={b} onClick={() => { setBudget(b); setStep(3); }} style={btnStyle(budget === b)}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div style={cardStyle}>
            <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20 }}>{t.step4}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              {t.interests.map(i => (
                <button key={i} onClick={() => toggleInterest(i)} style={btnStyle(interests.includes(i))}>
                  {i}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(4)}
              disabled={interests.length === 0}
              style={{ padding: "12px 28px", borderRadius: 10, background: interests.length > 0 ? "#0a7070" : "rgba(255,255,255,0.1)", color: "white", border: "none", cursor: interests.length > 0 ? "pointer" : "not-allowed", fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 500 }}>
              Далее →
            </button>
          </div>
        )}

        {/* Step 4: From */}
        {step === 4 && (
          <div style={cardStyle}>
            <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20 }}>{t.step5}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              {t.cities.map(c => (
                <button key={c} onClick={() => setFrom(c)} style={btnStyle(from === c)}>
                  {c}
                </button>
              ))}
            </div>
            {error && <p style={{ color: "#f87171", fontSize: 14, marginBottom: 12 }}>{error}</p>}
            <button
              onClick={generatePlan}
              disabled={!from || loading}
              style={{ padding: "14px 32px", borderRadius: 10, background: from && !loading ? "linear-gradient(135deg, #0a7070, #0d9090)" : "rgba(255,255,255,0.1)", color: "white", border: "none", cursor: from && !loading ? "pointer" : "not-allowed", fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 600 }}>
              {loading ? t.generating : t.generate}
            </button>
          </div>
        )}

        {/* Result */}
        {step === 5 && plan && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "white", fontWeight: 300, marginBottom: 12 }}>
                {plan.plan_title}
              </h1>
              <p style={{ color: "#2DD4BF", fontSize: 16 }}>{plan.total_budget_estimate}</p>
            </div>

            {plan.days.map((day) => (
              <div key={day.day} style={{ ...cardStyle, marginBottom: 24 }}>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", color: "white", fontWeight: 400, marginBottom: 20 }}>
                  День {day.day}: {day.title}
                </h2>

                {[
                  { label: t.morning, data: day.morning },
                  { label: t.afternoon, data: day.afternoon },
                  { label: t.evening, data: day.evening },
                ].map(({ label, data }) => (
                  <div key={label} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ color: "#2DD4BF", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{label}</p>
                    <p style={{ color: "white", fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{data.activity}</p>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, marginBottom: 4 }}>{data.description}</p>
                    {data.tip && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontStyle: "italic" }}>💡 {data.tip}</p>}
                  </div>
                ))}

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
                  {day.hotel?.name && (
                    <a href={day.hotel.booking_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 8, color: "#2DD4BF", textDecoration: "none", fontSize: 13 }}>
                      🏨 {day.hotel.name} — {t.bookHotel}
                    </a>
                  )}
                  {day.excursion?.name && (
                    <a href={day.excursion.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8, color: "#c9a84c", textDecoration: "none", fontSize: 13 }}>
                      🗺️ {day.excursion.name} — {t.bookExcursion}
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Flights & Car */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
              {plan.flights && (
                <div style={cardStyle}>
                  <p style={{ color: "#2DD4BF", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>✈️ {t.flights}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{plan.flights.tip}</p>
                  <a href={plan.flights.url} target="_blank" rel="noopener noreferrer"
                    style={{ color: "#2DD4BF", fontSize: 13, textDecoration: "none" }}>{t.bookFlight}</a>
                </div>
              )}
              {plan.car_rental && (
                <div style={cardStyle}>
                  <p style={{ color: "#c9a84c", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>🚗 {t.carRental}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{plan.car_rental.tip}</p>
                  <a href={plan.car_rental.url} target="_blank" rel="noopener noreferrer"
                    style={{ color: "#c9a84c", fontSize: 13, textDecoration: "none" }}>{t.bookCar}</a>
                </div>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={() => { setStep(0); setPlan(null); setDays(""); setGroup(""); setBudget(""); setInterests([]); setFrom(""); }}
                style={{ padding: "12px 28px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "white", cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: 14 }}>
                {t.restart}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer locale={locale} />
    </main>
  );
}