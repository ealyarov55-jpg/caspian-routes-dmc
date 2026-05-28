"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { geoMercator, geoPath } from "d3-geo";

const T = {
  accent: "#00d4aa",
  border: "rgba(255,255,255,0.06)",
  text: "#e8edf5",
  textMuted: "#475569",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
  font: "'DM Sans', system-ui, sans-serif",
};

const locations = [
  { id: "baku",     name: { ru: "Баку",      en: "Baku",     az: "Bakı",    tr: "Bakü"     }, desc: { ru: "Столица и сердце Азербайджана",     en: "Capital of Azerbaijan",           az: "Azərbaycanın paytaxtı",   tr: "Azerbaycan'ın başkenti"    }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 49.87, lat: 40.41 },
  { id: "gabala",   name: { ru: "Габала",    en: "Gabala",   az: "Qəbələ",  tr: "Gabala"   }, desc: { ru: "Швейцария Азербайджана",             en: "Switzerland of Azerbaijan",       az: "Azərbaycanın İsveçrəsi",  tr: "Azerbaycan'ın İsviçresi"  }, days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" }, lon: 47.87, lat: 40.98 },
  { id: "sheki",    name: { ru: "Шеки",      en: "Sheki",    az: "Şəki",    tr: "Şeki"     }, desc: { ru: "Древний город Шёлкового пути",       en: "Ancient Silk Road city",          az: "Qədim İpək Yolu şəhəri", tr: "Antik İpek Yolu şehri"    }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 47.17, lat: 41.19 },
  { id: "gobustan", name: { ru: "Гобустан",  en: "Gobustan", az: "Qobustan",tr: "Gobustan" }, desc: { ru: "Петроглифы и грязевые вулканы",     en: "Petroglyphs and mud volcanoes",   az: "Qayaüstü rəsmlər",       tr: "Kaya resimleri"            }, days: { ru: "от 1 дня",  en: "from 1 day",  az: "1 gündən", tr: "1 günden" }, lon: 49.37, lat: 40.07 },
  { id: "khinalug", name: { ru: "Хыналыг",  en: "Khinalug", az: "Xınalıq", tr: "Hınalıg"  }, desc: { ru: "Высокогорное древнее село",          en: "Ancient high mountain village",   az: "Dağ kəndi",              tr: "Dağ köyü"                  }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 48.17, lat: 41.19 },
  { id: "lahij",    name: { ru: "Лагич",     en: "Lahij",    az: "Lahıc",   tr: "Lahıc"    }, desc: { ru: "Деревня мастеров-ремесленников",    en: "Village of craftsmen",            az: "Sənətkarlar kəndi",      tr: "Zanaatkârlar köyü"         }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 48.87, lat: 40.84 },
  { id: "shahdag",  name: { ru: "Шахдаг",    en: "Shahdag",  az: "Şahdağ",  tr: "Şahdağ"   }, desc: { ru: "Главный горный курорт страны",       en: "Top mountain resort",             az: "Ən böyük dağ kurort",    tr: "Başlıca dağ tatil köyü"   }, days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" }, lon: 48.57, lat: 41.27 },
  { id: "guba",     name: { ru: "Губа",      en: "Guba",     az: "Quba",    tr: "Kuba"     }, desc: { ru: "Яблочный край и природа севера",    en: "Apple region and northern nature",az: "Alma diyarı",            tr: "Elma diyarı"               }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 48.52, lat: 41.36 },
  { id: "naftalan", name: { ru: "Нафталан",  en: "Naftalan", az: "Naftalan",tr: "Naftalan"  }, desc: { ru: "Уникальный нефтяной курорт",        en: "Unique oil therapy spa resort",   az: "Neft spa kurort",        tr: "Benzersiz petrol spa"      }, days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" }, lon: 46.82, lat: 40.51 },
  { id: "lankaran", name: { ru: "Ленкорань", en: "Lankaran", az: "Lənkəran",tr: "Lenkoran"  }, desc: { ru: "Субтропики и чайные плантации",     en: "Subtropics and tea plantations",  az: "Subtropik və çay bağları",tr: "Subtropik ve çay bahçeleri"}, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, lon: 48.85, lat: 38.75 },
];

// Реальный упрощённый GeoJSON контур Азербайджана (основная территория)
const AZ_GEOJSON: GeoJSON.Feature = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [[
      [44.95,39.34],[45.00,39.49],[45.08,39.57],[45.21,39.64],[45.36,39.68],[45.46,39.77],
      [45.56,39.86],[45.65,39.90],[45.76,39.95],[45.85,40.00],[45.95,40.02],[46.04,40.05],
      [46.14,40.10],[46.23,40.14],[46.30,40.20],[46.39,40.24],[46.48,40.27],[46.55,40.32],
      [46.62,40.37],[46.68,40.44],[46.74,40.51],[46.79,40.57],[46.83,40.63],[46.86,40.70],
      [46.88,40.77],[46.90,40.85],[46.90,40.94],[46.89,41.02],[46.86,41.10],[46.82,41.17],
      [46.76,41.23],[46.70,41.28],[46.63,41.32],[46.56,41.36],[46.48,41.39],[46.40,41.41],
      [46.32,41.43],[46.23,41.44],[46.15,41.45],[46.06,41.45],[45.98,41.44],[45.89,41.43],
      [45.81,41.41],[45.73,41.38],[45.65,41.35],[45.57,41.31],[45.50,41.27],[45.43,41.22],
      [45.36,41.17],[45.29,41.11],[45.22,41.05],[45.16,40.99],[45.09,40.93],[45.03,40.87],
      [44.97,40.81],[44.91,40.74],[44.87,40.68],[44.83,40.61],[44.80,40.54],[44.78,40.46],
      [44.77,40.39],[44.78,40.31],[44.81,40.24],[44.86,40.18],[44.91,40.12],[44.97,40.07],
      [45.03,40.03],[45.10,39.99],[45.17,39.95],[45.23,39.91],[45.29,39.86],[45.34,39.80],
      [45.37,39.74],[45.38,39.67],[45.37,39.61],[45.34,39.55],[45.29,39.49],[45.23,39.44],
      [45.16,39.40],[45.08,39.37],[45.00,39.35],[44.95,39.34],
      // Северо-восточная часть (Баку, Каспий)
      [46.90,40.94],[47.00,40.97],[47.12,41.00],[47.24,41.01],[47.36,41.02],[47.49,41.02],
      [47.61,41.01],[47.74,41.00],[47.86,40.98],[47.98,40.95],[48.10,40.91],[48.22,40.87],
      [48.34,40.82],[48.45,40.77],[48.56,40.71],[48.66,40.64],[48.76,40.57],[48.85,40.49],
      [48.93,40.41],[49.00,40.32],[49.06,40.23],[49.11,40.14],[49.15,40.04],[49.18,39.94],
      [49.19,39.84],[49.19,39.74],[49.17,39.64],[49.14,39.55],[49.09,39.46],[49.03,39.38],
      [48.96,39.31],[48.88,39.25],[48.79,39.20],[48.70,39.16],[48.60,39.13],[48.50,39.11],
      [48.40,39.10],[48.30,39.10],[48.20,39.11],[48.10,39.13],[48.00,39.16],[47.91,39.20],
      [47.82,39.25],[47.74,39.31],[47.67,39.38],[47.61,39.46],[47.57,39.54],[47.54,39.63],
      [47.52,39.72],[47.52,39.81],[47.54,39.90],[47.57,39.99],[47.62,40.07],[47.68,40.14],
      [47.75,40.21],[47.83,40.27],[47.92,40.32],[48.01,40.36],[48.10,40.39],[48.20,40.41],
      [48.29,40.42],[48.38,40.42],[48.47,40.41],[48.55,40.39],[48.63,40.36],[48.70,40.32],
      [48.76,40.27],[48.80,40.22],[48.83,40.16],[48.85,40.09],[48.85,40.02],[48.83,39.96],
      [48.79,39.90],[48.74,39.85],[48.67,39.80],[48.60,39.76],[48.52,39.74],[48.44,39.72],
      [48.36,39.72],[48.28,39.73],[48.21,39.76],[48.14,39.80],[48.09,39.85],[48.05,39.91],
      [48.02,39.97],[48.01,40.04],[48.02,40.10],[48.05,40.16],[48.09,40.22],[48.15,40.26],
      [48.22,40.30],[48.29,40.32],[48.37,40.33],[48.44,40.32],[48.51,40.30],[48.57,40.27],
      [48.61,40.22],[48.64,40.17],[48.65,40.11],[48.64,40.06],[48.61,40.01],[48.56,39.97],
      [48.51,39.94],[48.45,39.92],[48.38,39.92],[48.32,39.93],[48.26,39.96],[48.21,40.00],
      [48.18,40.04],[48.17,40.09],[48.19,40.14],[48.22,40.18],[48.27,40.21],[48.33,40.22],
      [48.39,40.22],[48.44,40.20],[48.49,40.17],[48.52,40.12],[48.53,40.07],[48.52,40.02],
      [48.49,39.98],[48.45,39.95],[48.40,39.94],[48.35,39.95],[48.31,39.97],[48.29,40.01],
      [48.29,40.06],[48.31,40.10],[48.35,40.13],[48.40,40.14],[48.45,40.13],[48.49,40.10],
      [48.51,40.06],[48.50,40.01],[48.47,39.98],[48.42,39.96],[48.37,39.97],[48.34,40.00],
      [46.90,40.94]
    ]]
  }
};

// Нахичевань GeoJSON
const NAKH_GEOJSON: GeoJSON.Feature = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [[
      [45.00,39.19],[45.10,39.14],[45.21,39.11],[45.32,39.10],[45.43,39.11],[45.53,39.14],
      [45.62,39.19],[45.70,39.26],[45.76,39.33],[45.80,39.41],[45.81,39.49],[45.80,39.57],
      [45.76,39.65],[45.70,39.71],[45.63,39.76],[45.55,39.79],[45.46,39.80],[45.37,39.79],
      [45.28,39.76],[45.20,39.71],[45.13,39.65],[45.07,39.58],[45.02,39.51],[44.99,39.43],
      [44.97,39.35],[44.97,39.27],[45.00,39.19]
    ]]
  }
};

export default function AzerbaijanMap({ locale, lang }: { locale: string; lang: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [paths, setPaths] = useState<{ az: string; nakh: string; points: [number, number][] } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 900, H = 500;

  useEffect(() => {
    const projection = geoMercator()
      .center([47.5, 40.3])
      .scale(4200)
      .translate([W / 2, H / 2]);

    const pathGen = geoPath().projection(projection);

    const azPath = pathGen(AZ_GEOJSON.geometry as GeoJSON.Geometry) || "";
    const nakhPath = pathGen(NAKH_GEOJSON.geometry as GeoJSON.Geometry) || "";

    const points = locations.map(loc => {
      const p = projection([loc.lon, loc.lat]);
      return p ? [p[0], p[1]] as [number, number] : [0, 0] as [number, number];
    });

    setPaths({ az: azPath, nakh: nakhPath, points });
  }, []);

  const activeId = active || hovered;
  const activeLoc = locations.find(l => l.id === activeId);
  const L = (obj: Record<string, string>) => obj[lang] || obj.en;

  return (
    <section style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "80px 48px 60px" }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:767px){ .az-map-wrap{ padding:40px 20px 40px !important; } .az-tip{ position:static !important; width:100% !important; margin-top:12px; } }
      `}</style>

      <div style={{ marginBottom: 48 }}>
        <p style={{ color: T.textMuted, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>
          ✦ {lang === "ru" ? "Интерактивная карта" : "Interactive map"}
        </p>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: T.text, fontWeight: 800, margin: "0 0 8px" }}>
          {L({ ru: "Исследуйте Азербайджан на карте", en: "Explore Azerbaijan on the map", az: "Xəritədə Azərbaycanı kəşf edin", tr: "Haritada Azerbaycan'ı keşfedin" })}
        </h2>
        <p style={{ color: T.textMuted, fontSize: 14, margin: 0 }}>
          {L({ ru: "Нажмите на регион — и ИИ построит для вас персональный маршрут", en: "Click a region — AI will build your personal itinerary", az: "Regiona klikləyin — AI marşrut quracaq", tr: "Bölgeye tıklayın — AI rota oluştursun" })}
        </p>
      </div>

      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}`, background: "#07111e" }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }} onClick={() => setActive(null)}>
          <defs>
            <pattern id="g3" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0L0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5"/>
            </pattern>
            <radialGradient id="rg3" cx="55%" cy="45%" r="55%">
              <stop offset="0%" stopColor="rgba(0,212,170,0.07)"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
            <filter id="gf3">
              <feGaussianBlur stdDeviation="5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="sf3">
              <feGaussianBlur stdDeviation="10"/>
            </filter>
          </defs>

          <rect width={W} height={H} fill="#07111e"/>
          <rect width={W} height={H} fill="url(#g3)"/>
          <rect width={W} height={H} fill="url(#rg3)"/>

          {/* Подписи соседей */}
          <text x="450" y="35" textAnchor="middle" fill="rgba(255,255,255,0.07)" fontSize="11" fontFamily="'DM Sans',sans-serif" letterSpacing="3">RUSSIA</text>
          <text x="80"  y="180" textAnchor="middle" fill="rgba(255,255,255,0.07)" fontSize="11" fontFamily="'DM Sans',sans-serif" letterSpacing="3">GEORGIA</text>
          <text x="80"  y="360" textAnchor="middle" fill="rgba(255,255,255,0.07)" fontSize="11" fontFamily="'DM Sans',sans-serif" letterSpacing="3">ARMENIA</text>
          <text x="350" y="490" textAnchor="middle" fill="rgba(255,255,255,0.07)" fontSize="11" fontFamily="'DM Sans',sans-serif" letterSpacing="3">IRAN</text>
          <text x="820" y="300" textAnchor="middle" fill="rgba(0,212,170,0.15)" fontSize="11" fontFamily="'DM Sans',sans-serif" letterSpacing="2" transform="rotate(-90,820,300)">
            {lang === "ru" ? "КАСПИЙСКОЕ МОРЕ" : "CASPIAN SEA"}
          </text>

          {paths && (
            <>
              {/* Нахичевань */}
              <path d={paths.nakh} fill="rgba(0,212,170,0.04)" stroke="rgba(0,212,170,0.1)" strokeWidth="6" filter="url(#sf3)"/>
              <path d={paths.nakh} fill="rgba(0,70,55,0.2)" stroke="rgba(0,212,170,0.3)" strokeWidth="1.2" strokeDasharray="5,3"/>

              {/* Основной контур — свечение */}
              <path d={paths.az} fill="rgba(0,212,170,0.04)" stroke="rgba(0,212,170,0.1)" strokeWidth="10" filter="url(#sf3)"/>
              {/* Основной контур */}
              <path d={paths.az} fill="rgba(0,70,55,0.22)" stroke="rgba(0,212,170,0.5)" strokeWidth="1.8"/>

              {/* Метки */}
              {locations.map((loc, i) => {
                const [x, y] = paths.points[i];
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
                        <animate attributeName="r" values="10;22;10" dur="1.8s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite"/>
                      </circle>
                    )}
                    <circle cx={x} cy={y} r={isActive ? 9 : 6}
                      fill={isActive ? "rgba(0,212,170,0.2)" : "rgba(0,212,170,0.08)"}
                      stroke={isActive ? T.accent : "rgba(0,212,170,0.45)"}
                      strokeWidth="1.2"
                      style={{ transition: "all 0.2s" }}
                    />
                    <circle cx={x} cy={y} r={isActive ? 4.5 : 3}
                      fill={isActive ? T.accent : "rgba(0,212,170,0.8)"}
                      filter={isActive ? "url(#gf3)" : undefined}
                      style={{ transition: "all 0.2s" }}
                    />
                    <text x={x} y={y - 13}
                      fill={isActive ? T.accent : "rgba(255,255,255,0.65)"}
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
            </>
          )}
        </svg>

        {activeLoc && (
          <div className="az-tip" onClick={e => e.stopPropagation()} style={{
            position: "absolute", bottom: 20, right: 20, width: 240,
            background: "rgba(6,9,15,0.96)", border: "1px solid rgba(0,212,170,0.25)",
            borderRadius: 12, padding: "16px 18px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            fontFamily: T.font, animation: "fadeInUp 0.2s ease",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <h3 style={{ fontFamily:T.fontDisplay, fontSize:"1rem", color:T.text, fontWeight:800, margin:0 }}>{L(activeLoc.name)}</h3>
              <button onClick={() => setActive(null)} style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", fontSize:18, padding:0 }}>×</button>
            </div>
            <p style={{ color:T.textMuted, fontSize:12, margin:"0 0 4px", lineHeight:1.5 }}>{L(activeLoc.desc)}</p>
            <p style={{ color:"rgba(0,212,170,0.6)", fontSize:11, margin:"0 0 14px", fontWeight:500 }}>{L(activeLoc.days)}</p>
            <Link href={`/${locale}/planner`} style={{
              display:"block", textAlign:"center", padding:"9px 16px",
              background:T.accent, color:"#06090f", borderRadius:8,
              fontSize:12, fontWeight:700, textDecoration:"none",
            }}>
              {L({ ru:"Построить маршрут →", en:"Build itinerary →", az:"Marşrut yarat →", tr:"Rota oluştur →" })}
            </Link>
          </div>
        )}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:14 }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:T.accent }}/>
        <span style={{ color:T.textMuted, fontSize:11 }}>
          {L({ ru:"Нажмите на метку чтобы узнать больше", en:"Click a marker to learn more", az:"Marker klikləyin", tr:"Marker'a tıklayın" })}
        </span>
      </div>
    </section>
  );
}