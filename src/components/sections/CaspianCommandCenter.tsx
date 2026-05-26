"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const T = {
  bg: "#06090f",
  bgCard: "rgba(255,255,255,0.03)",
  bgCardHover: "rgba(255,255,255,0.06)",
  accent: "#00d4aa",
  accentDim: "#00d4aa88",
  accentGlow: "rgba(0, 212, 170, 0.08)",
  accentGlowStrong: "rgba(0, 212, 170, 0.18)",
  warn: "#f59e0b",
  text: "#e8edf5",
  textSoft: "#94a3b8",
  textMuted: "#475569",
  border: "rgba(255,255,255,0.06)",
  borderAccent: "rgba(0, 212, 170, 0.15)",
  radius: 14,
  font: "'DM Sans', system-ui, sans-serif",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
};

type Plan = {
  plan_title: string;
  total_budget_estimate: string;
  days: Array<{
    day: number;
    title: string;
    morning: { activity: string; description: string; tip: string; curator_note?: string };
    afternoon: { activity: string; description: string; tip: string; curator_note?: string };
    evening: { activity: string; description: string; tip: string; curator_note?: string };
    excursion?: { name: string; url: string };
  }>;
  curated_stays?: Array<{ name: string; description: string; booking_url: string }>;
  logistics?: { title: string; content: string };
  flights?: { tip: string; url: string };
  car_rental?: { tip: string; url: string };
};

function GlowOrb({ top, left, color, size = 200 }: { top: string | number; left: string | number; color?: string; size?: number }) {
  return (
    <div style={{ position: "absolute", top, left, width: size, height: size, borderRadius: "50%", background: color || T.accentGlow, filter: "blur(80px)", pointerEvents: "none" }} />
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < current ? T.accent : i === current ? T.accentDim : T.bgCard, transition: "all 0.3s" }} />
      ))}
    </div>
  );
}

function LoadingView() {
  const [progress, setProgress] = useState(0);
  const steps = ["Анализируем интересы...", "Подбираем локации...", "Составляем маршрут...", "Добавляем инсайды...", "Финальная проверка..."];
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const p = setInterval(() => setProgress(prev => prev < 92 ? prev + 1 : prev), 180);
    const s = setInterval(() => setStepIdx(prev => prev < steps.length - 1 ? prev + 1 : prev), 2500);
    return () => { clearInterval(p); clearInterval(s); };
  }, []);

  return (
    <div style={{ padding: "80px 28px", textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.accentGlow, border: `1px solid ${T.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", fontSize: 28 }}>🗺️</div>
      <p style={{ color: T.accent, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>AI обрабатывает запрос</p>
      <p style={{ color: T.text, fontSize: 16, marginBottom: 32 }}>{steps[stepIdx]}</p>
      <div style={{ background: T.bgCard, borderRadius: 99, height: 4, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${T.accent}, #00b894)`, transition: "width 0.18s linear", borderRadius: 99 }} />
      </div>
      <p style={{ color: T.textMuted, fontSize: 12 }}>{progress}%</p>
    </div>
  );
}

function DayCard({ day }: { day: Plan["days"][0] }) {
  const [activeSlot, setActiveSlot] = useState<"morning" | "afternoon" | "evening">("morning");
  const slots = { morning: day.morning, afternoon: day.afternoon, evening: day.evening };
  const labels = { morning: "Утро", afternoon: "День", evening: "Вечер" };
  const colors = { morning: T.accent, afternoon: "#c9a84c", evening: "#a78bfa" };
  const active = slots[activeSlot];

  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
        <span style={{ fontSize: 10, color: T.accent, textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>День {day.day}</span>
        <h3 style={{ color: T.text, fontSize: 17, fontWeight: 600, margin: "4px 0 0" }}>{day.title}</h3>
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
        {(["morning", "afternoon", "evening"] as const).map(slot => (
          <button key={slot} onClick={() => setActiveSlot(slot)} style={{ flex: 1, padding: "10px 0", background: activeSlot === slot ? T.bgCardHover : "transparent", border: "none", borderBottom: activeSlot === slot ? `2px solid ${colors[slot]}` : "2px solid transparent", color: activeSlot === slot ? colors[slot] : T.textMuted, fontSize: 11, cursor: "pointer", transition: "all 0.2s", fontFamily: T.font, letterSpacing: 1, textTransform: "uppercase" }}>
            {labels[slot]}
          </button>
        ))}
      </div>
      <div style={{ padding: "16px 20px" }}>
        <p style={{ color: T.accent, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{active.activity}</p>
        <p style={{ color: T.textSoft, fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{active.description}</p>
        {active.curator_note && (
          <div style={{ borderLeft: `2px solid ${T.borderAccent}`, paddingLeft: 12 }}>
            <p style={{ color: T.textMuted, fontSize: 12, fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>{active.curator_note}</p>
          </div>
        )}
        {activeSlot === "afternoon" && day.excursion && (
          <a href={day.excursion.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "7px 14px", borderRadius: 8, background: T.accentGlow, border: `1px solid ${T.borderAccent}`, color: T.accent, fontSize: 12, textDecoration: "none" }}>
            🎫 {day.excursion.name} →
          </a>
        )}
      </div>
    </div>
  );
}

function ResultView({ plan, onReset }: { plan: Plan; onReset: () => void }) {
  return (
    <div style={{ position: "relative", zIndex: 5, padding: "24px 28px", animation: "fadeSlideUp 0.5s ease" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <button onClick={onReset} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 12, cursor: "pointer", marginBottom: 12, display: "block" }}>← Новый маршрут</button>
          <p style={{ color: T.accent, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>AI маршрут готов</p>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: T.text, margin: "0 0 8px" }}>{plan.plan_title}</h2>
          <p style={{ color: T.textSoft, fontSize: 13 }}>{plan.total_budget_estimate}</p>
        </div>

        {plan.logistics && (
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "16px 20px", marginBottom: 20 }}>
            <p style={{ color: T.accent, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>🚕 {plan.logistics.title}</p>
            <p style={{ color: T.textSoft, fontSize: 13, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>{plan.logistics.content}</p>
          </div>
        )}

        {plan.days.map(day => <DayCard key={day.day} day={day} />)}

        {plan.curated_stays && plan.curated_stays.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ color: T.accent, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Рекомендуемые отели</p>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
              {plan.curated_stays.map(hotel => (
                <a key={hotel.name} href={hotel.booking_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", minWidth: 220, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "14px 16px", transition: "border-color 0.2s", display: "block" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = T.accent)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}>
                  <p style={{ color: T.text, fontSize: 14, fontWeight: 600, margin: "0 0 6px" }}>{hotel.name}</p>
                  <p style={{ color: T.textSoft, fontSize: 12, lineHeight: 1.6, margin: "0 0 10px", fontStyle: "italic" }}>{hotel.description}</p>
                  <span style={{ color: T.accent, fontSize: 11 }}>Найти номер →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {plan.flights && (
            <a href={plan.flights.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "14px 16px" }}>
              <p style={{ color: T.accent, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>✈️ Авиабилеты</p>
              <p style={{ color: T.textSoft, fontSize: 12, lineHeight: 1.6, margin: "0 0 10px" }}>{plan.flights.tip}</p>
              <span style={{ color: T.accent, fontSize: 11 }}>Найти билеты →</span>
            </a>
          )}
          {plan.car_rental && (
            <a href={plan.car_rental.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "14px 16px" }}>
              <p style={{ color: T.warn, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>🚗 Аренда авто</p>
              <p style={{ color: T.textSoft, fontSize: 12, lineHeight: 1.6, margin: "0 0 10px" }}>{plan.car_rental.tip}</p>
              <span style={{ color: T.warn, fontSize: 11 }}>Найти авто →</span>
            </a>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={onReset} style={{ padding: "10px 28px", borderRadius: 10, background: T.bgCard, border: `1px solid ${T.border}`, color: T.textSoft, fontSize: 12, cursor: "pointer" }}>
            ← Создать новый маршрут
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CaspianCommandCenter() {
  const params = useParams();
  const locale = (params?.locale as string) || "ru";

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState("");

  const formSteps = [
    { key: "destination", icon: "🌍", question: locale === "ru" ? "Куда хотите поехать?" : "Where do you want to go?", options: locale === "ru" ? ["Только Баку", "Баку + Габала", "Баку + Шеки", "Весь Азербайджан"] : ["Baku only", "Baku + Gabala", "Baku + Sheki", "All Azerbaijan"] },
    { key: "days", icon: "📅", question: locale === "ru" ? "Сколько дней?" : "How many days?", options: ["3", "5", "7", "10+"] },
    { key: "budget", icon: "💰", question: locale === "ru" ? "Бюджет на человека?" : "Budget per person?", options: ["$300-500", "$500-1000", "$1000-2000", "$2000+"] },
    { key: "interests", icon: "🎯", question: locale === "ru" ? "Главный интерес?" : "Main interest?", options: locale === "ru" ? ["История и культура", "Природа", "Гастрономия", "Фото и архитектура"] : ["History & Culture", "Nature", "Food", "Photo & Architecture"] },
    { key: "group", icon: "👥", question: locale === "ru" ? "Кто едет?" : "Who's going?", options: locale === "ru" ? ["Один", "Пара", "Семья с детьми", "Друзья"] : ["Solo", "Couple", "Family", "Friends"] },
  ];

  const handleSelect = async (value: string) => {
    const newAnswers = { ...answers, [formSteps[step].key]: value };
    setAnswers(newAnswers);

    if (step < formSteps.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days: newAnswers.days,
          group: newAnswers.group,
          budget: newAnswers.budget,
          interests: [newAnswers.interests],
          from: newAnswers.destination,
          locale,
          diet: [],
          pace: "Средний",
        }),
      });
      const data = await res.json();
      if (data.plan) setPlan(data.plan);
      else setError(locale === "ru" ? "Ошибка генерации. Попробуй ещё раз." : "Generation error. Please try again.");
    } catch {
      setError(locale === "ru" ? "Ошибка сети." : "Network error.");
    }
    setLoading(false);
  };

  const reset = () => { setStep(0); setAnswers({}); setPlan(null); setError(""); };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font, overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes gridPulse { 0%, 100% { opacity: 0.03; } 50% { opacity: 0.06; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height: 4px; width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${T.borderAccent}; border-radius: 2px; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <GlowOrb top="-5%" left="70%" color="rgba(0,212,170,0.04)" size={400} />
        <GlowOrb top="40%" left="-10%" color="rgba(0,100,200,0.03)" size={350} />
        <GlowOrb top="80%" left="60%" color="rgba(0,212,170,0.03)" size={300} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", animation: "gridPulse 8s ease infinite" }} />
      </div>

      <nav style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, boxShadow: `0 0 10px ${T.accent}`, animation: "pulse 2s ease infinite" }} />
          <span style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>
            CASPIAN<span style={{ color: T.accent }}>.</span>ROUTES
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, padding: "4px 6px", borderRadius: 6, background: T.bgCard, border: `1px solid ${T.border}` }}>
          {["RU", "EN", "AZ", "TR"].map((l, i) => (
            <a key={l} href={`/${l.toLowerCase()}/planner`} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, color: locale.toUpperCase() === l ? T.accent : T.textMuted, background: locale.toUpperCase() === l ? T.accentGlow : "transparent", textDecoration: "none", fontWeight: locale.toUpperCase() === l ? 600 : 400 }}>{l}</a>
          ))}
        </div>
      </nav>

      {loading && <LoadingView />}

      {!loading && !plan && (
        <div style={{ position: "relative", zIndex: 5, padding: "48px 28px 40px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, color: T.accent, marginBottom: 12, fontWeight: 600 }}>AI Travel Planner</p>
              <h1 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 14px", letterSpacing: -1 }}>
                {locale === "ru" ? <>Спланируй Азербайджан<br /><span style={{ color: T.accent }}>за 2 минуты</span></> : <>Plan Azerbaijan<br /><span style={{ color: T.accent }}>in 2 minutes</span></>}
              </h1>
              <p style={{ fontSize: 14, color: T.textSoft, lineHeight: 1.6, maxWidth: 400 }}>
                {locale === "ru" ? "Реальные локации. Партнёрские ссылки на отели и экскурсии. Без регистрации." : "Real locations. Partner links for hotels and tours. No signup required."}
              </p>
            </div>

            <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: 24 }}>
              <StepIndicator current={step} total={formSteps.length} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{formSteps[step].icon}</span>
                <span style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                  {locale === "ru" ? `Шаг ${step + 1} из ${formSteps.length}` : `Step ${step + 1} of ${formSteps.length}`}
                </span>
              </div>
              <p style={{ fontSize: 17, fontWeight: 600, color: T.text, marginBottom: 16 }}>{formSteps[step].question}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {formSteps[step].options.map((opt, i) => (
                  <button key={opt} onClick={() => handleSelect(opt)}
                    style={{ padding: "10px 18px", borderRadius: 10, background: T.bgCard, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, cursor: "pointer", transition: "all 0.2s", animation: `slideInRight 0.3s ease ${i * 0.05}s both`, fontFamily: T.font }}
                    onMouseEnter={e => { (e.currentTarget).style.borderColor = T.accent; (e.currentTarget).style.background = T.accentGlow; (e.currentTarget).style.color = T.accent; }}
                    onMouseLeave={e => { (e.currentTarget).style.borderColor = T.border; (e.currentTarget).style.background = T.bgCard; (e.currentTarget).style.color = T.text; }}>
                    {opt}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 12, cursor: "pointer", fontFamily: T.font }}>
                  ← {locale === "ru" ? "Назад" : "Back"}
                </button>
              )}
              {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>{error}</p>}
            </div>
          </div>
        </div>
      )}

      {!loading && plan && <ResultView plan={plan} onReset={reset} />}

      <footer style={{ position: "relative", zIndex: 5, marginTop: 48, padding: "20px 28px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: T.textMuted, flexWrap: "wrap", gap: 8 }}>
        <span>© 2026 Caspian Routes</span>
        <div style={{ display: "flex", gap: 16 }}>
          <a href={`/${locale}/blog`} style={{ color: T.textMuted, textDecoration: "none" }}>Путеводитель</a>
          <a href={`/${locale}/contact`} style={{ color: T.textMuted, textDecoration: "none" }}>Контакт</a>
        </div>
      </footer>
    </div>
  );
}