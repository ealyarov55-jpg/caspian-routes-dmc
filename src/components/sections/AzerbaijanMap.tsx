"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const T = {
  accent: "#00d4aa",
  border: "rgba(255,255,255,0.06)",
  text: "#e8edf5",
  textMuted: "#475569",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
  font: "'DM Sans', system-ui, sans-serif",
};

const locations = [
  { id: "baku",     name: { ru: "Баку",      en: "Baku",     az: "Bakı",    tr: "Bakü"     }, desc: { ru: "Столица и сердце Азербайджана",      en: "Capital of Azerbaijan",            az: "Azərbaycanın paytaxtı",    tr: "Azerbaycan'ın başkenti"     }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, img: "/images/Baku city aerial view.jpeg",                              lat: 40.4093, lng: 49.8671 },
  { id: "gabala",   name: { ru: "Габала",    en: "Gabala",   az: "Qəbələ",  tr: "Gabala"   }, desc: { ru: "Швейцария Азербайджана",              en: "Switzerland of Azerbaijan",        az: "Azərbaycanın İsveçrəsi",   tr: "Azerbaycan'ın İsviçresi"   }, days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" }, img: "/images/gabala azerbaijan nature forest.jpg",                     lat: 40.9918, lng: 47.8450 },
  { id: "sheki",    name: { ru: "Шеки",      en: "Sheki",    az: "Şəki",    tr: "Şeki"     }, desc: { ru: "Древний город Шёлкового пути",        en: "Ancient Silk Road city",           az: "Qədim İpək Yolu şəhəri",  tr: "Antik İpek Yolu şehri"     }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, img: "/images/Sheki palace Azerbaijan.jpg",                             lat: 41.1917, lng: 47.1706 },
  { id: "gobustan", name: { ru: "Гобустан",  en: "Gobustan", az: "Qobustan",tr: "Gobustan" }, desc: { ru: "Петроглифы и грязевые вулканы",      en: "Petroglyphs and mud volcanoes",    az: "Qayaüstü rəsmlər",        tr: "Kaya resimleri"             }, days: { ru: "от 1 дня",  en: "from 1 day",  az: "1 gündən", tr: "1 günden" }, img: "/images/gobustan mud volcanoes petroglyphs.jpg",                  lat: 40.0731, lng: 49.3756 },
  { id: "khinalug", name: { ru: "Хыналыг",  en: "Khinalug", az: "Xınalıq", tr: "Hınalıg"  }, desc: { ru: "Высокогорное древнее село",           en: "Ancient high mountain village",    az: "Dağ kəndi",               tr: "Dağ köyü"                   }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, img: "/images/khinalug village azerbaijan mountains.jpg",               lat: 41.1969, lng: 48.1428 },
  { id: "lahij",    name: { ru: "Лагич",     en: "Lahij",    az: "Lahıc",   tr: "Lahıc"    }, desc: { ru: "Деревня мастеров-ремесленников",     en: "Village of craftsmen",             az: "Sənətkarlar kəndi",       tr: "Zanaatkârlar köyü"          }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, img: "/images/lahij village craftsmen azerbaijan copper.jpg",           lat: 40.8397, lng: 48.8700 },
  { id: "shahdag",  name: { ru: "Шахдаг",    en: "Shahdag",  az: "Şahdağ",  tr: "Şahdağ"   }, desc: { ru: "Главный горный курорт страны",        en: "Top mountain resort",              az: "Ən böyük dağ kurort",     tr: "Başlıca dağ tatil köyü"    }, days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" }, img: "/images/shahdag ski resort azerbaijan winter.jpg",                lat: 41.2700, lng: 48.1600 },
  { id: "guba",     name: { ru: "Губа",      en: "Guba",     az: "Quba",    tr: "Kuba"     }, desc: { ru: "Яблочный край и природа севера",     en: "Apple region and northern nature", az: "Alma diyarı",             tr: "Elma diyarı"                }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, img: "/images/Quba.jpg",                                                lat: 41.3606, lng: 48.5131 },
  { id: "naftalan", name: { ru: "Нафталан",  en: "Naftalan", az: "Naftalan",tr: "Naftalan"  }, desc: { ru: "Уникальный нефтяной курорт",         en: "Unique oil therapy spa resort",    az: "Neft spa kurort",         tr: "Benzersiz petrol spa"       }, days: { ru: "от 3 дней", en: "from 3 days", az: "3 gündən", tr: "3 günden" }, img: "/images/naftalan azerbaijan oil bath spa resort.jpg",             lat: 40.5064, lng: 46.8242 },
  { id: "lankaran", name: { ru: "Ленкорань", en: "Lankaran", az: "Lənkəran",tr: "Lenkoran"  }, desc: { ru: "Субтропики и чайные плантации",      en: "Subtropics and tea plantations",   az: "Subtropik və çay bağları",tr: "Subtropik ve çay bahçeleri" }, days: { ru: "от 2 дней", en: "from 2 days", az: "2 gündən", tr: "2 günden" }, img: "/images/beaches-azerbaijan.jpg",                                  lat: 38.7529, lng: 48.8530 },
]; 

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Window { google: any; initGoogleMap?: () => void; }
}

export default function AzerbaijanMap({ locale, lang }: { locale: string; lang: string }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<typeof locations[0] | null>(null);

  const L = (obj: Record<string, string>) => obj[lang] || obj.en;

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) return;

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.4, lng: 47.5 },
        zoom: 7,
        mapTypeId: "roadmap",
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#07111e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#07111e" }] },
          { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#334155" }] },
          { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
          { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0d1f2d" }] },
          { featureType: "landscape.natural.terrain", elementType: "geometry", stylers: [{ color: "#0a1a28" }] },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e3a4a" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0d2535" }] },
          { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1e4060" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#051525" }] },
          { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#1e6680" }] },
        ],
      });

      locations.forEach(loc => {
        const marker = new window.google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map,
          title: L(loc.name),
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: "#00d4aa",
            fillOpacity: 0.85,
            strokeColor: "#00d4aa",
            strokeWeight: 2,
          },
        });

        marker.addListener("click", () => {
          setActive(prev => prev?.id === loc.id ? null : loc);
        });

        marker.addListener("mouseover", () => {
          marker.setIcon({
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#00d4aa",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          });
        });

        marker.addListener("mouseout", () => {
          marker.setIcon({
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: "#00d4aa",
            fillOpacity: 0.85,
            strokeColor: "#00d4aa",
            strokeWeight: 2,
          });
        });
      });
    };

    if (window.google?.maps) {
      initMap();
      return;
    }

    window.initGoogleMap = initMap;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      window.initGoogleMap = undefined;
    };
  }, [lang]);

  return (
    <section style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "80px 48px 60px" }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:767px){ .az-map-outer{ padding:40px 20px !important; } }
      `}</style>

      <div style={{ marginBottom: 48 }}>
        <p style={{ color: T.textMuted, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>
          ✦ {lang === "ru" ? "Интерактивная карта" : "Interactive map"}
        </p>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: T.text, fontWeight: 800, margin: "0 0 8px" }}>
          {L({ ru: "Исследуйте Азербайджан на карте", en: "Explore Azerbaijan on the map", az: "Xəritədə Azərbaycanı kəşf edin", tr: "Haritada Azerbaycan'ı keşfedin" })}
        </h2>
        <p style={{ color: T.textMuted, fontSize: 14, margin: 0 }}>
          {L({ ru: "Нажмите на метку — и ИИ построит для вас персональный маршрут", en: "Click a marker — AI will build your personal itinerary", az: "Markeri klikləyin — AI marşrut quracaq", tr: "Marker'a tıklayın — AI rota oluştursun" })}
        </p>
      </div>

      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: `1px solid ${T.border}` }}>
        {/* Карта */}
        <div ref={mapRef} style={{ width: "100%", height: "clamp(300px, 60vw, 500px)" }} />

        {/* Тултип */}
        {active && (
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "absolute", bottom: 20, right: 20,
              width: 260,
              background: "rgba(6,9,15,0.97)",
              border: "1px solid rgba(0,212,170,0.25)",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              fontFamily: T.font,
              animation: "fadeInUp 0.2s ease",
            }}
          >
            {/* Фото */}
            <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
              <img
                src={active.img}
                alt={L(active.name)}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,9,15,0.8) 0%, transparent 60%)" }} />
              <button
                onClick={() => setActive(null)}
                style={{
                  position: "absolute", top: 10, right: 10,
                  background: "rgba(0,0,0,0.5)", border: "none",
                  color: "#fff", cursor: "pointer",
                  width: 28, height: 28, borderRadius: "50%",
                  fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >×</button>
            </div>

            {/* Контент */}
            <div style={{ padding: "14px 16px 16px" }}>
              <div style={{ marginBottom: 6 }}>
                <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1.05rem", color: T.text, fontWeight: 800, margin: 0 }}>
                  {L(active.name)}
                </h3>
              </div>
              <p style={{ color: T.textMuted, fontSize: 12, margin: "0 0 14px", lineHeight: 1.5 }}>
                {L(active.desc)}
              </p>
              <Link
                href={`/${locale}/planner`}
                style={{
                  display: "block", textAlign: "center",
                  padding: "10px 16px",
                  background: T.accent, color: "#06090f",
                  borderRadius: 8, fontSize: 12, fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {L({ ru: "Построить маршрут →", en: "Build itinerary →", az: "Marşrut yarat →", tr: "Rota oluştur →" })}
              </Link>
            </div>
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