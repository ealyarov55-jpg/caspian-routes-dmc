"use client";

import { useState, use, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Clock, Users, Search, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { getT } from "@/lib/i18n";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";

const ROUTES = [
  { id: "baku-city-tour", title: "Baku City Tour", subtitle: "Baku, Azerbaijan", image: "/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg", duration: "3 days", highlights: ["Flame Towers", "Old City", "Boulevard"], tag: "Popular" },
  { id: "absheron-peninsula", title: "Absheron Peninsula", subtitle: "Fire Temple & Mud Volcanoes", image: "/images/pexels-dnrgs-33587121-opt.jpg", duration: "2 days", highlights: ["Ateshgah", "Mud Volcanoes", "Bibi-Heybat"], tag: "New" },
  { id: "sheki-silk-road", title: "Sheki & Silk Road", subtitle: "Ancient Caravanserais", image: "/images/pexels-arzu-ibaeva-479643718-16976814-opt.jpg", duration: "4 days", highlights: ["Sheki Khan Palace", "Caravanserai", "Silk Market"] },
  { id: "caspian-sea-cruise", title: "Caspian Sea Cruise", subtitle: "Baku Bay & Caspian Coast", image: "/images/pexels-zulfugarkarimov-34686330-opt.jpg", duration: "5 days", highlights: ["Caspian Sea", "Baku Bay", "Coastal Villages"], tag: "Premium" },
  { id: "caucasus-nature", title: "Caucasus Nature Trek", subtitle: "Mountains & Forests", image: "/images/pexels-rahibyaqubov-17050728-opt.jpg", duration: "2 days", highlights: ["Mountain Villages", "Forests", "Waterfalls"], tag: "New" },
];

interface Provider {
  uid: string;
  name: string;
  carModel: string;
  pricePerDay: string;
  languages: string[];
  availableDates: string[];
  approved?: boolean;
}

export default function RoutesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = getT(locale);
  const { profile } = useAuth();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [loadingProviders, setLoadingProviders] = useState(true);

  const isPartnerOrAdmin = profile?.role === "partner" || profile?.role === "admin";

  useEffect(() => {
    getDocs(collection(db, "providers")).then(snap => {
      setProviders(snap.docs.map(d => d.data() as Provider).filter(p => p.approved));
      setLoadingProviders(false);
    });
  }, []);

  const filtered = ROUTES.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date().toISOString().split("T")[0];
  const availableProviders = providers.filter(p => p.availableDates?.some(d => d >= today));

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <style>{`
        .routes-grid { grid-template-columns: minmax(0, 1fr) !important; }
        .route-card-inner { flex-direction: column !important; }
        .route-img { width: 100% !important; height: 200px !important; }
        .route-btn-col { border-left: none !important; border-top: 1px solid #f0f7f7; flex-direction: row !important; justify-content: space-between !important; align-items: center !important; }
        .sidebar { display: none !important; }
        @media (min-width: 768px) {
          .routes-grid { grid-template-columns: 1fr 320px !important; }
          .route-card-inner { flex-direction: row !important; }
          .route-img { width: 200px !important; height: 100% !important; min-height: 140px !important; }
          .route-btn-col { border-left: 1px solid #f0f7f7 !important; border-top: none !important; flex-direction: column !important; justify-content: center !important; }
          .sidebar { display: block !important; }
        }
      `}</style>

      <Navbar locale={locale} />

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #021a1a 0%, #065050 100%)", padding: "120px 24px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 999, padding: "4px 14px", marginBottom: 16 }}>
            <span style={{ color: "#2dd4bf", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em" }}>Azerbaijan DMC</span>
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, marginBottom: 16 }}>
            {tr("Our Routes & Programs", "Наши маршруты и программы", "Marşrutlarımız və proqramlarımız")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 500, marginBottom: 32 }}>
            {tr(
              "B2B programs for tour operators and travel agencies. Net prices available for verified partners.",
              "B2B программы для туроператоров и турагентств. Net-цены доступны для верифицированных партнёров.",
              "Tur operatorları üçün B2B proqramlar. Net qiymətlər yoxlanılmış tərəfdaşlar üçün mövcuddur."
            )}
          </p>
          <div style={{ position: "relative", maxWidth: 480 }}>
            <Search size={18} color="#94a3a3" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={tr("Search routes...", "Поиск маршрутов...", "Marşrut axtar...")}
              style={{ width: "100%", padding: "14px 16px 14px 48px", borderRadius: 14, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: 15, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gap: 32, alignItems: "start" }} className="routes-grid">

          {/* Routes */}
          <div>
            <p style={{ color: "#4a6060", fontSize: 13, marginBottom: 20 }}>
              {filtered.length} {tr("routes found", "маршрутов найдено", "marşrut tapıldı")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filtered.map(route => (
                <div key={route.id} style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(4,46,46,0.08)", border: "1.5px solid transparent", transition: "all 0.3s" }}>
                  <div style={{ display: "flex" }} className="route-card-inner">
                    <div style={{ flexShrink: 0, position: "relative" }} className="route-img">
                      <img src={route.image} alt={route.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {route.tag && (
                        <span style={{ position: "absolute", top: 10, left: 10, background: "#c9a84c", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase" }}>{route.tag}</span>
                      )}
                    </div>
                    <div style={{ padding: "20px 24px", flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#0a7070", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>{route.subtitle}</p>
                      <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 12 }}>{route.title}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                        <Clock size={13} color="#94a3a3" />
                        <span style={{ fontSize: 13, color: "#4a6060" }}>{route.duration}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                        {route.highlights.map(h => (
                          <span key={h} style={{ fontSize: 11, background: "#f0f7f7", color: "#4a6060", padding: "4px 10px", borderRadius: 999 }}>{h}</span>
                        ))}
                      </div>
                      {/* Price tag */}
                      {isPartnerOrAdmin ? (
                        <Link href={`/${locale}/partner-quote?route=${route.id}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(10,112,112,0.08)", border: "1px solid rgba(10,112,112,0.2)", borderRadius: 10, padding: "7px 14px", textDecoration: "none" }}>
                          <span style={{ color: "#0a7070", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>{tr("Request Net Price", "Запросить Net-цену", "Net qiymət sorğusu")}</span>
                          <ArrowRight size={12} color="#0a7070" />
                        </Link>
                      ) : (
                        <Link href={`/${locale}/partners`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "7px 14px", textDecoration: "none" }}>
                          <Lock size={12} color="#c9a84c" />
                          <span style={{ color: "#c9a84c", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>{tr("Net prices for partners", "Net-цены для партнёров", "Tərəfdaşlar üçün net qiymətlər")}</span>
                        </Link>
                      )}
                    </div>
                    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8 }} className="route-btn-col">
                      <Link href={`/${locale}/routes/${route.id}`}
                        style={{ background: "#021a1a", color: "white", padding: "10px 20px", borderRadius: 12, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap", display: "block", textAlign: "center" }}>
                        {tr("View Details", "Подробнее", "Ətraflı")}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar" style={{ position: "sticky", top: 24 }}>

            {/* Partner CTA for non-partners */}
            {!isPartnerOrAdmin && (
              <div style={{ background: "linear-gradient(135deg, #021a1a, #0a7070)", borderRadius: 20, padding: 24, marginBottom: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Lock size={16} color="#2dd4bf" />
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, color: "white", fontWeight: 600 }}>
                    {tr("Partner Access", "Партнёрский доступ", "Tərəfdaş girişi")}
                  </h3>
                </div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                  {tr(
                    "Get access to net prices, available guides and custom itinerary builder.",
                    "Получите доступ к net-ценам, доступным гидам и конструктору маршрутов.",
                    "Net qiymətlərə, bələdçilərə və marşrut qurucusuna giriş əldə edin."
                  )}
                </p>
                <Link href={`/${locale}/partners`}
                  style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #c9a84c, #d4a843)", color: "white", padding: "11px", borderRadius: 12, textDecoration: "none", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                  {tr("Become a Partner", "Стать партнёром", "Tərəfdaş ol")}
                </Link>
              </div>
            )}

            {/* Guides */}
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Users size={18} color="#0a7070" />
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                  {tr("Available Guides", "Доступные гиды", "Mövcud bələdçilər")}
                </h3>
              </div>
              {loadingProviders ? (
                <p style={{ color: "#94a3a3", fontSize: 13 }}>Loading...</p>
              ) : availableProviders.length === 0 ? (
                <p style={{ color: "#94a3a3", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                  {tr("No guides available yet", "Пока нет гидов", "Hələ bələdçi yoxdur")}
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {availableProviders.slice(0, 4).map(p => (
                    <div key={p.uid} style={{ padding: 16, borderRadius: 14, border: "1.5px solid #e2eded" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                          {p.name ? p.name[0].toUpperCase() : "?"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 14 }}>{p.name}</p>
                          <p style={{ color: "#94a3a3", fontSize: 12 }}>{p.carModel || "Guide"}</p>
                        </div>
                        {isPartnerOrAdmin && p.pricePerDay && (
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 700, color: "#0a7070" }}>${p.pricePerDay}</p>
                            <p style={{ fontSize: 10, color: "#94a3a3" }}>{tr("net/day", "net/день", "net/gün")}</p>
                          </div>
                        )}
                      </div>
                      {p.languages?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                          {p.languages.map(l => (
                            <span key={l} style={{ fontSize: 10, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "2px 8px", borderRadius: 999 }}>{l}</span>
                          ))}
                        </div>
                      )}
                      {isPartnerOrAdmin ? (
                        <Link href={`/${locale}/partner-quote`}
                          style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "9px", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                          {tr("Request Quote", "Запросить цену", "Qiymət sorğusu")}
                        </Link>
                      ) : (
                        <Link href={`/${locale}/partners`}
                          style={{ display: "block", textAlign: "center", background: "rgba(201,168,76,0.1)", color: "#c9a84c", padding: "9px", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif", border: "1px solid rgba(201,168,76,0.2)" }}>
                          {tr("Partner access only", "Только для партнёров", "Yalnız tərəfdaşlar üçün")}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}