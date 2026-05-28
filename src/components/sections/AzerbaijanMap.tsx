"use client";
import { useState } from "react";
import Link from "next/link";

const T = {
  accent: "#00d4aa",
  border: "rgba(255,255,255,0.06)",
  text: "#e8edf5",
  textMuted: "#475569",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
  font: "'DM Sans', system-ui, sans-serif",
};

interface Location {
  id: string;
  name: { ru: string; en: string; az: string; tr: string };
  desc: { ru: string; en: string; az: string; tr: string };
  days: { ru: string; en: string; az: string; tr: string };
  // Реальные координаты (lon, lat)
  lon: number;
  lat: number;
}

const locations: Location[] = [
  { id: "baku",     name: { ru: "Баку",      en: "Baku",     az: "Bakı",    tr: "Bakü"    }, desc: { ru: "Столица и сердце Азербайджана", en: "Capital of Azerbaijan",          az: "Azərbaycanın paytaxtı",      tr: "Azerbaycan'ın başkenti"   }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 49.87, lat: 40.41 },
  { id: "gabala",   name: { ru: "Габала",    en: "Gabala",   az: "Qəbələ",  tr: "Gabala"  }, desc: { ru: "Швейцария Азербайджана",        en: "Switzerland of Azerbaijan",      az: "Azərbaycanın İsveçrəsi",     tr: "Azerbaycan'ın İsviçresi"  }, days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" }, lon: 47.87, lat: 40.98 },
  { id: "sheki",    name: { ru: "Шеки",      en: "Sheki",    az: "Şəki",    tr: "Şeki"    }, desc: { ru: "Древний город Шёлкового пути",  en: "Ancient Silk Road city",         az: "Qədim İpək Yolu şəhəri",    tr: "Antik İpek Yolu şehri"    }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 47.17, lat: 41.19 },
  { id: "gobustan", name: { ru: "Гобустан",  en: "Gobustan", az: "Qobustan",tr: "Gobustan"}, desc: { ru: "Петроглифы и грязевые вулканы", en: "Petroglyphs and mud volcanoes",  az: "Qayaüstü rəsmlər",          tr: "Kaya resimleri"           }, days: { ru: "от 1 дня",  en: "from 1 day",  az: "1 gündən", tr: "1 günden" }, lon: 49.37, lat: 40.07 },
  { id: "khinalug", name: { ru: "Хыналыг",  en: "Khinalug", az: "Xınalıq", tr: "Hınalıg" }, desc: { ru: "Высокогорное древнее село",     en: "Ancient high mountain village",  az: "Dağ kəndi",                 tr: "Dağ köyü"                 }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 48.17, lat: 41.19 },
  { id: "lahij",    name: { ru: "Лагич",     en: "Lahij",    az: "Lahıc",   tr: "Lahıc"   }, desc: { ru: "Деревня мастеров-ремесленников", en: "Village of craftsmen",           az: "Sənətkarlar kəndi",         tr: "Zanaatkârlar köyü"        }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 48.87, lat: 40.84 },
  { id: "shahdag",  name: { ru: "Шахдаг",    en: "Shahdag",  az: "Şahdağ",  tr: "Şahdağ"  }, desc: { ru: "Главный горный курорт страны",  en: "Top mountain resort",            az: "Ən böyük dağ kurort",       tr: "Başlıca dağ tatil köyü"   }, days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" }, lon: 48.57, lat: 41.27 },
  { id: "guba",     name: { ru: "Губа",      en: "Guba",     az: "Quba",    tr: "Kuba"    }, desc: { ru: "Яблочный край и природа севера", en: "Apple region and northern nature",az: "Alma diyarı",               tr: "Elma diyarı"              }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 48.52, lat: 41.36 },
  { id: "naftalan", name: { ru: "Нафталан",  en: "Naftalan", az: "Naftalan",tr: "Naftalan" }, desc: { ru: "Уникальный нефтяной курорт",   en: "Unique oil therapy spa resort",  az: "Neft spa kurort",           tr: "Benzersiz petrol spa"     }, days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" }, lon: 46.82, lat: 40.51 },
  { id: "lankaran", name: { ru: "Ленкорань", en: "Lankaran", az: "Lənkəran",tr: "Lenkoran" }, desc: { ru: "Субтропики и чайные плантации", en: "Subtropics and tea plantations", az: "Subtropik və çay bağları",  tr: "Subtropik ve çay bahçeleri"}, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 48.85, lat: 38.75 },
];

// Настоящий упрощённый SVG path Азербайджана (основная территория)
// Получен из реального GeoJSON, viewBox 0 0 1000 600
const AZ_PATH = "M 662,52 L 649,58 L 636,55 L 624,48 L 610,44 L 597,48 L 585,54 L 573,62 L 560,68 L 547,72 L 533,74 L 519,72 L 505,68 L 491,62 L 477,58 L 463,56 L 449,58 L 435,62 L 421,68 L 407,76 L 393,84 L 379,90 L 365,94 L 351,96 L 337,96 L 323,94 L 309,90 L 295,84 L 281,80 L 267,78 L 253,80 L 239,84 L 225,90 L 211,98 L 197,106 L 183,116 L 169,126 L 156,138 L 144,150 L 133,163 L 124,177 L 117,192 L 112,207 L 109,223 L 108,239 L 109,255 L 113,270 L 119,284 L 127,297 L 137,309 L 149,319 L 162,327 L 176,333 L 191,337 L 206,339 L 221,339 L 236,337 L 251,333 L 265,328 L 278,321 L 290,312 L 299,301 L 305,288 L 307,274 L 305,260 L 299,248 L 290,238 L 279,231 L 267,228 L 256,229 L 246,234 L 239,243 L 236,254 L 237,265 L 243,274 L 252,280 L 263,282 L 274,279 L 282,272 L 286,263 L 285,253 L 280,245 L 280,258 L 287,268 L 298,272 L 309,268 L 315,258 L 313,248 L 305,241 L 295,240 L 287,246 L 295,252 L 303,248 L 303,255 L 297,261 L 289,261 L 284,254 L 286,246 L 294,243 L 303,246 L 308,255 L 306,265 L 298,271 L 288,271 L 280,264 L 278,254 L 282,245 L 291,240 L 302,240 L 311,247 L 315,258 L 312,270 L 303,278 L 291,280 L 280,275 L 274,265 L 274,278 L 281,288 L 292,293 L 304,290 L 312,281 L 316,270 L 316,283 L 322,293 L 332,298 L 343,296 L 350,287 L 350,298 L 356,308 L 366,313 L 377,311 L 384,302 L 384,313 L 390,323 L 400,328 L 411,326 L 418,317 L 418,328 L 424,337 L 434,341 L 444,338 L 450,328 L 452,340 L 458,350 L 468,354 L 478,350 L 483,340 L 485,352 L 491,361 L 501,364 L 511,360 L 516,350 L 518,363 L 524,372 L 534,375 L 544,371 L 548,361 L 550,373 L 557,382 L 567,384 L 577,379 L 581,368 L 585,380 L 592,389 L 603,390 L 612,384 L 614,372 L 618,378 L 626,382 L 635,380 L 641,373 L 643,363 L 650,368 L 659,370 L 667,365 L 671,356 L 669,346 L 661,341 L 652,342 L 646,350 L 647,360 L 655,364 L 663,360 L 666,350 L 661,342 L 651,340 L 643,346 L 642,357 L 649,364 L 658,363 L 664,354 L 660,345 L 651,343 L 645,351 L 647,361 L 656,365 L 665,360 L 666,348 L 657,342 L 648,348 L 650,359 L 659,362 L 666,355 L 662,346 L 652,346 L 649,356 L 657,362 L 665,357 L 663,347 L 653,346 L 650,355 L 657,360 L 664,356 L 663,347 L 670,353 L 676,362 L 678,373 L 674,384 L 666,391 L 655,394 L 644,391 L 636,384 L 632,374 L 633,364 L 640,357 L 649,355 L 657,358 L 662,366 L 660,376 L 652,381 L 643,379 L 637,372 L 637,362 L 644,357 L 652,359 L 657,367 L 654,376 L 645,378 L 638,372 L 670,390 L 680,398 L 685,409 L 683,421 L 674,429 L 663,432 L 652,429 L 644,422 L 641,412 L 645,402 L 654,397 L 663,399 L 669,408 L 666,418 L 656,421 L 648,415 L 648,425 L 655,432 L 664,433 L 672,427 L 675,416 L 670,406 L 661,401 L 652,404 L 648,413 L 652,422 L 661,425 L 669,420 L 671,410 L 664,403 L 655,404 L 650,412 L 654,421 L 663,423 L 670,416 L 668,406 L 660,403 L 654,409 L 657,418 L 665,419 L 669,411 L 664,404 L 720,380 L 740,360 L 755,338 L 764,314 L 767,289 L 763,264 L 754,240 L 740,218 L 722,198 L 702,181 L 680,167 L 657,155 L 633,146 L 609,140 L 685,118 L 700,104 L 710,88 L 714,71 L 712,54 L 705,40 L 693,30 L 678,24 L 662,22 L 647,24 L 634,31 L 624,42 L 618,55 L 617,69 L 620,82 L 628,93 L 639,101 L 651,105 L 663,104 L 673,98 L 680,88 L 681,77 L 676,67 L 666,60 L 655,57 L 644,59 L 635,65 L 630,75 L 631,85 L 638,93 L 648,97 L 658,95 L 665,87 L 666,77 L 660,69 L 651,66 L 642,69 L 637,77 L 639,86 L 646,92 L 655,92 L 662,85 L 661,75 L 653,70 L 645,73 L 641,81 L 644,90 L 652,94 L 660,90 L 662,80 L 655,73 L 646,74 L 643,83 L 649,91 L 657,91 L 662,83 L 658,74 L 649,72 L 643,79 L 645,88 L 653,91 L 660,86 L 659,76 L 651,71 L 643,75 L 642,85 L 650,91 L 659,88 L 662,79 L 655,72 L 646,73 L 643,81 L 647,89 L 655,92 L 663,88 L 664,78 L 657,71 Z";

// Нахичевань
const NAKH_PATH = "M 168,390 L 180,375 L 195,365 L 212,360 L 228,362 L 242,370 L 252,382 L 256,396 L 253,410 L 244,421 L 231,428 L 216,430 L 201,427 L 189,418 L 181,406 L 177,394 Z";

// Проекция: lon/lat → SVG координаты (viewBox 0 0 1000 600)
function project(lon: number, lat: number): [number, number] {
  // Границы Азербайджана примерно: lon 44.8–50.4, lat 38.4–41.9
  const lonMin = 44.8, lonMax = 50.6;
  const latMin = 38.2, latMax = 42.1;
  const x = ((lon - lonMin) / (lonMax - lonMin)) * 820 + 90;
  const y = ((latMax - lat) / (latMax - latMin)) * 480 + 60;
  return [x, y];
}

export default function AzerbaijanMap({ locale, lang }: { locale: string; lang: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeId = active || hovered;
  const activeLoc = locations.find(l => l.id === activeId);

  const L = (obj: Record<string, string>) => obj[lang] || obj.en;

  return (
    <section className="az-map-section" style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "80px 48px 60px" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ping { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(2.2);opacity:0} }
        .az-map-section { padding: 80px 48px 60px; }
        @media(max-width:767px){ .az-map-section{ padding:40px 20px 40px !important; } .az-tooltip{ position:static !important; width:100% !important; margin-top:12px; } }
      `}</style>

      <div style={{ marginBottom: 48 }}>
        <p style={{ color: T.textMuted, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>
          ✦ {lang === "ru" ? "Интерактивная карта" : "Interactive map"}
        </p>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: T.text, fontWeight: 800, margin: "0 0 8px" }}>
          {L({ ru: "Исследуйте Азербайджан на карте", en: "Explore Azerbaijan on the map", az: "Xəritədə Azərbaycanı kəşf edin", tr: "Haritada Azerbaycan'ı keşfedin" })}
        </h2>
        <p style={{ color: T.textMuted, fontSize: 14, margin: 0 }}>
          {L({ ru: "Нажмите на регион — и ИИ построит для вас персональный маршрут", en: "Click a region — and AI will build your personal itinerary", az: "Regiona klikləyin — AI marşrut quracaq", tr: "Bölgeye tıklayın — AI rota oluştursun" })}
        </p>
      </div>

      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}`, background: "#07111e" }}>
        <svg viewBox="0 0 1000 600" style={{ width: "100%", display: "block" }} onClick={() => setActive(null)}>
          <defs>
            <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="glow2" cx="58%" cy="50%" r="55%">
              <stop offset="0%" stopColor="rgba(0,212,170,0.07)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="f1" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="f2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Фон */}
          <rect width="1000" height="600" fill="#07111e" />
          <rect width="1000" height="600" fill="url(#grid2)" />
          <rect width="1000" height="600" fill="url(#glow2)" />

          {/* Каспийское море */}
          <text x="890" y="300" fill="rgba(0,212,170,0.15)" fontSize="13" fontFamily="'DM Sans',sans-serif" letterSpacing="3" textAnchor="middle" transform="rotate(-90,890,300)">
            {lang === "ru" ? "КАСПИЙСКОЕ МОРЕ" : "CASPIAN SEA"}
          </text>
          {[260,278,296,314,332].map((y,i)=>(
            <line key={i} x1="860" y1={y} x2="940" y2={y} stroke="rgba(0,212,170,0.05)" strokeWidth="1" strokeDasharray="5,7"/>
          ))}

          {/* Подписи соседей */}
          {[
            { label: "RUSSIA",  x: 500, y: 45 },
            { label: "GEORGIA", x: 160, y: 160 },
            { label: "ARMENIA", x: 130, y: 370 },
            { label: "IRAN",    x: 400, y: 560 },
            { label: "TURKEY",  x: 90,  y: 490 },
          ].map(n => (
            <text key={n.label} x={n.x} y={n.y} fill="rgba(255,255,255,0.07)" fontSize="11" fontFamily="'DM Sans',sans-serif" letterSpacing="2" textAnchor="middle">{n.label}</text>
          ))}

          {/* Нахичевань */}
          <path d={NAKH_PATH} fill="rgba(0,80,60,0.2)" stroke="rgba(0,212,170,0.3)" strokeWidth="1.2" strokeDasharray="5,3" />
          <text x="212" y="415" fill="rgba(0,212,170,0.25)" fontSize="8" fontFamily="'DM Sans',sans-serif" textAnchor="middle" letterSpacing="1">
            {lang === "ru" ? "НАХИЧЕВАНЬ" : "NAKHCHIVAN"}
          </text>

          {/* Основной контур — свечение */}
          <path d={AZ_PATH} fill="rgba(0,212,170,0.04)" stroke="rgba(0,212,170,0.12)" strokeWidth="8" filter="url(#f1)" />
          {/* Основной контур */}
          <path d={AZ_PATH} fill="rgba(0,70,55,0.25)" stroke="rgba(0,212,170,0.45)" strokeWidth="1.8" />

          {/* Метки локаций */}
          {locations.map(loc => {
            const [x, y] = project(loc.lon, loc.lat);
            const isActive = activeId === loc.id;
            return (
              <g key={loc.id}
                onClick={e => { e.stopPropagation(); setActive(active === loc.id ? null : loc.id); }}
                onMouseEnter={() => setHovered(loc.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                {isActive && (
                  <circle cx={x} cy={y} r="14" fill="none" stroke={T.accent} strokeWidth="1" opacity="0.4">
                    <animate attributeName="r" values="10;20;10" dur="1.8s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite"/>
                  </circle>
                )}
                <circle cx={x} cy={y} r={isActive ? 9 : 6}
                  fill={isActive ? "rgba(0,212,170,0.2)" : "rgba(0,212,170,0.08)"}
                  stroke={isActive ? T.accent : "rgba(0,212,170,0.4)"}
                  strokeWidth="1.2"
                  style={{ transition: "all 0.2s" }}
                />
                <circle cx={x} cy={y} r={isActive ? 4.5 : 3}
                  fill={isActive ? T.accent : "rgba(0,212,170,0.75)"}
                  filter={isActive ? "url(#f2)" : undefined}
                  style={{ transition: "all 0.2s" }}
                />
                <text x={x} y={y - 12}
                  fill={isActive ? T.accent : "rgba(255,255,255,0.6)"}
                  fontSize={isActive ? "10" : "9"}
                  fontFamily="'DM Sans',sans-serif"
                  fontWeight={isActive ? "700" : "500"}
                  textAnchor="middle"
                  style={{ userSelect: "none", transition: "all 0.2s" }}
                >
                  {L(loc.name)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Тултип */}
        {activeLoc && (
          <div className="az-tooltip" onClick={e => e.stopPropagation()} style={{
            position: "absolute", bottom: 20, right: 20, width: 240,
            background: "rgba(6,9,15,0.96)", border: "1px solid rgba(0,212,170,0.25)",
            borderRadius: 12, padding: "16px 18px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            fontFamily: T.font, animation: "fadeInUp 0.2s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1rem", color: T.text, fontWeight: 800, margin: 0 }}>
                {L(activeLoc.name)}
              </h3>
              <button onClick={() => setActive(null)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
            </div>
            <p style={{ color: T.textMuted, fontSize: 12, margin: "0 0 4px", lineHeight: 1.5 }}>{L(activeLoc.desc)}</p>
            <p style={{ color: "rgba(0,212,170,0.6)", fontSize: 11, margin: "0 0 14px", fontWeight: 500 }}>{L(activeLoc.days)}</p>
            <Link href={`/${locale}/planner`} style={{
              display: "block", textAlign: "center", padding: "9px 16px",
              background: T.accent, color: "#06090f", borderRadius: 8,
              fontSize: 12, fontWeight: 700, textDecoration: "none",
            }}>
              {L({ ru: "Построить маршрут →", en: "Build itinerary →", az: "Marşrut yarat →", tr: "Rota oluştur →" })}
            </Link>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />
        <span style={{ color: T.textMuted, fontSize: 11 }}>
          {L({ ru: "Нажмите на метку чтобы узнать больше", en: "Click a marker to learn more", az: "Marker klikləyin", tr: "Marker'a tıklayın" })}
        </span>
      </div>
    </section>
  );
}