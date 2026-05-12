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
    selectRegion: "Выбери регион:",
    selectCountry: "Выбери страну:",
    selectCity: "Выбери город:",
    back: "← Назад",
    change: "Изменить",
    next: "Далее →",
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
    selectRegion: "Select region:",
    selectCountry: "Select country:",
    selectCity: "Select city:",
    back: "← Back",
    change: "Change",
    next: "Next →",
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
    selectRegion: "Region seç:",
    selectCountry: "Ölkə seç:",
    selectCity: "Şəhər seç:",
    back: "← Geri",
    change: "Dəyiş",
    next: "Növbəti →",
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

const GEO_DATA = {
  continents: [
    { id: "asia", label: { ru: "🌏 Азия", en: "🌏 Asia", az: "🌏 Asiya" } },
    { id: "europe", label: { ru: "🌍 Европа", en: "🌍 Europe", az: "🌍 Avropa" } },
    { id: "america", label: { ru: "🌎 Америка", en: "🌎 America", az: "🌎 Amerika" } },
    { id: "other", label: { ru: "🌐 Другой регион", en: "🌐 Other region", az: "🌐 Digər region" } },
  ],
  countries: {
    asia: [
      { id: "ru", flag: "🇷🇺", label: { ru: "Россия", en: "Russia", az: "Rusiya" } },
      { id: "kz", flag: "🇰🇿", label: { ru: "Казахстан", en: "Kazakhstan", az: "Qazaxıstan" } },
      { id: "uz", flag: "🇺🇿", label: { ru: "Узбекистан", en: "Uzbekistan", az: "Özbəkistan" } },
      { id: "tr", flag: "🇹🇷", label: { ru: "Турция", en: "Turkey", az: "Türkiyə" } },
      { id: "ae", flag: "🇦🇪", label: { ru: "ОАЭ", en: "UAE", az: "BƏƏ" } },
      { id: "cn", flag: "🇨🇳", label: { ru: "Китай", en: "China", az: "Çin" } },
      { id: "pk", flag: "🇵🇰", label: { ru: "Пакистан", en: "Pakistan", az: "Pakistan" } },
      { id: "asia_other", flag: "🌏", label: { ru: "Другая страна Азии", en: "Other Asian country", az: "Asiyada başqa ölkə" } },
    ],
    europe: [
      { id: "by", flag: "🇧🇾", label: { ru: "Беларусь", en: "Belarus", az: "Belarus" } },
      { id: "ua", flag: "🇺🇦", label: { ru: "Украина", en: "Ukraine", az: "Ukrayna" } },
      { id: "de", flag: "🇩🇪", label: { ru: "Германия", en: "Germany", az: "Almaniya" } },
      { id: "fr", flag: "🇫🇷", label: { ru: "Франция", en: "France", az: "Fransa" } },
      { id: "gb", flag: "🇬🇧", label: { ru: "Великобритания", en: "United Kingdom", az: "Böyük Britaniya" } },
      { id: "eu_other", flag: "🌍", label: { ru: "Другая страна Европы", en: "Other European country", az: "Avropada başqa ölkə" } },
    ],
    america: [
      { id: "us", flag: "🇺🇸", label: { ru: "США", en: "USA", az: "ABŞ" } },
      { id: "ca", flag: "🇨🇦", label: { ru: "Канада", en: "Canada", az: "Kanada" } },
      { id: "am_other", flag: "🌎", label: { ru: "Другая страна Америки", en: "Other American country", az: "Amerikada başqa ölkə" } },
    ],
    other: [
      { id: "other", flag: "🌐", label: { ru: "Другой регион", en: "Other region", az: "Digər region" } },
    ],
  } as Record<string, { id: string; flag: string; label: { ru: string; en: string; az: string } }[]>,
  cities: {
    ru: ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Другой город"],
    kz: ["Алматы", "Астана", "Другой город"],
    uz: ["Ташкент", "Самарканд", "Другой город"],
    tr: ["Стамбул", "Анкара", "Другой город"],
    ae: ["Дубай", "Абу-Даби", "Другой город"],
    cn: ["Пекин", "Шанхай", "Другой город"],
    pk: ["Карачи", "Лахор", "Другой город"],
    by: ["Минск", "Другой город"],
    ua: ["Киев", "Другой город"],
    de: ["Берлин", "Мюнхен", "Другой город"],
    fr: ["Париж", "Другой город"],
    gb: ["Лондон", "Другой город"],
    us: ["Нью-Йорк", "Лос-Анджелес", "Другой город"],
    ca: ["Торонто", "Ванкувер", "Другой город"],
    asia_other: ["Другой город"],
    eu_other: ["Другой город"],
    am_other: ["Другой город"],
    other: ["Другой город"],
  } as Record<string, string[]>,
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
    return () => { clearInterval(stepInterval); clearInterval(progressInterval); };
  }, [steps.length]);

  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(45,212,191,0.1)", border: "2px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "pulse 2s ease-in-out infinite" }}>
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
        `}</style>
      </div>
      <div style={{ minHeight: 32, marginBottom: 40 }}>
        <p key={currentStep} style={{ color: "white", fontSize: 18, fontWeight: 500, fontFamily: "DM Sans, sans-serif", animation: "fadeIn 0.4s ease" }}>
          {steps[currentStep]}
        </p>
      </div>
      <div style={{ maxWidth: 400, margin: "0 auto 32px" }}>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, borderRadius: 99, background: "linear-gradient(90deg, #0a7070, #2DD4BF)", transition: "width 0.14s linear" }} />
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 10 }}>{progress}%</p>
      </div>
      <div style={{ maxWidth: 360, margin: "0 auto", textAlign: "left" }}>
        {steps.slice(0, currentStep + 1).map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", opacity: i === currentStep ? 1 : 0.45, transition: "opacity 0.3s" }}>
            <span style={{ color: i < currentStep ? "#2DD4BF" : "rgba(255,255,255,0.3)", fontSize: 14 }}>{i < currentStep ? "✓" : "›"}</span>
            <span style={{ color: i === currentStep ? "white" : "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "DM Sans, sans-serif" }}>{step}</span>
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
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  const getFromString = () => {
  const countryData = GEO_DATA.countries[continent]?.find(c => c.id === country);
  return `${countryData?.label[lang] || country} — ${city}`;
};

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, group, budget, interests, from: getFromString(), locale }),
      });
      const data = await res.json();
      if (data.plan) { setPlan(data.plan); setStep(5); }
      else { setError(lang === "ru" ? "Ошибка генерации. Попробуй ещё раз." : "Generation error. Please try again."); }
    } catch {
      setError(lang === "ru" ? "Ошибка сети. Попробуй ещё раз." : "Network error. Please try again.");
    }
    setLoading(false);
  };

  const resetAll = () => { setStep(0); setPlan(null); setDays(""); setGroup(""); setBudget(""); setInterests([]); setContinent(""); setCountry(""); setCity(""); };

  const cardStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "24px 28px", marginBottom: 24 };
  const backBtnStyle = { background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, fontFamily: "DM Sans, sans-serif", padding: 0, marginBottom: 16, display: "block" };
  const labelStyle = { color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 16, fontFamily: "DM Sans, sans-serif", display: "block" };

  return (
    <main style={{ background: "#021a1a", minHeight: "100vh" }}>
      <Navbar locale={locale} />
      <style>{`
        .planner-btn { padding: 12px 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.8); cursor: pointer; font-family: DM Sans, sans-serif; font-size: 14px; font-weight: 400; transition: all 0.2s ease; }
        .planner-btn:hover { border-color: rgba(45,212,191,0.5); background: rgba(45,212,191,0.08); color: white; transform: translateY(-1px); }
        .planner-btn.selected { border: 2px solid #2DD4BF; background: rgba(45,212,191,0.15); color: #2DD4BF; font-weight: 500; }
        .generate-btn { padding: 14px 32px; border-radius: 10px; background: linear-gradient(135deg, #0a7070, #0d9090); color: white; border: none; cursor: pointer; font-family: DM Sans, sans-serif; font-size: 15px; font-weight: 600; transition: all 0.25s ease; box-shadow: 0 4px 16px rgba(10,112,112,0.3); }
        .generate-btn:hover:not(:disabled) { background: linear-gradient(135deg, #0d9090, #2DD4BF); box-shadow: 0 8px 28px rgba(10,112,112,0.5); transform: translateY(-2px); }
        .generate-btn:disabled { background: rgba(255,255,255,0.1); box-shadow: none; cursor: not-allowed; }
        .next-btn { padding: 12px 28px; border-radius: 10px; background: #0a7070; color: white; border: none; cursor: pointer; font-family: DM Sans, sans-serif; font-size: 15px; font-weight: 500; transition: all 0.2s ease; }
        .next-btn:hover:not(:disabled) { background: #0d9090; transform: translateY(-1px); }
        .next-btn:disabled { background: rgba(255,255,255,0.1); cursor: not-allowed; }
        .partner-btn-teal { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; background: rgba(45,212,191,0.1); border: 1px solid rgba(45,212,191,0.3); border-radius: 8px; color: #2DD4BF; text-decoration: none; font-size: 13px; font-family: DM Sans, sans-serif; transition: all 0.2s ease; }
        .partner-btn-teal:hover { background: rgba(45,212,191,0.2); border-color: rgba(45,212,191,0.6); transform: translateY(-1px); }
        .partner-btn-gold { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); border-radius: 8px; color: #c9a84c; text-decoration: none; font-size: 13px; font-family: DM Sans, sans-serif; transition: all 0.2s ease; }
        .partner-btn-gold:hover { background: rgba(201,168,76,0.2); border-color: rgba(201,168,76,0.6); transform: translateY(-1px); }
        .restart-btn { padding: 12px 28px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: white; cursor: pointer; font-family: DM Sans, sans-serif; font-size: 14px; transition: all 0.2s ease; }
        .restart-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }
        @media (max-width: 767px) { .planner-btn { padding: 10px 16px; font-size: 13px; } .generate-btn { width: 100%; } .next-btn { width: 100%; } }
      `}</style>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "100px 24px 80px" }}>

        {loading && <LoadingScreen steps={t.loadingSteps} />}

        {!loading && step < 5 && (
          <>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 12, textAlign: "center" }}>{t.title}</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, textAlign: "center", marginBottom: 48 }}>{t.subtitle}</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= step ? "#2DD4BF" : "rgba(255,255,255,0.1)", transition: "background 0.3s ease" }} />
              ))}
            </div>

            {step === 0 && (
              <div style={cardStyle}>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step1}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {t.days.map(d => (
                    <button key={d} className={`planner-btn${days === d ? " selected" : ""}`} onClick={() => { setDays(d); setStep(1); }}>{d}</button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div style={cardStyle}>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step2}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {t.groups.map(g => (
                    <button key={g} className={`planner-btn${group === g ? " selected" : ""}`} onClick={() => { setGroup(g); setStep(2); }}>{g}</button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={cardStyle}>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step3}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {t.budgets.map(b => (
                    <button key={b} className={`planner-btn${budget === b ? " selected" : ""}`} onClick={() => { setBudget(b); setStep(3); }}>{b}</button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={cardStyle}>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step4}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
                  {t.interests.map(i => (
                    <button key={i} className={`planner-btn${interests.includes(i) ? " selected" : ""}`} onClick={() => toggleInterest(i)}>{i}</button>
                  ))}
                </div>
                <button className="next-btn" onClick={() => setStep(4)} disabled={interests.length === 0}>{t.next}</button>
              </div>
            )}

            {step === 4 && (
              <div style={cardStyle}>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step5}</h2>

                {/* Выбор континента */}
                {!continent && (
                  <>
                    <span style={labelStyle}>{t.selectRegion}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      {GEO_DATA.continents.map(c => (
                        <button key={c.id} className="planner-btn" onClick={() => setContinent(c.id)}>{c.label[lang]}</button>
                      ))}
                    </div>
                  </>
                )}

                {/* Выбор страны */}
                {continent && !country && (
                  <>
                    <button style={backBtnStyle} onClick={() => setContinent("")}>{t.back}</button>
                    <span style={labelStyle}>{t.selectCountry}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      {GEO_DATA.countries[continent].map(c => (
                        <button key={c.id} className="planner-btn" onClick={() => setCountry(c.id)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
  {c.id.length === 2 && !["asia_other", "eu_other", "am_other", "other"].includes(c.id)
    ? <img src={`https://flagcdn.com/20x15/${c.id}.png`} width={20} height={15} alt={c.id} style={{ borderRadius: 2 }} />
    : <span>{c.flag}</span>
  }
  {c.label[lang]}
</button>
                      ))}
                    </div>
                  </>
                )}

                {/* Выбор города */}
                {continent && country && !city && (
                  <>
                    <button style={backBtnStyle} onClick={() => setCountry("")}>{t.back}</button>
                    <span style={labelStyle}>{t.selectCity}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                      {GEO_DATA.cities[country].map(c => (
                        <button key={c} className={`planner-btn${city === c ? " selected" : ""}`} onClick={() => setCity(c)}>{c}</button>
                      ))}
                    </div>
                  </>
                )}

                {/* Итог + генерация */}
                {continent && country && city && (
                  <>
                    <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif" }}>{getFromString()}</span>
                      <button onClick={() => setCity("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>{t.change}</button>
                    </div>
                    {error && <p style={{ color: "#f87171", fontSize: 14, marginBottom: 12 }}>{error}</p>}
                    <button className="generate-btn" onClick={generatePlan}>{t.generate}</button>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {!loading && step === 5 && plan && (
  <div>
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(45,212,191,0.1)", border: "2px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>
        🗺️
      </div>
      <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "white", fontWeight: 300, marginBottom: 12 }}>{plan.plan_title}</h1>
      <p style={{ color: "#2DD4BF", fontSize: 16, fontFamily: "DM Sans, sans-serif" }}>{plan.total_budget_estimate}</p>
    </div>

    {plan.days.map((day) => (
      <div key={day.day} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, marginBottom: 24, overflow: "hidden" }}>

        {/* Заголовок дня */}
        <div style={{ background: "linear-gradient(135deg, rgba(10,112,112,0.3), rgba(13,144,144,0.15))", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "18px 28px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(45,212,191,0.2)", border: "1px solid rgba(45,212,191,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#2DD4BF", fontFamily: "DM Sans, sans-serif", flexShrink: 0 }}>
            {day.day}
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", color: "white", fontWeight: 400, margin: 0 }}>
            {lang === "ru" ? `День ${day.day}` : lang === "az" ? `Gün ${day.day}` : `Day ${day.day}`}: {day.title}
          </h2>
        </div>

        <div style={{ padding: "20px 28px" }}>
          {[
            { label: t.morning, data: day.morning, icon: "🌅", color: "#f59e0b" },
            { label: t.afternoon, data: day.afternoon, icon: "☀️", color: "#10b981" },
            { label: t.evening, data: day.evening, icon: "🌙", color: "#818cf8" },
          ].map(({ label, data, icon, color }, idx, arr) => (
            <div key={label} style={{ marginBottom: idx < arr.length - 1 ? 0 : 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, paddingBottom: 20 }}>
                {/* Иконка + линия */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `rgba(255,255,255,0.06)`, border: `1px solid rgba(255,255,255,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                    {icon}
                  </div>
                  {idx < arr.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 20, background: "rgba(255,255,255,0.08)", marginTop: 6 }} />
                  )}
                </div>

                {/* Контент */}
                <div style={{ flex: 1, paddingBottom: idx < arr.length - 1 ? 16 : 0 }}>
                  <p style={{ color, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontFamily: "DM Sans, sans-serif" }}>{label}</p>
                  <p style={{ color: "white", fontSize: 15, fontWeight: 500, marginBottom: 6, fontFamily: "DM Sans, sans-serif" }}>{data.activity}</p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, marginBottom: data.tip ? 8 : 0, fontFamily: "DM Sans, sans-serif" }}>{data.description}</p>
                  {data.tip && (
                    <div style={{ display: "inline-flex", alignItems: "flex-start", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px" }}>
                      <span style={{ fontSize: 13 }}>💡</span>
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontStyle: "italic", margin: 0, fontFamily: "DM Sans, sans-serif", lineHeight: 1.5 }}>{data.tip}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Разделитель */}
              {idx < arr.length - 1 && (
                <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 0 20px 50px" }} />
              )}
            </div>
          ))}

          {/* Партнёрские кнопки */}
          {(day.hotel?.name || day.excursion?.name) && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
          )}
        </div>
      </div>
    ))}

    {/* Авиабилеты и аренда */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
      {plan.flights && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ color: "#2DD4BF", fontSize: 13, fontWeight: 500, marginBottom: 8, fontFamily: "DM Sans, sans-serif" }}>✈️ {t.flights}</p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: 12, fontFamily: "DM Sans, sans-serif" }}>{plan.flights.tip}</p>
          <a href={plan.flights.url} target="_blank" rel="noopener noreferrer" className="partner-btn-teal">{t.bookFlight}</a>
        </div>
      )}
      {plan.car_rental && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px 24px" }}>
          <p style={{ color: "#c9a84c", fontSize: 13, fontWeight: 500, marginBottom: 8, fontFamily: "DM Sans, sans-serif" }}>🚗 {t.carRental}</p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: 12, fontFamily: "DM Sans, sans-serif" }}>{plan.car_rental.tip}</p>
          <a href={plan.car_rental.url} target="_blank" rel="noopener noreferrer" className="partner-btn-gold">{t.bookCar}</a>
        </div>
      )}
    </div>

    <div style={{ textAlign: "center" }}>
      <button className="restart-btn" onClick={resetAll}>{t.restart}</button>
    </div>
  </div>
)}
      </div>
      <Footer locale={locale} />
    </main>
  );
}