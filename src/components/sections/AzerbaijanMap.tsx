"use client";
import { useState } from "react";
import Link from "next/link";

const T = {
  bg: "#06090f",
  accent: "#00d4aa",
  border: "rgba(255,255,255,0.06)",
  text: "#e8edf5",
  textSoft: "#94a3b8",
  textMuted: "#475569",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
  font: "'DM Sans', system-ui, sans-serif",
};

interface Location {
  id: string;
  name: { ru: string; en: string; az: string; tr: string };
  desc: { ru: string; en: string; az: string; tr: string };
  days: { ru: string; en: string; az: string; tr: string };
  x: number;
  y: number;
}

const locations: Location[] = [
  {
    id: "baku",
    name: { ru: "Баку", en: "Baku", az: "Bakı", tr: "Bakü" },
    desc: { ru: "Столица и сердце Азербайджана", en: "Capital of Azerbaijan", az: "Azərbaycanın paytaxtı", tr: "Azerbaycan'ın başkenti" },
    days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" },
    x: 580, y: 248,
  },
  {
    id: "gabala",
    name: { ru: "Габала", en: "Gabala", az: "Qəbələ", tr: "Gabala" },
    desc: { ru: "Швейцария Азербайджана", en: "Switzerland of Azerbaijan", az: "Azərbaycanın İsveçrəsi", tr: "Azerbaycan'ın İsviçresi" },
    days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" },
    x: 460, y: 178,
  },
  {
    id: "sheki",
    name: { ru: "Шеки", en: "Sheki", az: "Şəki", tr: "Şeki" },
    desc: { ru: "Древний город Шёлкового пути", en: "Ancient Silk Road city", az: "Qədim İpək Yolu şəhəri", tr: "Antik İpek Yolu şehri" },
    days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" },
    x: 355, y: 175,
  },
  {
    id: "gobustan",
    name: { ru: "Гобустан", en: "Gobustan", az: "Qobustan", tr: "Gobustan" },
    desc: { ru: "Петроглифы и грязевые вулканы", en: "Petroglyphs and mud volcanoes", az: "Qayaüstü rəsmlər", tr: "Kaya resimleri" },
    days: { ru: "от 1 дня", en: "from 1 day", az: "1 gündən", tr: "1 günden" },
    x: 548, y: 278,
  },
  {
    id: "khinalug",
    name: { ru: "Хыналыг", en: "Khinalug", az: "Xınalıq", tr: "Hınalıg" },
    desc: { ru: "Высокогорное древнее село", en: "Ancient high mountain village", az: "Dağ kəndi", tr: "Dağ köyü" },
    days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" },
    x: 510, y: 148,
  },
  {
    id: "lahij",
    name: { ru: "Лагич", en: "Lahij", az: "Lahıc", tr: "Lahıc" },
    desc: { ru: "Деревня мастеров-ремесленников", en: "Village of craftsmen", az: "Sənətkarlar kəndi", tr: "Zanaatkârlar köyü" },
    days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" },
    x: 498, y: 200,
  },
  {
    id: "shahdag",
    name: { ru: "Шахдаг", en: "Shahdag", az: "Şahdağ", tr: "Şahdağ" },
    desc: { ru: "Главный горный курорт страны", en: "Top mountain resort", az: "Ən böyük dağ kurort", tr: "Başlıca dağ tatil köyü" },
    days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" },
    x: 530, y: 158,
  },
  {
    id: "guba",
    name: { ru: "Губа", en: "Guba", az: "Quba", tr: "Kuba" },
    desc: { ru: "Яблочный край и природа севера", en: "Apple region and northern nature", az: "Alma diyarı", tr: "Elma diyarı" },
    days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" },
    x: 570, y: 128,
  },
  {
    id: "naftalan",
    name: { ru: "Нафталан", en: "Naftalan", az: "Naftalan", tr: "Naftalan" },
    desc: { ru: "Уникальный нефтяной курорт-санаторий", en: "Unique oil therapy spa resort", az: "Neft spa kurort", tr: "Benzersiz petrol spa" },
    days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" },
    x: 295, y: 210,
  },
  {
    id: "lankaran",
    name: { ru: "Ленкорань", en: "Lankaran", az: "Lənkəran", tr: "Lenkoran" },
    desc: { ru: "Субтропики и чайные плантации", en: "Subtropics and tea plantations", az: "Subtropik və çay bağları", tr: "Subtropik ve çay bahçeleri" },
    days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" },
    x: 498, y: 340,
  },
];

const azerbaijanPath = `
  M 180,195 L 195,178 L 215,168 L 238,162 L 255,155 L 272,148 L 290,142 L 310,138
  L 330,135 L 348,133 L 365,130 L 382,128 L 400,126 L 418,125 L 435,124 L 452,122
  L 468,120 L 485,118 L 502,116 L 520,115 L 538,116 L 556,118 L 572,122 L 586,128
  L 598,136 L 608,146 L 615,158 L 618,170 L 618,183 L 615,196 L 610,208 L 604,220
  L 598,232 L 592,243 L 588,255 L 586,268 L 586,280 L 588,292 L 592,302 L 596,312
  L 598,320 L 596,328 L 590,334 L 582,338 L 572,340 L 560,340 L 548,338 L 536,334
  L 524,330 L 512,326 L 500,325 L 488,326 L 476,330 L 466,336 L 458,342 L 452,350
  L 446,356 L 438,360 L 428,362 L 416,362 L 404,360 L 392,356 L 382,350 L 374,343
  L 368,335 L 364,326 L 362,316 L 362,306 L 364,296 L 366,286 L 366,276 L 363,268
  L 358,261 L 350,256 L 340,252 L 328,250 L 316,250 L 304,252 L 292,255 L 280,258
  L 268,260 L 256,260 L 244,258 L 232,254 L 222,248 L 214,240 L 207,230 L 202,220
  L 198,210 L 180,195 Z
`;

const nakhchivanPath = `
  M 210,295 L 225,285 L 240,280 L 255,278 L 268,280 L 278,286 L 284,295 L 285,305
  L 282,315 L 275,322 L 264,326 L 252,328 L 240,326 L 228,320 L 220,312 L 213,303
  L 210,295 Z
`;

export default function AzerbaijanMap({ locale, lang }: { locale: string; lang: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeId = active || hovered;
  const activeLoc = locations.find(l => l.id === activeId);

  const ctaLabel =
    lang === "ru" ? "Построить маршрут →" :
    lang === "az" ? "Marşrut yarat →" :
    lang === "tr" ? "Rota oluştur →" :
    "Build itinerary →";

  const sectionTitle =
    lang === "ru" ? "Исследуйте Азербайджан на карте" :
    lang === "az" ? "Xəritədə Azərbaycanı kəşf edin" :
    lang === "tr" ? "Haritada Azerbaycan'ı keşfedin" :
    "Explore Azerbaijan on the map";

  const sectionSub =
    lang === "ru" ? "Нажмите на регион — и ИИ построит для вас персональный маршрут" :
    lang === "az" ? "Regiona klikləyin — AI sizin üçün marşrut quracaq" :
    lang === "tr" ? "Bölgeye tıklayın — AI size özel rota oluştursun" :
    "Click a region — and AI will build your personal itinerary";

  return (
    <section style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "80px 48px 60px" }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 767px) {
          .az-map-section { padding: 40px 20px 40px !important; }
          .az-map-tooltip { position: static !important; width: 100% !important; margin-top: 16px; border-radius: 12px !important; }
        }
      `}</style>

      <div style={{ marginBottom: 48 }}>
        <p style={{ color: T.textMuted, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12, fontFamily: T.font }}>
          ✦ {lang === "ru" ? "Интерактивная карта" : "Interactive map"}
        </p>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: T.text, fontWeight: 800, margin: "0 0 8px" }}>
          {sectionTitle}
        </h2>
        <p style={{ color: T.textMuted, fontSize: 14, margin: 0, fontFamily: T.font }}>
          {sectionSub}
        </p>
      </div>

      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.01)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(0,212,170,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

        <svg
          viewBox="0 0 800 420"
          style={{ width: "100%", display: "block", cursor: "default" }}
          onClick={() => setActive(null)}
        >
          <defs>
            <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softglow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="mapBg" cx="60%" cy="50%" r="60%">
              <stop offset="0%" stopColor="rgba(0,212,170,0.06)" />
              <stop offset="100%" stopColor="rgba(6,9,15,0)" />
            </radialGradient>
          </defs>

          <rect width="800" height="420" fill="#07111e" />
          <rect width="800" height="420" fill="url(#mapgrid)" />
          <rect width="800" height="420" fill="url(#mapBg)" />

          <text x="670" y="240" fill="rgba(0,212,170,0.18)" fontSize="11" fontFamily="'DM Sans', sans-serif" letterSpacing="3" textAnchor="middle">
            {lang === "ru" ? "КАСПИЙСКОЕ МОРЕ" : "CASPIAN SEA"}
          </text>
          {[220, 235, 250, 265, 280].map((y, i) => (
            <line key={i} x1="625" y1={y} x2="710" y2={y} stroke="rgba(0,212,170,0.06)" strokeWidth="1" strokeDasharray="4,6" />
          ))}

          <path d={azerbaijanPath} fill="rgba(0,212,170,0.03)" stroke="rgba(0,212,170,0.08)" strokeWidth="6" filter="url(#softglow)" />
          <path d={azerbaijanPath} fill="rgba(0,80,60,0.15)" stroke="rgba(0,212,170,0.35)" strokeWidth="1.5" />

          <path d={nakhchivanPath} fill="rgba(0,80,60,0.15)" stroke="rgba(0,212,170,0.25)" strokeWidth="1" strokeDasharray="4,3" />
          <text x="247" y="308" fill="rgba(0,212,170,0.3)" fontSize="7" fontFamily="'DM Sans', sans-serif" textAnchor="middle" letterSpacing="1">
            {lang === "ru" ? "НАХИЧЕВАНЬ" : "NAKHCHIVAN"}
          </text>

          <text x="100" y="175" fill="rgba(255,255,255,0.08)" fontSize="9" fontFamily="'DM Sans', sans-serif" letterSpacing="2">GEORGIA</text>
          <text x="100" y="275" fill="rgba(255,255,255,0.08)" fontSize="9" fontFamily="'DM Sans', sans-serif" letterSpacing="2">ARMENIA</text>
          <text x="140" y="345" fill="rgba(255,255,255,0.08)" fontSize="9" fontFamily="'DM Sans', sans-serif" letterSpacing="2">IRAN</text>
          <text x="440" y="95" fill="rgba(255,255,255,0.08)" fontSize="9" fontFamily="'DM Sans', sans-serif" letterSpacing="2">RUSSIA</text>

          {locations.map(loc => {
            const isActive = activeId === loc.id;
            return (
              <g
                key={loc.id}
                onClick={e => { e.stopPropagation(); setActive(active === loc.id ? null : loc.id); }}
                onMouseEnter={() => setHovered(loc.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                {isActive && (
                  <circle cx={loc.x} cy={loc.y} r={18} fill="rgba(0,212,170,0.08)" stroke="rgba(0,212,170,0.3)" strokeWidth="1">
                    <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={loc.x} cy={loc.y} r={isActive ? 10 : 7}
                  fill={isActive ? "rgba(0,212,170,0.15)" : "rgba(0,212,170,0.06)"}
                  stroke={isActive ? "rgba(0,212,170,0.5)" : "rgba(0,212,170,0.2)"}
                  strokeWidth="1"
                  style={{ transition: "all 0.2s ease" }}
                />
                <circle
                  cx={loc.x} cy={loc.y} r={isActive ? 5 : 3.5}
                  fill={isActive ? T.accent : "rgba(0,212,170,0.7)"}
                  filter={isActive ? "url(#glow)" : undefined}
                  style={{ transition: "all 0.2s ease" }}
                />
                <text
                  x={loc.x} y={loc.y - 14}
                  fill={isActive ? T.accent : "rgba(255,255,255,0.55)"}
                  fontSize={isActive ? "9.5" : "8.5"}
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight={isActive ? "700" : "500"}
                  textAnchor="middle"
                  letterSpacing="0.5"
                  style={{ transition: "all 0.2s ease", userSelect: "none" }}
                >
                  {loc.name[lang as keyof typeof loc.name] || loc.name.en}
                </text>
              </g>
            );
          })}
        </svg>

        {activeLoc && (
          <div
            className="az-map-tooltip"
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              width: 240,
              background: "rgba(6,9,15,0.95)",
              border: `1px solid rgba(0,212,170,0.25)`,
              borderRadius: 12,
              padding: "16px 18px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              fontFamily: T.font,
              animation: "fadeInUp 0.2s ease",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1rem", color: T.text, fontWeight: 800, margin: 0 }}>
                {activeLoc.name[lang as keyof typeof activeLoc.name] || activeLoc.name.en}
              </h3>
              <button
                onClick={() => setActive(null)}
                style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 16, padding: 0, marginLeft: 8 }}
              >×</button>
            </div>
            <p style={{ color: T.textMuted, fontSize: 12, margin: "0 0 6px", lineHeight: 1.5 }}>
              {activeLoc.desc[lang as keyof typeof activeLoc.desc] || activeLoc.desc.en}
            </p>
            <p style={{ color: "rgba(0,212,170,0.6)", fontSize: 11, margin: "0 0 14px", fontWeight: 500 }}>
              {activeLoc.days[lang as keyof typeof activeLoc.days] || activeLoc.days.en}
            </p>
            <Link
              href={`/${locale}/planner`}
              style={{
                display: "block", textAlign: "center",
                padding: "9px 16px",
                background: T.accent, color: "#06090f",
                borderRadius: 8, fontSize: 12, fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />
          <span style={{ color: T.textMuted, fontSize: 11, fontFamily: T.font }}>
            {lang === "ru" ? "Нажмите на метку чтобы узнать больше" : "Click a marker to learn more"}
          </span>
        </div>
      </div>
    </section>
  );
}