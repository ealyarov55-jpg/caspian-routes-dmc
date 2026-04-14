"use client";

import { useState, use, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Clock, Star, Users, Search } from "lucide-react";
import Link from "next/link";
import { getT } from "@/lib/i18n";

const ROUTES = [
  { id: "baku-city-tour", title: "Baku City Tour", subtitle: "Baku, Azerbaijan", image: "/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg", duration: "3 days", difficulty: "Easy", highlights: ["Flame Towers", "Old City", "Boulevard"], tag: "Popular" },
  { id: "absheron-peninsula", title: "Absheron Peninsula", subtitle: "Fire Temple & Mud Volcanoes", image: "/images/pexels-dnrgs-33587121-opt.jpg", duration: "2 days", difficulty: "Easy", highlights: ["Ateshgah", "Mud Volcanoes", "Bibi-Heybat"], tag: "New" },
  { id: "sheki-silk-road", title: "Sheki & Silk Road", subtitle: "Ancient Caravanserais", image: "/images/pexels-arzu-ibaeva-479643718-16976814-opt.jpg", duration: "4 days", difficulty: "Moderate", highlights: ["Sheki Khan Palace", "Caravanserai", "Silk Market"] },
  { id: "caspian-sea-cruise", title: "Caspian Sea Cruise", subtitle: "Baku Bay & Caspian Coast", image: "/images/pexels-zulfugarkarimov-34686330-opt.jpg", duration: "5 days", difficulty: "Easy", highlights: ["Caspian Sea", "Baku Bay", "Coastal Villages"], tag: "Premium" },
];

interface Provider {
  uid: string;
  name: string;
  carModel: string;
  pricePerDay: string;
  languages: string[];
  availableDates: string[];
}

export default function RoutesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = getT(locale);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "providers")).then(snap => {
      setProviders(snap.docs.map(d => d.data() as Provider));
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
          .routes-grid { grid-template-columns: 1fr 340px !important; }
          .route-card-inner { flex-direction: row !important; }
          .route-img { width: 200px !important; height: 100% !important; min-height: 140px !important; }
          .route-btn-col { border-left: 1px solid #f0f7f7 !important; border-top: none !important; flex-direction: column !important; justify-content: center !important; }
          .sidebar { display: block !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #021a1a 0%, #065050 100%)", padding: "80px 24px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>Azerbaijan</p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, marginBottom: 16 }}>
            {locale === "ru" ? "Наши маршруты" : locale === "az" ? "Marşrutlarımız" : "Explore Our Routes"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 500, marginBottom: 32 }}>
            {locale === "ru" ? "Выберите маршрут и свяжитесь с местными гидами" : locale === "az" ? "Marşrut seçin və yerli bələdçilərlə əlaqə saxlayın" : "Choose your journey and connect with local drivers & guides"}
          </p>
          <div style={{ position: "relative", maxWidth: 480 }}>
            <Search size={18} color="#94a3a3" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={locale === "ru" ? "Поиск маршрутов..." : locale === "az" ? "Marşrut axtar..." : "Search routes..."}
              style={{ width: "100%", padding: "14px 16px 14px 48px", borderRadius: 14, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: 15, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gap: 32, alignItems: "start" }} className="routes-grid">

          {/* Routes */}
          <div>
            <p style={{ color: "#4a6060", fontSize: 13, marginBottom: 20 }}>
              {filtered.length} {locale === "ru" ? "маршрутов найдено" : locale === "az" ? "marşrut tapıldı" : "routes found"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filtered.map(route => (
                <div key={route.id}
                  onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                  style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: selectedRoute === route.id ? "0 8px 32px rgba(10,112,112,0.2)" : "0 4px 24px rgba(4,46,46,0.08)", cursor: "pointer", border: selectedRoute === route.id ? "2px solid #0a7070" : "2px solid transparent", transition: "all 0.3s" }}>
                  <div style={{ display: "flex" }} className="route-card-inner">
                    <div style={{ flexShrink: 0, position: "relative" }} className="route-img">
                      <img src={route.image} alt={route.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {route.tag && (
                        <span style={{ position: "absolute", top: 10, left: 10, background: "#c9a84c", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em" }}>{route.tag}</span>
                      )}
                    </div>
                    <div style={{ padding: "20px 24px", flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#0a7070", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>{route.subtitle}</p>
                      <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 12 }}>{route.title}</h3>
                      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Clock size={13} color="#94a3a3" />
                          <span style={{ fontSize: 13, color: "#4a6060" }}>{route.duration}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Star size={13} color="#94a3a3" />
                          <span style={{ fontSize: 13, color: "#4a6060" }}>{route.difficulty}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {route.highlights.map(h => (
                          <span key={h} style={{ fontSize: 11, background: "#f0f7f7", color: "#4a6060", padding: "4px 10px", borderRadius: 999 }}>{h}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} className="route-btn-col">
                      <Link href={`/${locale}/routes/${route.id}`}
                        onClick={e => e.stopPropagation()}
                        style={{ background: "#021a1a", color: "white", padding: "10px 20px", borderRadius: 12, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap", display: "block", textAlign: "center", marginBottom: 8 }}>
                        {locale === "ru" ? "Подробнее" : locale === "az" ? "Ətraflı" : "View Details"}
                      </Link>
                      <span style={{ fontSize: 11, color: "#94a3a3", whiteSpace: "nowrap" }}>
                        {availableProviders.length} {locale === "ru" ? "гидов" : locale === "az" ? "bələdçi" : "guides"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar" style={{ position: "sticky", top: 24 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Users size={18} color="#0a7070" />
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                  {locale === "ru" ? "Доступные гиды" : locale === "az" ? "Mövcud bələdçilər" : "Available Guides"}
                </h3>
              </div>
              {loadingProviders ? (
                <p style={{ color: "#94a3a3", fontSize: 13 }}>Loading...</p>
              ) : availableProviders.length === 0 ? (
                <p style={{ color: "#94a3a3", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                  {locale === "ru" ? "Пока нет гидов" : locale === "az" ? "Hələ bələdçi yoxdur" : "No guides available yet"}
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {availableProviders.map(p => (
                    <div key={p.uid} style={{ padding: 16, borderRadius: 14, border: "1.5px solid #e2eded" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                          {p.name ? p.name[0].toUpperCase() : "?"}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 14 }}>{p.name}</p>
                          <p style={{ color: "#94a3a3", fontSize: 12 }}>{p.carModel || "Guide"}</p>
                        </div>
                        {p.pricePerDay && (
                          <div style={{ marginLeft: "auto", textAlign: "right" }}>
                            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 700, color: "#021a1a" }}>${p.pricePerDay}</p>
                            <p style={{ fontSize: 10, color: "#94a3a3" }}>{locale === "ru" ? "в день" : locale === "az" ? "gündə" : "per day"}</p>
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
                      <Link href={`/${locale}/book/${p.uid}`}
                        style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "9px", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                        {locale === "ru" ? "Забронировать" : locale === "az" ? "Rezerv et" : "Book Now"}
                      </Link>
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