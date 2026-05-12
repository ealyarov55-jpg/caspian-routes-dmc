"use client";

import { useState, use, useEffect } from "react";
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
    bookHotel: "Найти отель →",
    bookExcursion: "Забронировать →",
    flights: "Авиабилеты",
    bookFlight: "Найти билеты →",
    carRental: "Аренда авто",
    bookCar: "Найти авто →",
    restart: "Создать новый маршрут",
    loadingSteps: [
      "🗺️ Анализируем твои интересы...",
      "🏨 Подбираем лучшие отели...",
      "✈️ Проверяем рейсы и маршруты...",
      "🎯 Составляем план по дням...",
      "💡 Добавляем советы и лайфхаки...",
      "✅ Финальная проверка маршрута...",
    ],
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
    bookHotel: "Find hotel →",
    bookExcursion: "Book now →",
    flights: "Flights",
    bookFlight: "Find flights →",
    carRental: "Car rental",
    bookCar: "Find car →",
    restart: "Create new itinerary",
    loadingSteps: [
      "🗺️ Analyzing your interests...",
      "🏨 Finding the best hotels...",
      "✈️ Checking flights and routes...",
      "🎯 Building your day-by-day plan...",
      "💡 Adding tips and insider advice...",
      "✅ Final itinerary review...",
    ],
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
    bookHotel: "Otel tap →",
    bookExcursion: "Rezerv et →",
    flights: "Aviabiletlər",
    bookFlight: "Bilet tap →",
    carRental: "Avtomobil icarəsi",
    bookCar: "Avtomobil tap →",
    restart: "Yeni marşrut yarat",
    loadingSteps: [
      "🗺️ Maraqlarınız analiz edilir...",
      "🏨 Ən yaxşı otellər axtarılır...",
      "✈️ Uçuşlar yoxlanılır...",
      "🎯 Gündəlik plan hazırlanır...",
      "💡 Məsləhətlər əlavə edilir...",
      "✅ Yekun yoxlama...",
    ],
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

function LoadingScreen({ steps }: { steps: string[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2200);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 95 ? prev + 1 : prev));
    }, 140);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [steps.length]);

  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      {/* Анимированный значок */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          width: 80, height: 80,
          borderRadius: "50%",
          background: "rgba(45,212,191,0.1)",
          border: "2px solid rgba(45,212,191,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          animation: "pulse 2s ease-in-out infinite",
        }}>
          <span style={{ fontSize: 36 }}>🗺️</span>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(45,212,191,0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(45,212,191,0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>

      {/* Текущий шаг */}
      <div style={{ minHeight: 32, marginBottom: 40 }}>
        <p key={currentStep} style={{
          color: "white", fontSize: 18, fontWeight: 500,
          fontFamily: "DM Sans, sans-serif",
          animation: "fadeIn 0.4s ease",
        }}>
          {steps[currentStep]}
        </p>
      </div>

      {/* Прогресс бар */}
      <div style={{ maxWidth: 400, margin: "0 auto 32px" }}>
        <div style={{
          background: "rgba(255,255,255,0.08)",
          borderRadius: 99, height: 6, overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            borderRadius: 99,
            background: "linear-gradient(90deg, #0a7070, #2DD4BF)",
            transition: "width 0.14s linear",
          }} />
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 10 }}>
          {progress}%
        </p>
      </div>

      {/* Пройденные шаги */}
      <div style={{ maxWidth: 360, margin: "0 auto", textAlign: "left" }}>
        {steps.slice(0, currentStep + 1).map((step, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "6px 0",
            opacity: i === currentStep ? 1 : 0.45,
            transition: "opacity 0.3s",
          }}>
            <span style={{ color: i < currentStep ? "#2DD4BF" : "rgba(255,255,255,0.3)", fontSize: 14 }}>
              {i < currentStep ? "✓" : "›"}
            </span>
            <span style={{ color: i === currentStep ? "white" : "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "DM Sans, sans-serif" }}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlannerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
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
        setError(lang === "ru" ? "Ошибка генерации. Попробуй ещё раз." : "Generation error. Please try again.");
      }
    } catch {
      setError(lang === "ru" ? "Ошибка сети. Попробуй ещё раз." : "Network error. Please try again.");
    }
    setLoading(false);
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "24px 28px",
    marginBottom: 24,
  };

  return (
    <main style={{ background: "#021a1a", minHeight: "100vh" }}>
      <Navbar locale={locale} />

      <style>{`
        .planner-btn {
          padding: 12px 20px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          font-family: DM Sans, sans-serif;
          font-size: 14px;
          font-weight: 400;
          transition: all 0.2s ease;
        }
        .planner-btn:hover {
          border-color: rgba(45,212,191,0.5);
          background: rgba(45,212,191,0.08);
          color: white;
          transform: translateY(-1px);
        }
        .planner-btn.selected {
          border: 2px solid #2DD4BF;
          background: rgba(45,212,191,0.15);
          color: #2DD4BF;
          font-weight: 500;
        }
        .generate-btn {
          padding: 14px 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0a7070, #0d9090);
          color: white;
          border: none;
          cursor: pointer;
          font-family: DM Sans, sans-serif;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(10,112,112,0.3);
        }
        .generate-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #0d9090, #2DD4BF);
          box-shadow: 0 8px 28px rgba(10,112,112,0.5);
          transform: translateY(-2px);
        }
        .generate-btn:disabled {
          background: rgba(255,255,255,0.1);
          box-shadow: none;
          cursor: not-allowed;
        }
        .next-btn {
          padding: 12px 28px;
          border-radius: 10px;
          background: #0a7070;
          color: white;
          border: none;
          cursor: pointer;
          font-family: DM Sans, sans-serif;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .next-btn:hover:not(:disabled) {
          background: #0d9090;
          transform: translateY(-1px);
        }
        .next-btn:disabled {
          background: rgba(255,255,255,0.1);
          cursor: not-allowed;
        }
        .partner-btn-teal {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: rgba(45,212,191,0.1);
          border: 1px solid rgba(45,212,191,0.3);
          border-radius: 8px;
          color: #2DD4BF;
          text-decoration: none;
          font-size: 13px;
          font-family: DM Sans, sans-serif;
          transition: all 0.2s ease;
        }
        .partner-btn-teal:hover {
          background: rgba(45,212,191,0.2);
          border-color: rgba(45,212,191,0.6);
          transform: translateY(-1px);
        }
        .partner-btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 8px;
          color: #c9a84c;
          text-decoration: none;
          font-size: 13px;
          font-family: DM Sans, sans-serif;
          transition: all 0.2s ease;
        }
        .partner-btn-gold:hover {
          background: rgba(201,168,76,0.2);
          border-color: rgba(201,168,76,0.6);
          transform: translateY(-1px);
        }
        .restart-btn {
          padding: 12px 28px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          cursor: pointer;
          font-family: DM Sans, sans-serif;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .restart-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.3);
        }
        @media (max-width: 767px) {
          .planner-btn { padding: 10px 16px; font-size: 13px; }
          .generate-btn { width: 100%; }
          .next-btn { width: 100%; }
        }
      `}</style>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "100px 24px 80px" }}>

        {/* Загрузка */}
        {loading && <LoadingScreen steps={t.loadingSteps} />}

        {/* Шаги */}
        {!loading && step < 5 && (
          <>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 12, textAlign: "center" }}>
              {t.title}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, textAlign: "center", marginBottom: 48 }}>
              {t.subtitle}
            </p>

            {/* Progress bar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 99,
                  background: i <= step ? "#2DD4BF" : "rgba(255,255,255,0.1)",
                  transition: "background 0.3s ease",
                }} />
              ))}
            </div>

            {/* Step 0 */}
            {step === 0 && (
              <div style={cardStyle}>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step1}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {t.days.map(d => (
                    <button key={d} className={`planner-btn${days === d ? " selected" : ""}`} onClick={() => { setDays(d); setStep(1); }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div style={cardStyle}>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step2}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {t.groups.map(g => (
                    <button key={g} className={`planner-btn${group === g ? " selected" : ""}`} onClick={() => { setGroup(g); setStep(2); }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div style={cardStyle}>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step3}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {t.budgets.map(b => (
                    <button key={b} className={`planner-btn${budget === b ? " selected" : ""}`} onClick={() => { setBudget(b); setStep(3); }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div style={cardStyle}>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step4}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                  {t.interests.map(i => (
                    <button key={i} className={`planner-btn${interests.includes(i) ? " selected" : ""}`} onClick={() => toggleInterest(i)}>
                      {i}
                    </button>
                  ))}
                </div>
                <button className="next-btn" onClick={() => setStep(4)} disabled={interests.length === 0}>
                  {lang === "ru" ? "Далее →" : lang === "az" ? "Növbəti →" : "Next →"}
                </button>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div style={cardStyle}>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step5}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                  {t.cities.map(c => (
                    <button key={c} className={`planner-btn${from === c ? " selected" : ""}`} onClick={() => setFrom(c)}>
                      {c}
                    </button>
                  ))}
                </div>
                {error && <p style={{ color: "#f87171", fontSize: 14, marginBottom: 12 }}>{error}</p>}
                <button className="generate-btn" onClick={generatePlan} disabled={!from}>
                  {t.generate}
                </button>
              </div>
            )}
          </>
        )}

        {/* Результат */}
        {!loading && step === 5 && plan && (
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
                  {lang === "ru" ? `День ${day.day}` : lang === "az" ? `Gün ${day.day}` : `Day ${day.day}`}: {day.title}
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
                    <a href={day.hotel.booking_url} target="_blank" rel="noopener noreferrer" className="partner-btn-teal">
                      🏨 {day.hotel.name} — {t.bookHotel}
                    </a>
                  )}
                  {day.excursion?.name && (
                    <a href={day.excursion.url} target="_blank" rel="noopener noreferrer" className="partner-btn-gold">
                      🗺️ {day.excursion.name} — {t.bookExcursion}
                    </a>
                  )}
                </div>
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
              {plan.flights && (
                <div style={cardStyle}>
                  <p style={{ color: "#2DD4BF", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>✈️ {t.flights}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{plan.flights.tip}</p>
                  <a href={plan.flights.url} target="_blank" rel="noopener noreferrer" className="partner-btn-teal">{t.bookFlight}</a>
                </div>
              )}
              {plan.car_rental && (
                <div style={cardStyle}>
                  <p style={{ color: "#c9a84c", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>🚗 {t.carRental}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{plan.car_rental.tip}</p>
                  <a href={plan.car_rental.url} target="_blank" rel="noopener noreferrer" className="partner-btn-gold">{t.bookCar}</a>
                </div>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              <button className="restart-btn" onClick={() => { setStep(0); setPlan(null); setDays(""); setGroup(""); setBudget(""); setInterests([]); setFrom(""); }}>
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