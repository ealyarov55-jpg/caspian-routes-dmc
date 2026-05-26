"use client";

import { useState, useEffect } from "react";

/* ─── DESIGN TOKENS ─── */
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
  font: "'DM Sans', 'Manrope', system-ui, sans-serif",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
};

/* ─── MOCK DATA ─── */
const hotels = [
  {
    name: "Fairmont Baku",
    stars: 5,
    rating: 9.2,
    price: 185,
    location: "Flame Towers, Баку",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=260&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=260&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d955f4d24?w=400&h=260&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=260&fit=crop",
    ],
    tags: ["Спа", "Бассейн", "Вид на море"],
  },
  {
    name: "Boutique 19",
    stars: 4,
    rating: 8.8,
    price: 72,
    location: "Ичери Шехер, Баку",
    photos: [
      "https://images.unsplash.com/photo-1618773928121-c32f3eaea327?w=400&h=260&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=260&fit=crop",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=260&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=260&fit=crop",
    ],
    tags: ["Историч. центр", "Завтрак вкл.", "Wi-Fi"],
  },
  {
    name: "Qafqaz Riverside",
    stars: 5,
    rating: 9.0,
    price: 110,
    location: "Габала",
    photos: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=260&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=260&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=260&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=260&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=260&fit=crop",
    ],
    tags: ["Горы", "Ресторан", "Природа"],
  },
];

const itinerary = [
  { day: 1, city: "Баку", spots: ["Ичери Шехер", "Девичья Башня", "Приморский бульвар"], km: 8 },
  { day: 2, city: "Баку", spots: ["Гобустан", "Грязевые вулканы", "Ateshgah"], km: 120 },
  { day: 3, city: "Габала", spots: ["Tufandag", "Nohur Lake", "Vandam"], km: 210 },
  { day: 4, city: "Шеки", spots: ["Дворец Шекинских ханов", "Базар", "Караван-сарай"], km: 140 },
  { day: 5, city: "Баку", spots: ["Шоппинг", "Нагорный парк", "Ужин"], km: 300 },
];

/* ─── COMPONENTS ─── */

function GlowOrb({ top, left, color, size = 200 }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color || T.accentGlow,
        filter: "blur(80px)",
        pointerEvents: "none",
      }}
    />
  );
}

function DataChip({ icon, label, value, accent }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 10,
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>
          {label}
        </div>
        <div style={{ fontSize: 13, color: accent || T.accent, fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}

function HotelCard({ hotel, index }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        minWidth: 300,
        maxWidth: 320,
        borderRadius: T.radius,
        background: isHovered ? T.bgCardHover : T.bgCard,
        border: `1px solid ${isHovered ? T.borderAccent : T.border}`,
        overflow: "hidden",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "none",
        boxShadow: isHovered ? `0 12px 40px rgba(0,0,0,0.4), 0 0 20px ${T.accentGlow}` : "none",
        animation: `fadeSlideUp 0.5s ease ${index * 0.1}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photo gallery */}
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <img
          src={hotel.photos[photoIdx]}
          alt={hotel.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.3s",
          }}
        />
        {/* Photo dots */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 5,
          }}
        >
          {hotel.photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhotoIdx(i)}
              style={{
                width: i === photoIdx ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: i === photoIdx ? T.accent : "rgba(255,255,255,0.5)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                padding: 0,
              }}
            />
          ))}
        </div>
        {/* Nav arrows */}
        <button
          onClick={() => setPhotoIdx((p) => (p > 0 ? p - 1 : hotel.photos.length - 1))}
          style={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            cursor: "pointer",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.2s",
            padding: 0,
          }}
        >
          ‹
        </button>
        <button
          onClick={() => setPhotoIdx((p) => (p < hotel.photos.length - 1 ? p + 1 : 0))}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            cursor: "pointer",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.2s",
            padding: 0,
          }}
        >
          ›
        </button>
        {/* Star badge */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "3px 8px",
            borderRadius: 6,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            fontSize: 11,
            color: T.warn,
          }}
        >
          {"★".repeat(hotel.stars)}
        </div>
        {/* Rating */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            padding: "4px 8px",
            borderRadius: 6,
            background: T.accent,
            fontSize: 12,
            fontWeight: 700,
            color: "#06090f",
          }}
        >
          {hotel.rating}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 2 }}>{hotel.name}</div>
        <div style={{ fontSize: 12, color: T.textSoft, marginBottom: 10 }}>📍 {hotel.location}</div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
          {hotel.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "3px 8px",
                borderRadius: 5,
                fontSize: 10,
                color: T.accent,
                border: `1px solid ${T.borderAccent}`,
                background: T.accentGlow,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price + Book */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 700, color: T.text }}>${hotel.price}</span>
            <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 4 }}>/ ночь</span>
          </div>
          <button
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              background: `linear-gradient(135deg, ${T.accent}, #00b894)`,
              border: "none",
              color: "#06090f",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: `0 4px 15px ${T.accentGlow}`,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = `0 6px 25px ${T.accentGlowStrong}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = `0 4px 15px ${T.accentGlow}`;
            }}
          >
            Забронировать →
          </button>
        </div>
      </div>
    </div>
  );
}

function TimelineDay({ item, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        borderRadius: 10,
        background: isActive ? T.accentGlow : T.bgCard,
        border: `1px solid ${isActive ? T.accent : T.border}`,
        cursor: "pointer",
        textAlign: "left",
        minWidth: 140,
        transition: "all 0.2s",
        transform: isActive ? "translateY(-2px)" : "none",
      }}
    >
      <div style={{ fontSize: 10, color: isActive ? T.accent : T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
        День {item.day}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginTop: 2 }}>{item.city}</div>
      <div style={{ fontSize: 11, color: T.textSoft, marginTop: 4 }}>
        {item.spots.length} мест · {item.km} км
      </div>
    </button>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 3,
            borderRadius: 2,
            background: i < current ? T.accent : i === current ? T.accentDim : T.bgCard,
            transition: "all 0.3s",
          }}
        />
      ))}
    </div>
  );
}

/* ─── MAIN ─── */
export default function CaspianCommandCenter() {
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const formSteps = [
    { label: "Куда", icon: "🌍", question: "Куда вы хотите поехать?", options: ["Баку", "Баку + Габала", "Весь Азербайджан", "Кавказ тур"] },
    { label: "Когда", icon: "📅", question: "Когда планируете поездку?", options: ["Июнь 2026", "Июль 2026", "Август 2026", "Сентябрь 2026"] },
    { label: "Бюджет", icon: "💰", question: "Бюджет на человека (без перелёта)?", options: ["$300-500", "$500-1000", "$1000-2000", "$2000+"] },
    { label: "Стиль", icon: "🎯", question: "Стиль путешествия?", options: ["🏃 Максимум мест", "🧘 Расслабленный", "🍽 Фуди-тур", "📸 Фотогеничные места"] },
    { label: "Группа", icon: "👥", question: "Кто едет?", options: ["Solo", "Пара", "Семья с детьми", "Друзья 3-6 чел"] },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.text,
        fontFamily: T.font,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        ::-webkit-scrollbar { height: 4px; width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.borderAccent}; border-radius: 2px; }
      `}</style>

      {/* Background effects */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <GlowOrb top="-5%" left="70%" color="rgba(0,212,170,0.04)" size={400} />
        <GlowOrb top="40%" left="-10%" color="rgba(0,100,200,0.03)" size={350} />
        <GlowOrb top="80%" left="60%" color="rgba(0,212,170,0.03)" size={300} />
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "gridPulse 8s ease infinite",
          }}
        />
      </div>

      {/* ─── NAV ─── */}
      <nav
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 28px",
          borderBottom: `1px solid ${T.border}`,
          backdropFilter: "blur(12px)",
          animation: "fadeIn 0.6s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.accent,
              boxShadow: `0 0 10px ${T.accent}`,
              animation: "pulse 2s ease infinite",
            }}
          />
          <span style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>
            CASPIAN<span style={{ color: T.accent }}>.</span>ROUTES
          </span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {["Планер", "Гайды", "Контакт"].map((item) => (
            <span
              key={item}
              style={{
                fontSize: 12,
                color: T.textSoft,
                cursor: "pointer",
                letterSpacing: 0.5,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = T.accent)}
              onMouseLeave={(e) => (e.target.style.color = T.textSoft)}
            >
              {item}
            </span>
          ))}
          <div
            style={{
              display: "flex",
              gap: 2,
              padding: "4px 6px",
              borderRadius: 6,
              background: T.bgCard,
              border: `1px solid ${T.border}`,
            }}
          >
            {["RU", "EN", "AZ", "TR"].map((lang, i) => (
              <span
                key={lang}
                style={{
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 4,
                  color: i === 0 ? T.accent : T.textMuted,
                  background: i === 0 ? T.accentGlow : "transparent",
                  cursor: "pointer",
                  fontWeight: i === 0 ? 600 : 400,
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      {!showResult && (
        <div style={{ position: "relative", zIndex: 5, padding: "48px 28px 20px" }}>
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              animation: loaded ? "fadeSlideUp 0.7s ease" : "none",
            }}
          >
            {/* Live data bar */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 32,
                flexWrap: "wrap",
                animation: "fadeSlideUp 0.7s ease 0.1s both",
              }}
            >
              <DataChip icon="🌤" label="Баку сейчас" value="31°C, ясно" />
              <DataChip icon="💱" label="Курс" value="1 AZN = 53.2 ₽" />
              <DataChip icon="✈️" label="Москва → Баку" value="от $145" accent={T.warn} />
              <DataChip icon="📊" label="Сезон" value="Высокий" accent="#f97316" />
            </div>

            {/* Headline */}
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 3,
                  color: T.accent,
                  marginBottom: 12,
                  fontWeight: 600,
                }}
              >
                AI Command Center
              </div>
              <h1
                style={{
                  fontFamily: T.fontDisplay,
                  fontSize: "clamp(32px, 5vw, 52px)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  margin: "0 0 14px",
                  letterSpacing: -1,
                }}
              >
                Спланируй Кавказ
                <br />
                <span style={{ color: T.accent }}>за 2 минуты</span>
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: T.textSoft,
                  lineHeight: 1.5,
                  maxWidth: 480,
                }}
              >
                Реальные цены. Реальные фото. Кнопка «Забронировать» — не через 10 кликов, а прямо в маршруте.
              </p>
            </div>

            {/* ─── PLANNER FORM ─── */}
            <div
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                padding: 24,
                maxWidth: 520,
                animation: "fadeSlideUp 0.7s ease 0.3s both",
              }}
            >
              <StepIndicator current={step} total={formSteps.length} />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 20 }}>{formSteps[step].icon}</span>
                <span style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>
                  Шаг {step + 1} из {formSteps.length}
                </span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: T.text, marginBottom: 16 }}>
                {formSteps[step].question}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {formSteps[step].options.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (step < formSteps.length - 1) {
                        setStep(step + 1);
                      } else {
                        setShowResult(true);
                      }
                    }}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 10,
                      background: T.bgCard,
                      border: `1px solid ${T.border}`,
                      color: T.text,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      animation: `slideInRight 0.3s ease ${i * 0.05}s both`,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = T.accent;
                      e.target.style.background = T.accentGlow;
                      e.target.style.color = T.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = T.border;
                      e.target.style.background = T.bgCard;
                      e.target.style.color = T.text;
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  style={{
                    background: "none",
                    border: "none",
                    color: T.textMuted,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ← Назад
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── RESULT VIEW ─── */}
      {showResult && (
        <div style={{ position: "relative", zIndex: 5, padding: "24px 28px", animation: "fadeSlideUp 0.5s ease" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Result header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <button
                  onClick={() => { setShowResult(false); setStep(0); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: T.textMuted,
                    fontSize: 12,
                    cursor: "pointer",
                    marginBottom: 8,
                    display: "block",
                  }}
                >
                  ← Новый маршрут
                </button>
                <h2 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 800, margin: 0 }}>
                  Ваш маршрут<span style={{ color: T.accent }}>.</span>
                </h2>
                <p style={{ fontSize: 13, color: T.textSoft, marginTop: 4 }}>
                  5 дней · Баку → Габала → Шеки · AI-оптимизирован
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <DataChip icon="💰" label="Бюджет" value="~$680" />
                <DataChip icon="🛣" label="Дистанция" value="778 км" />
                <DataChip icon="🌤" label="Погода" value="28-33°C" />
                <DataChip icon="💱" label="AZN/RUB" value="53.2 ₽" />
              </div>
            </div>

            {/* Map placeholder */}
            <div
              style={{
                height: 200,
                borderRadius: T.radius,
                background: `linear-gradient(135deg, rgba(0,212,170,0.04), rgba(0,100,200,0.03))`,
                border: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Route visualization */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={T.accent} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={T.accent} stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <path
                  d="M100,140 C200,60 300,100 450,70 S700,90 850,80 Q950,75 1000,100"
                  stroke="url(#routeGrad)"
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="6,4"
                />
                {[
                  { x: 100, y: 140, label: "Баку" },
                  { x: 450, y: 70, label: "Габала" },
                  { x: 750, y: 85, label: "Шеки" },
                  { x: 1000, y: 100, label: "Баку" },
                ].map((point) => (
                  <g key={point.label + point.x}>
                    <circle cx={point.x} cy={point.y} r={6} fill={T.accent} opacity={0.8} />
                    <circle cx={point.x} cy={point.y} r={3} fill="#fff" />
                    <text x={point.x} y={point.y - 14} textAnchor="middle" fill={T.textSoft} fontSize={11}>
                      {point.label}
                    </text>
                  </g>
                ))}
              </svg>
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 14,
                  fontSize: 10,
                  color: T.textMuted,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, display: "inline-block" }} />
                Интерактивная карта (Google Maps API)
              </div>
            </div>

            {/* Day timeline */}
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 8,
                marginBottom: 24,
              }}
            >
              {itinerary.map((item, i) => (
                <TimelineDay
                  key={item.day}
                  item={item}
                  isActive={activeDay === i}
                  onClick={() => setActiveDay(i)}
                />
              ))}
            </div>

            {/* Day detail */}
            <div
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius,
                padding: 20,
                marginBottom: 28,
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div style={{ fontSize: 10, color: T.accent, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>
                День {itinerary[activeDay].day} · {itinerary[activeDay].city}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {itinerary[activeDay].spots.map((spot, i) => (
                  <div
                    key={spot}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: T.bgCardHover,
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: T.accentGlow,
                        border: `1px solid ${T.borderAccent}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: T.accent,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 13, color: T.text }}>{spot}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels section */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div style={{ fontSize: 10, color: T.accent, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 2 }}>
                    Подобранные отели
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Где остановиться</div>
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, display: "inline-block", animation: "pulse 2s ease infinite" }} />
                  Цены обновлены: сегодня
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  overflowX: "auto",
                  paddingBottom: 12,
                }}
              >
                {hotels.map((hotel, i) => (
                  <HotelCard key={hotel.name} hotel={hotel} index={i} />
                ))}
              </div>
            </div>

            {/* Affiliate tours section */}
            <div
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: T.radius,
                padding: 20,
                marginBottom: 28,
              }}
            >
              <div style={{ fontSize: 10, color: T.warn, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 6 }}>
                Рекомендуемые экскурсии · GetYourGuide
              </div>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
                {[
                  { name: "Гобустан + Грязевые вулканы", price: 45, duration: "6 часов", rating: 4.8 },
                  { name: "Ночной тур по Баку", price: 35, duration: "3 часа", rating: 4.9 },
                  { name: "Шеки — однодневная поездка", price: 89, duration: "12 часов", rating: 4.7 },
                ].map((tour) => (
                  <div
                    key={tour.name}
                    style={{
                      minWidth: 220,
                      padding: "14px 16px",
                      borderRadius: 10,
                      background: T.bgCardHover,
                      border: `1px solid ${T.border}`,
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.warn + "44")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 6 }}>{tour.name}</div>
                    <div style={{ display: "flex", gap: 8, fontSize: 11, color: T.textSoft, marginBottom: 10 }}>
                      <span>⏱ {tour.duration}</span>
                      <span>★ {tour.rating}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: T.warn }}>${tour.price}</span>
                      <span style={{ fontSize: 11, color: T.accent, cursor: "pointer" }}>Подробнее →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export bar */}
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: "📄", label: "Скачать PDF" },
                { icon: "📤", label: "Поделиться" },
                { icon: "✏️", label: "Редактировать" },
              ].map((action) => (
                <button
                  key={action.label}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
                    background: T.bgCard,
                    border: `1px solid ${T.border}`,
                    color: T.textSoft,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.borderAccent;
                    e.currentTarget.style.color = T.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.color = T.textSoft;
                  }}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          position: "relative",
          zIndex: 5,
          marginTop: 48,
          padding: "20px 28px",
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
          color: T.textMuted,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span>© 2026 Caspian Routes</span>
        <div style={{ display: "flex", gap: 16 }}>
          <span>Travelpayouts</span>
          <span>GetYourGuide</span>
          <span>Privacy</span>
        </div>
      </footer>
    </div>
  );
}
