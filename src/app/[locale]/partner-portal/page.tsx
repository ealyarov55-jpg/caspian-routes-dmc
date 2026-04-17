"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Users, MapPin, Clock, Star, ChevronRight, Lock, Briefcase } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

interface Provider {
  uid: string;
  name: string;
  carModel: string;
  carYear: string;
  pricePerDay: string;
  languages: string[];
  bio: string;
  availableDates: string[];
}

const ROUTES = [
  { id: "baku-city-tour", title: { en: "Baku City Tour", ru: "Тур по Баку", az: "Bakı Şəhər Turu" }, duration: "3 days", netPrice: 800, retailPrice: 1000, tag: "Popular", image: "/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg" },
  { id: "absheron-peninsula", title: { en: "Absheron Peninsula", ru: "Апшеронский полуостров", az: "Abşeron Yarımadası" }, duration: "2 days", netPrice: 350, retailPrice: 450, tag: "New", image: "/images/pexels-dnrgs-33587121-opt.jpg" },
  { id: "sheki-silk-road", title: { en: "Sheki & Silk Road", ru: "Шеки и Шёлковый путь", az: "Şəki və İpək Yolu" }, duration: "4 days", netPrice: 560, retailPrice: 700, image: "/images/pexels-arzu-ibaeva-479643718-16976814-opt.jpg" },
  { id: "caspian-sea-cruise", title: { en: "Caspian Sea Cruise", ru: "Круиз по Каспию", az: "Xəzər Dənizi Kruizi" }, duration: "5 days", netPrice: 960, retailPrice: 1200, tag: "Premium", image: "/images/pexels-zulfugarkarimov-34686330-opt.jpg" },
];

export default function PartnerPortalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [activeTab, setActiveTab] = useState<"routes" | "guides">("routes");

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
  }, [loading, profile]);

  useEffect(() => {
    getDocs(collection(db, "providers")).then(snap => {
      setProviders(snap.docs.map(d => d.data() as Provider));
      setLoadingProviders(false);
    });
  }, []);

  if (loading || !profile) return null;

  // If not partner — show locked screen
  if (profile.role !== "partner" && profile.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
        <Navbar locale={locale} />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 32px rgba(10,112,112,0.3)" }}>
              <Lock size={36} color="#2dd4bf" />
            </div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, color: "#021a1a", marginBottom: 12 }}>
              {tr("Partner Access Only", "Только для партнёров", "Yalnız tərəfdaşlar üçün")}
            </h1>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              {tr(
                "This section is available for verified travel agency partners only. Apply for partnership to get access to net prices and our full catalog.",
                "Этот раздел доступен только для проверенных партнёров-турагентств. Подайте заявку на партнёрство для получения доступа к net-ценам и полному каталогу.",
                "Bu bölmə yalnız yoxlanılmış turizm agentliyi tərəfdaşları üçün mövcuddur. Net qiymətlərə və tam kataloqumuza giriş əldə etmək üçün tərəfdaşlıq üçün müraciət edin."
              )}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={`/${locale}/partners`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #c9a84c, #d4a843)", color: "white", padding: "14px 28px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                <Briefcase size={16} />
                {tr("Apply for Partnership", "Подать заявку", "Tərəfdaşlıq üçün müraciət")}
              </Link>
              <Link href={`/${locale}/dashboard`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", color: "#021a1a", padding: "14px 28px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, border: "1.5px solid #e2eded", fontFamily: "DM Sans, sans-serif" }}>
                {tr("Back to Dashboard", "На панель управления", "İdarə panelinə qayıt")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar locale={locale} />

      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 20px", height: 64, marginTop: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push(`/${locale}/dashboard`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <ArrowLeft size={14} /> {tr("Dashboard", "Панель", "Panel")}
          </button>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>
            {tr("Partner Portal", "Партнёрский портал", "Tərəfdaş portalı")}
          </span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 999, padding: "4px 14px" }}>
          <Briefcase size={12} color="#c9a84c" />
          <span style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {tr("Partner Access", "Партнёрский доступ", "Tərəfdaş girişi")}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>

        {/* Welcome */}
        <div style={{ background: "linear-gradient(135deg, #021a1a 0%, #0a7070 100%)", borderRadius: 20, padding: "28px 32px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(45,212,191,0.06)" }} />
          <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>
            {tr("Welcome to the Partner Portal", "Добро пожаловать в партнёрский портал", "Tərəfdaş portalına xoş gəldiniz")}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 300, marginBottom: 8 }}>
            {profile.name}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
            {tr(
              "Access net prices, available guides and ready-made routes for your clients.",
              "Доступ к net-ценам, доступным гидам и готовым маршрутам для ваших клиентов.",
              "Müştəriləriniz üçün net qiymətlərə, mövcud bələdçilərə və hazır marşrutlara çıxış."
            )}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { key: "routes", label: tr("Routes & Net Prices", "Маршруты и Net-цены", "Marşrutlar və Net qiymətlər"), icon: MapPin },
            { key: "guides", label: tr("Available Guides", "Доступные гиды", "Mövcud bələdçilər"), icon: Users },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "DM Sans, sans-serif", background: activeTab === tab.key ? "#021a1a" : "white", color: activeTab === tab.key ? "white" : "#4a6060", boxShadow: "0 2px 8px rgba(4,46,46,0.06)", transition: "all 0.2s" }}>
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Routes Tab */}
        {activeTab === "routes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {ROUTES.map(route => (
              <div key={route.id} style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(4,46,46,0.08)", display: "flex", flexDirection: "row" }}>
                <div style={{ width: 180, flexShrink: 0, position: "relative" }}>
                  <img src={route.image} alt={route.title[lang as keyof typeof route.title]} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 140 }} />
                  {route.tag && (
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#c9a84c", color: "white", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase" }}>{route.tag}</span>
                  )}
                </div>
                <div style={{ padding: "20px 24px", flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 8 }}>
                      {route.title[lang as keyof typeof route.title]}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock size={13} color="#94a3a3" />
                      <span style={{ fontSize: 13, color: "#4a6060" }}>{route.duration}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ background: "rgba(10,112,112,0.06)", borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
                      <p style={{ color: "#94a3a3", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{tr("Net Price", "Net-цена", "Net qiymət")}</p>
                      <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#0a7070" }}>${route.netPrice}</p>
                    </div>
                    <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
                      <p style={{ color: "#94a3a3", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{tr("Retail Price", "Розничная цена", "Pərakəndə qiymət")}</p>
                      <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#021a1a" }}>${route.retailPrice}</p>
                    </div>
                    <Link href={`/${locale}/contact`}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "12px 20px", borderRadius: 12, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif", whiteSpace: "nowrap" }}>
                      {tr("Request Quote", "Запросить цену", "Qiymət sorğusu")} <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guides Tab */}
        {activeTab === "guides" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {loadingProviders ? (
              <p style={{ color: "#94a3a3" }}>{tr("Loading...", "Загружаем...", "Yüklənir...")}</p>
            ) : providers.length === 0 ? (
              <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", gridColumn: "1/-1", boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <Users size={48} color="#e2eded" style={{ marginBottom: 16 }} />
                <p style={{ color: "#94a3a3", fontSize: 14 }}>{tr("No guides available yet", "Пока нет гидов", "Hələ bələdçi yoxdur")}</p>
              </div>
            ) : (
              providers.map(p => (
                <div key={p.uid} style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 20, flexShrink: 0 }}>
                      {p.name ? p.name[0].toUpperCase() : "?"}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 16 }}>{p.name}</p>
                      <p style={{ color: "#94a3a3", fontSize: 12 }}>{p.carModel} {p.carYear}</p>
                    </div>
                  </div>
                  {p.bio && <p style={{ fontSize: 13, color: "#4a6060", lineHeight: 1.6, marginBottom: 12 }}>{p.bio.slice(0, 100)}...</p>}
                  {p.languages?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                      {p.languages.map(l => (
                        <span key={l} style={{ fontSize: 11, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "3px 10px", borderRadius: 999 }}>{l}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(10,112,112,0.06)", borderRadius: 12, marginBottom: 12 }}>
                    <span style={{ color: "#4a6060", fontSize: 13 }}>{tr("Net price/day", "Net-цена/день", "Net qiymət/gün")}</span>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: "#0a7070" }}>
                      {p.pricePerDay ? `$${p.pricePerDay}` : tr("On request", "По запросу", "Sorğu ilə")}
                    </span>
                  </div>
                  <Link href={`/${locale}/contact`}
                    style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "10px", borderRadius: 12, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                    {tr("Book for Client", "Забронировать для клиента", "Müştəri üçün rezerv et")}
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}