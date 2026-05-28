"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const T = {
  bg: "#06090f",
  bgCard: "rgba(255,255,255,0.03)",
  bgCardHover: "rgba(255,255,255,0.06)",
  sidebar: "#080e18",
  accent: "#00d4aa",
  accentDim: "rgba(0,212,170,0.5)",
  accentGlow: "rgba(0,212,170,0.08)",
  accentBorder: "rgba(0,212,170,0.15)",
  text: "#e8edf5",
  textSoft: "#94a3b8",
  textMuted: "#475569",
  border: "rgba(255,255,255,0.06)",
  font: "'DM Sans', system-ui, sans-serif",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
};

type Prefs = {
  duration: string | null;
  group: string | null;
  budget: string | null;
  interests: string[];
  pace: string | null;
};

type Message = {
  role: "ai" | "user";
  text: string;
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

const STEPS = ["duration", "group", "budget", "interests", "pace"] as const;

const OPTIONS = {
  duration: [
    { icon: "🌸", label: "1–3 дня", value: "3" },
    { icon: "🏖", label: "4–5 дней", value: "5" },
    { icon: "✈️", label: "6–7 дней", value: "7" },
    { icon: "🌍", label: "8+ дней", value: "10+" },
  ],
  group: [
    { icon: "🙋", label: "Один / одна" },
    { icon: "💑", label: "Пара" },
    { icon: "👨‍👩‍👧‍👦", label: "С детьми" },
    { icon: "👫", label: "Друзья" },
  ],
  budget: [
    { icon: "💚", label: "Эконом", value: "$300-500" },
    { icon: "💛", label: "Комфорт", value: "$500-1000" },
    { icon: "🧡", label: "Бизнес", value: "$1000-2000" },
    { icon: "❤️", label: "Люкс", value: "$2000+" },
  ],
  pace: [
    { icon: "🧘", label: "Расслабленный", value: "Расслабленный" },
    { icon: "⚡", label: "Насыщенный", value: "Насыщенный" },
    { icon: "⚖️", label: "Сбалансированный", value: "Сбалансированный" },
  ],
};

const QUESTIONS = {
  duration: "Когда планируете поехать и на сколько дней?",
  group: "С кем едете?",
  budget: "Какой примерный бюджет на человека?",
  interests: "Что вас привлекает в Азербайджане? Выберите всё, что нравится:",
  pace: "Последний вопрос — какой темп вам ближе?",
};

const INTERESTS_OPTIONS = [
  { icon: "🏛", label: "История и архитектура" },
  { icon: "🌿", label: "Природа и горы" },
  { icon: "🍽", label: "Гастрономия" },
  { icon: "🏖", label: "Пляж и море" },
  { icon: "🎨", label: "Искусство и культура" },
  { icon: "🧘", label: "Спа и отдых" },
  { icon: "🏄", label: "Активный отдых" },
  { icon: "🛍", label: "Шопинг" },
];

function DayCard({ day }: { day: Plan["days"][0] }) {
  const [activeSlot, setActiveSlot] = useState<"morning" | "afternoon" | "evening">("morning");
  const slots = { morning: day.morning, afternoon: day.afternoon, evening: day.evening };
  const labels = { morning: "Утро", afternoon: "День", evening: "Вечер" };
  const colors = { morning: T.accent, afternoon: "#c9a84c", evening: "#a78bfa" };
  const active = slots[activeSlot];

  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
        <span style={{ fontSize: 10, color: T.accent, textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>День {day.day}</span>
        <h3 style={{ color: T.text, fontSize: 15, fontWeight: 600, margin: "4px 0 0", fontFamily: T.fontDisplay }}>{day.title}</h3>
      </div>
      <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
        {(["morning", "afternoon", "evening"] as const).map(slot => (
          <button key={slot} onClick={() => setActiveSlot(slot)} style={{ flex: 1, padding: "8px 0", background: activeSlot === slot ? T.bgCardHover : "transparent", border: "none", borderBottom: activeSlot === slot ? `2px solid ${colors[slot]}` : "2px solid transparent", color: activeSlot === slot ? colors[slot] : T.textMuted, fontSize: 11, cursor: "pointer", transition: "all 0.2s", fontFamily: T.font, letterSpacing: 1, textTransform: "uppercase" }}>
            {labels[slot]}
          </button>
        ))}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <p style={{ color: T.accent, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{active.activity}</p>
        <p style={{ color: T.textSoft, fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{active.description}</p>
        {active.curator_note && (
          <div style={{ borderLeft: `2px solid ${T.accentBorder}`, paddingLeft: 10, marginBottom: 8 }}>
            <p style={{ color: T.textMuted, fontSize: 12, fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>{active.curator_note}</p>
          </div>
        )}
        {activeSlot === "afternoon" && day.excursion && (
          <a href={day.excursion.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: T.accentGlow, border: `1px solid ${T.accentBorder}`, color: T.accent, fontSize: 12, textDecoration: "none" }}>
            🎫 {day.excursion.name} →
          </a>
        )}
      </div>
    </div>
  );
}

export default function CaspianCommandCenter() {
  const params = useParams();
  const locale = (params?.locale as string) || "ru";

  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<Prefs>({ duration: null, group: null, budget: null, interests: [], pace: null });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [postPlanOptions, setPostPlanOptions] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollBottom = () => {
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 50);
  };

  const addAIMessage = (text: string, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: "ai", text }]);
      scrollBottom();
    }, delay);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { role: "user", text }]);
    scrollBottom();
  };

  // Init
  useEffect(() => {
    setTimeout(() => {
      addAIMessage("Привет! Я помогу составить маршрут по Азербайджану специально под вас.\n\nПодготовлю персональный итинерарий за 5 вопросов — это займёт меньше минуты. 🗺", 600);
      setTimeout(() => addAIMessage(QUESTIONS.duration), 1800);
    }, 400);
  }, []);

  const handleOption = async (value: string, label: string) => {
    if (generating) return;
    addUserMessage(label);

    const currentStep = STEPS[step];

    if (currentStep === "duration") {
      const newPrefs = { ...prefs, duration: value };
      setPrefs(newPrefs);
      setStep(1);
      setTimeout(() => addAIMessage(QUESTIONS.group), 600);

    } else if (currentStep === "group") {
      const newPrefs = { ...prefs, group: label };
      setPrefs(newPrefs);
      setStep(2);
      setTimeout(() => addAIMessage(QUESTIONS.budget), 600);

    } else if (currentStep === "budget") {
      const newPrefs = { ...prefs, budget: value };
      setPrefs(newPrefs);
      setStep(3);
      setTimeout(() => addAIMessage(QUESTIONS.interests), 600);

    } else if (currentStep === "pace") {
      const newPrefs = { ...prefs, pace: value };
      setPrefs(newPrefs);
      setStep(5);
      setTimeout(() => generatePlan(newPrefs), 600);
    }
  };

  const handleInterestsDone = () => {
    const interests = selectedInterests.length > 0 ? selectedInterests : ["Разное"];
    addUserMessage(interests.join(", "));
    const newPrefs = { ...prefs, interests };
    setPrefs(newPrefs);
    setStep(4);
    setTimeout(() => addAIMessage(QUESTIONS.pace), 600);
  };

  const generatePlan = async (finalPrefs: Prefs) => {
    addAIMessage("Отлично! У меня всё есть. Составляю персональный маршрут... ✨", 400);
    setGenerating(true);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          days: finalPrefs.duration,
          group: finalPrefs.group,
          budget: finalPrefs.budget,
          interests: finalPrefs.interests,
          from: "Весь Азербайджан",
          locale,
          diet: [],
          pace: finalPrefs.pace,
        }),
      });
      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
        setActiveDay(1);
        setTimeout(() => {
          addAIMessage("Маршрут готов! 🎉\n\nМогу скорректировать под ваши пожелания — добавить день, убрать место или найти альтернативу.", 600);
          setTimeout(() => setPostPlanOptions(true), 1200);
        }, 800);
      } else {
        addAIMessage("Ошибка генерации. Попробуйте ещё раз.");
      }
    } catch {
      addAIMessage("Ошибка сети. Проверьте подключение.");
    }
    setGenerating(false);
  };

  const continueChat = async (userMsg: string) => {
    if (generating) return;
    setGenerating(true);
    setPostPlanOptions(false);
    setIsTyping(true);

    const systemPrompt = `Ты — travel-консультант по Азербайджану. Контекст: ${prefs.duration} дней, ${prefs.group}, бюджет ${prefs.budget}, интересы: ${prefs.interests.join(", ")}, темп ${prefs.pace}. Отвечай конкретно, по-русски. Максимум 150 слов.`;

    const newHistory = [...chatHistory, { role: "user", content: userMsg }];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, system: systemPrompt }),
      });
      const data = await res.json();
      const text = data.text || "Попробуйте переформулировать.";
      setChatHistory([...newHistory, { role: "assistant", content: text }]);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: "ai", text }]);
      scrollBottom();
      setTimeout(() => setPostPlanOptions(true), 600);
    } catch {
      setIsTyping(false);
      addAIMessage("Ошибка. Попробуйте снова.");
    }
    setGenerating(false);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || generating) return;
    setInputValue("");
    addUserMessage(text);
    if (step >= 5) {
      continueChat(text);
    } else {
      addAIMessage("Понял! Давайте продолжим.");
    }
  };

  const postOptions = [
    { icon: "✏️", label: "Изменить маршрут" },
    { icon: "💰", label: "Сделать дешевле" },
    { icon: "🏨", label: "Посоветуй отели" },
    { icon: "🍽", label: "Рестораны на маршруте" },
    { icon: "🚕", label: "Как добраться" },
    { icon: "📋", label: "Новый маршрут" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, color: T.text, fontFamily: T.font, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        * { box-sizing: border-box; }
        .opt-btn:hover { border-color: ${T.accent} !important; color: ${T.accent} !important; background: ${T.accentGlow} !important; transform: translateY(-1px); }
        .post-opt:hover { border-color: ${T.accent} !important; color: ${T.accent} !important; background: ${T.accentGlow} !important; }
        .interest-btn.selected { border-color: ${T.accent} !important; color: ${T.accent} !important; background: ${T.accentGlow} !important; }
        .day-tab.active { border-color: ${T.accent} !important; color: ${T.accent} !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,170,0.2); border-radius: 2px; }
        @media(max-width:767px) { .sidebar { display: none !important; } .planner-main { border-left: none !important; } }
      `}</style>

      {/* Sidebar */}
      <aside className="sidebar" style={{ width: 260, flexShrink: 0, background: T.sidebar, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "24px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(0,212,170,0.04)", filter: "blur(40px)", pointerEvents: "none" }} />

        <Link href={`/${locale}`} style={{ textDecoration: "none", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, boxShadow: `0 0 8px ${T.accent}`, animation: "pulse 2s ease infinite" }} />
            <span style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>
              CASPIAN<span style={{ color: T.accent }}>.</span>ROUTES
            </span>
          </div>
        </Link>

        <p style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Профиль поездки</p>

        {[
          { icon: "🗓", key: "duration", label: "Длительность", value: prefs.duration ? `${prefs.duration} дней` : null },
          { icon: "👥", key: "group", label: "Состав", value: prefs.group },
          { icon: "💳", key: "budget", label: "Бюджет", value: prefs.budget },
          { icon: "🎯", key: "interests", label: "Интересы", value: prefs.interests.length > 0 ? prefs.interests.slice(0, 2).join(", ") + (prefs.interests.length > 2 ? "..." : "") : null },
          { icon: "🚶", key: "pace", label: "Темп", value: prefs.pace },
        ].map(item => (
          <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: T.bgCard, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{item.icon}</div>
            <div>
              <span style={{ fontSize: 10, color: T.textMuted, display: "block", marginBottom: 1 }}>{item.label}</span>
              <span style={{ fontSize: 12, color: item.value ? T.textSoft : T.textMuted, fontStyle: item.value ? "normal" : "italic" }}>
                {item.value || "Не указано"}
              </span>
            </div>
          </div>
        ))}

        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <div style={{ display: "flex", gap: 6, padding: "6px 8px", borderRadius: 8, background: T.bgCard, border: `1px solid ${T.border}` }}>
            {["ru", "en", "az", "tr"].map(l => (
              <a key={l} href={`/${l}/planner`} style={{ flex: 1, textAlign: "center", fontSize: 10, padding: "3px 0", borderRadius: 4, color: locale === l ? T.accent : T.textMuted, background: locale === l ? T.accentGlow : "transparent", textDecoration: "none", fontWeight: locale === l ? 600 : 400 }}>{l.toUpperCase()}</a>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="planner-main" style={{ flex: 1, display: "flex", flexDirection: "column", borderLeft: `1px solid ${T.border}`, overflow: "hidden" }}>

        {/* Topbar */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <span style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 800, color: T.text }}>AI <span style={{ color: T.accent }}>планер</span> маршрутов</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: T.accentGlow, border: `1px solid ${T.accentBorder}` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: "pulse 2s ease infinite" }} />
            <span style={{ fontSize: 11, color: T.accent, fontWeight: 500 }}>ИИ активен</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 3, padding: "0 20px", paddingTop: 10, paddingBottom: 6, flexShrink: 0 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i < step ? T.accent : i === step ? T.accentDim : T.bgCard, transition: "all 0.3s" }} />
          ))}
        </div>

        {/* Chat area */}
        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>

          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: 10, maxWidth: "85%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row", animation: "fadeUp 0.3s ease" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: msg.role === "ai" ? T.accent : T.bgCard, color: msg.role === "ai" ? "#06090f" : T.textMuted, fontSize: msg.role === "ai" ? 10 : 13, fontWeight: 600, marginTop: 2 }}>
                {msg.role === "ai" ? "CR" : "👤"}
              </div>
              <div style={{ padding: "10px 14px", borderRadius: msg.role === "ai" ? "4px 12px 12px 12px" : "12px 4px 12px 12px", background: msg.role === "ai" ? T.bgCard : T.accent, color: msg.role === "ai" ? T.text : "#06090f", fontSize: 14, lineHeight: 1.6, border: msg.role === "ai" ? `1px solid ${T.border}` : "none", whiteSpace: "pre-line" }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", gap: 10, alignItems: "center", animation: "fadeUp 0.3s ease" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: T.accent, color: "#06090f", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>CR</div>
              <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "4px 12px 12px 12px" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.textMuted, animation: `bounce 0.9s ease-in-out ${i * 0.15}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* Quick options */}
          {!generating && !isTyping && step < STEPS.length && STEPS[step] !== "interests" && STEPS[step] !== "pace" && step === messages.filter(m => m.role === "ai").length - 1 && (
            <div style={{ paddingLeft: 40, display: "flex", flexWrap: "wrap", gap: 7, animation: "fadeUp 0.35s ease 0.1s both" }}>
              {OPTIONS[STEPS[step] as keyof typeof OPTIONS]?.map((opt: any) => (
                <button key={opt.label} className="opt-btn" onClick={() => handleOption(opt.value || opt.label, opt.label)}
                  style={{ padding: "7px 14px", border: `1px solid ${T.border}`, borderRadius: 20, background: T.bgCard, color: T.text, fontSize: 13, fontFamily: T.font, cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{opt.icon}</span>{opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Pace options */}
          {!generating && !isTyping && STEPS[step] === "pace" && step === messages.filter(m => m.role === "ai").length - 1 && (
            <div style={{ paddingLeft: 40, display: "flex", flexWrap: "wrap", gap: 7, animation: "fadeUp 0.35s ease 0.1s both" }}>
              {OPTIONS.pace.map(opt => (
                <button key={opt.label} className="opt-btn" onClick={() => handleOption(opt.value, opt.label)}
                  style={{ padding: "7px 14px", border: `1px solid ${T.border}`, borderRadius: 20, background: T.bgCard, color: T.text, fontSize: 13, fontFamily: T.font, cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{opt.icon}</span>{opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Interests multi-select */}
          {!generating && !isTyping && STEPS[step] === "interests" && step === messages.filter(m => m.role === "ai").length - 1 && (
            <div style={{ paddingLeft: 40, animation: "fadeUp 0.35s ease 0.1s both" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
                {INTERESTS_OPTIONS.map(opt => (
                  <button key={opt.label} className={`interest-btn${selectedInterests.includes(opt.label) ? " selected" : ""}`}
                    onClick={() => setSelectedInterests(prev => prev.includes(opt.label) ? prev.filter(i => i !== opt.label) : [...prev, opt.label])}
                    style={{ padding: "7px 14px", border: `1px solid ${T.border}`, borderRadius: 20, background: T.bgCard, color: T.text, fontSize: 13, fontFamily: T.font, cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{opt.icon}</span>{opt.label}
                  </button>
                ))}
              </div>
              <button onClick={handleInterestsDone}
                style={{ padding: "8px 20px", borderRadius: 20, background: T.accent, color: "#06090f", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: T.font }}>
                ✓ Готово
              </button>
            </div>
          )}

          {/* Plan result */}
          {plan && (
            <div style={{ animation: "fadeUp 0.5s ease", marginTop: 8 }}>
              {/* Plan header */}
              <div style={{ background: T.accentGlow, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                <p style={{ fontSize: 10, color: T.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>✦ Ваш маршрут готов</p>
                <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1rem, 2vw, 1.3rem)", color: T.text, fontWeight: 800, margin: "0 0 4px" }}>{plan.plan_title}</h2>
                <p style={{ color: T.textSoft, fontSize: 12, margin: 0 }}>{plan.total_budget_estimate}</p>
              </div>

              {/* Day tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                {plan.days.map(day => (
                  <button key={day.day} className={`day-tab${activeDay === day.day ? " active" : ""}`}
                    onClick={() => setActiveDay(day.day)}
                    style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${activeDay === day.day ? T.accent : T.border}`, background: activeDay === day.day ? T.accentGlow : T.bgCard, color: activeDay === day.day ? T.accent : T.textMuted, fontSize: 12, cursor: "pointer", fontFamily: T.font, transition: "all 0.2s" }}>
                    День {day.day}
                  </button>
                ))}
              </div>

              {/* Active day card */}
              {activeDay && plan.days.find(d => d.day === activeDay) && (
                <DayCard day={plan.days.find(d => d.day === activeDay)!} />
              )}

              {/* Logistics */}
              {plan.logistics && (
                <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
                  <p style={{ color: T.accent, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>🚕 {plan.logistics.title}</p>
                  <p style={{ color: T.textSoft, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{plan.logistics.content}</p>
                </div>
              )}

              {/* Hotels */}
              {plan.curated_stays && plan.curated_stays.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ color: T.accent, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>🏨 Рекомендуемые отели</p>
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                    {plan.curated_stays.map(hotel => (
                      <a key={hotel.name} href={hotel.booking_url} target="_blank" rel="noopener noreferrer"
                        style={{ textDecoration: "none", minWidth: 200, background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", display: "block" }}>
                        <p style={{ color: T.text, fontSize: 13, fontWeight: 600, margin: "0 0 4px" }}>{hotel.name}</p>
                        <p style={{ color: T.textSoft, fontSize: 12, lineHeight: 1.5, margin: "0 0 8px" }}>{hotel.description}</p>
                        <span style={{ color: T.accent, fontSize: 11 }}>Найти номер →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Flights & Car */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                {plan.flights && (
                  <a href={plan.flights.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ color: T.accent, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>✈️ Авиабилеты</p>
                    <p style={{ color: T.textSoft, fontSize: 12, lineHeight: 1.5, margin: "0 0 8px" }}>{plan.flights.tip}</p>
                    <span style={{ color: T.accent, fontSize: 11 }}>Найти билеты →</span>
                  </a>
                )}
                {plan.car_rental && (
                  <a href={plan.car_rental.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ color: "#f59e0b", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>🚗 Аренда авто</p>
                    <p style={{ color: T.textSoft, fontSize: 12, lineHeight: 1.5, margin: "0 0 8px" }}>{plan.car_rental.tip}</p>
                    <span style={{ color: "#f59e0b", fontSize: 11 }}>Найти авто →</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Post-plan options */}
          {postPlanOptions && (
            <div style={{ paddingLeft: 40, display: "flex", flexWrap: "wrap", gap: 7, animation: "fadeUp 0.35s ease both" }}>
              {postOptions.map(opt => (
                <button key={opt.label} className="post-opt"
                  onClick={() => {
                    setPostPlanOptions(false);
                    if (opt.label === "Новый маршрут") {
                      window.location.reload();
                    } else {
                      addUserMessage(opt.label);
                      continueChat(opt.label);
                    }
                  }}
                  style={{ padding: "7px 14px", border: `1px solid ${T.border}`, borderRadius: 20, background: T.bgCard, color: T.text, fontSize: 13, fontFamily: T.font, cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{opt.icon}</span>{opt.label}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Input area */}
        <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Напишите или выберите вариант выше..."
              rows={1}
              style={{ flex: 1, minHeight: 44, maxHeight: 120, padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: 12, background: T.bgCard, color: T.text, fontSize: 14, fontFamily: T.font, resize: "none", outline: "none", lineHeight: 1.5, transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = T.border}
            />
            <button onClick={handleSend} disabled={generating || !inputValue.trim()}
              style={{ width: 44, height: 44, borderRadius: 12, background: T.accent, border: "none", cursor: generating ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: generating || !inputValue.trim() ? 0.4 : 1, transition: "all 0.18s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06090f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p style={{ fontSize: 11, color: T.textMuted, marginTop: 6, textAlign: "center" }}>Enter для отправки · Shift+Enter для переноса строки</p>
        </div>
      </div>
    </div>
  );
}