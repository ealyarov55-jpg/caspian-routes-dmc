"use client";

import { useEffect, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, MapPin, Calendar, Star, Bell, ChevronRight, Settings, Users, BarChart3, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading, logout } = useAuth();
  const router = useRouter();
  const [waited, setWaited] = useState(false);
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  useEffect(() => {
    const timer = setTimeout(() => setWaited(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (waited && !loading && !profile) router.push(`/${locale}/auth`);
  }, [waited, loading, profile]);

  if (loading || !profile) return (
    <div style={{ minHeight: "100vh", background: "#021a1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(10,112,112,0.4)" }}>
        <svg viewBox="0 0 40 40" style={{ width: 32, height: 32 }} fill="none">
          <path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C30 36 36 28 36 20" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M20 4 L24 14 L20 12 L16 14 Z" fill="#c9a84c"/>
          <circle cx="20" cy="20" r="3" fill="#2dd4bf"/>
        </svg>
      </div>
      <p style={{ color: "#2dd4bf", fontFamily: "DM Sans, sans-serif", fontSize: 15 }}>
        {tr("Loading your dashboard...", "Загружаем панель...", "Hesab yüklənir...")}
      </p>
    </div>
  );

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}/auth`);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return tr("Good morning", "Доброе утро", "Sabahınız xeyir");
    if (h < 18) return tr("Good afternoon", "Добрый день", "Günortanız xeyir");
    return tr("Good evening", "Добрый вечер", "Axşamınız xeyir");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <style>{`
        .dash-topbar { padding: 0 20px !important; }
        .dash-name { display: none !important; }
        @media (min-width: 768px) {
          .dash-topbar { padding: 0 32px !important; }
          .dash-name { display: block !important; }
        }
      `}</style>

      {/* Topbar */}
      <div style={{ background: "#021a1a", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40, boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }} className="dash-topbar">
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 40 40" style={{ width: 22, height: 22 }} fill="none">
              <path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C30 36 36 28 36 20" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 4 L24 14 L20 12 L16 14 Z" fill="#c9a84c"/>
              <circle cx="20" cy="20" r="3" fill="#2dd4bf"/>
            </svg>
          </div>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 18, fontWeight: 600 }}>Caspian Routes</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #0a7070, #2dd4bf)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>{profile.name ? profile.name[0].toUpperCase() : "?"}</span>
            </div>
            <span style={{ color: "white", fontSize: 14, fontWeight: 500 }} className="dash-name">{profile.name}</span>
          </div>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <LogOut size={13} /> {tr("Logout", "Выйти", "Çıxış")}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px" }}>

        {/* Hero greeting */}
        <div style={{ background: "linear-gradient(135deg, #021a1a 0%, #0a7070 100%)", borderRadius: 24, padding: "32px 36px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(45,212,191,0.06)" }} />
          <div style={{ position: "absolute", right: 40, bottom: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(45,212,191,0.04)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>
              {profile.role === "client" ? tr("Tourist Account", "Аккаунт туриста", "Turist hesabı") :
               profile.role === "provider" ? tr("Provider Account", "Аккаунт гида", "Bələdçi hesabı") :
               tr("Admin Panel", "Панель администратора", "Admin paneli")}
            </p>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 300, marginBottom: 8 }}>
              {greeting()}, <span style={{ fontWeight: 600 }}>{profile.name}</span>!
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
              {profile.role === "client"
                ? tr("Ready to explore Azerbaijan?", "Готовы открыть Азербайджан?", "Azərbaycanı kəşf etməyə hazırsınız?")
                : profile.role === "provider"
                ? tr("Manage your tours and bookings", "Управляйте турами и бронированиями", "Turlarınızı və rezervasiyaları idarə edin")
                : tr("Manage the platform", "Управляйте платформой", "Platformanı idarə edin")}
            </p>
          </div>
        </div>

        {/* Role badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(10,112,112,0.1)", border: "1px solid rgba(10,112,112,0.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 28 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0a7070" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#0a7070", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            {profile.role}
          </span>
        </div>

        {profile.role === "client" && <ClientDashboard locale={locale} tr={tr} />}
        {profile.role === "provider" && <ProviderDashboard locale={locale} tr={tr} />}
        {profile.role === "admin" && <AdminDashboard locale={locale} tr={tr} />}
      </div>
    </div>
  );
}

function ClientDashboard({ locale, tr }: { locale: string; tr: Function }) {
  const quickLinks = [
    {
      icon: MapPin,
      title: tr("Browse Routes", "Смотреть маршруты", "Marşrutlara bax"),
      desc: tr("Discover Azerbaijan tours", "Откройте туры по Азербайджану", "Azərbaycan turlarını kəşf edin"),
      href: `/${locale}/routes`,
      color: "#0a7070",
      bg: "rgba(10,112,112,0.08)",
    },
    {
      icon: Calendar,
      title: tr("My Bookings", "Мои бронирования", "Rezervasiyalarım"),
      desc: tr("View your reservations", "Просмотр бронирований", "Rezervasiyalarınıza baxın"),
      href: `/${locale}/bookings`,
      color: "#065050",
      bg: "rgba(6,80,80,0.08)",
    },
    {
      icon: Star,
      title: tr("Saved Routes", "Сохранённые маршруты", "Saxlanılmış marşrutlar"),
      desc: tr("Your favourite tours", "Ваши избранные туры", "Sevimli turlarınız"),
      href: `/${locale}/routes`,
      color: "#c9a84c",
      bg: "rgba(201,168,76,0.08)",
    },
  ];

  const tips = [
    tr("Choose a route and find a local guide", "Выберите маршрут и найдите местного гида", "Marşrut seçin və yerli bələdçi tapın"),
    tr("Book directly — no middlemen", "Бронируйте напрямую — без посредников", "Birbaşa rezerv edin — vasitəçisiz"),
    tr("Pay your guide on the day of the tour", "Оплатите гиду в день тура", "Tur günü bələdçiyə ödəyin"),
  ];

  return (
    <div>
      {/* Quick Links */}
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16, fontWeight: 500 }}>
        {tr("Quick Actions", "Быстрые действия", "Sürətli əməliyyatlar")}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
        {quickLinks.map(card => (
          <Link key={card.title} href={card.href}
            style={{ background: "white", borderRadius: 20, padding: 24, textDecoration: "none", boxShadow: "0 4px 24px rgba(4,46,46,0.06)", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s", border: "1.5px solid transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = card.color; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "transparent"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <card.icon size={24} color={card.color} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600, marginBottom: 4 }}>{card.title}</h3>
              <p style={{ color: "#94a3a3", fontSize: 13 }}>{card.desc}</p>
            </div>
            <ChevronRight size={16} color="#e2eded" />
          </Link>
        ))}
      </div>

      {/* How it works */}
      <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.06)" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", marginBottom: 20, fontWeight: 500 }}>
          {tr("How to get started", "Как начать", "Necə başlamaq olar")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tips.map((tip, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
              </div>
              <p style={{ color: "#4a6060", fontSize: 14 }}>{tip}</p>
            </div>
          ))}
        </div>
        <Link href={`/${locale}/routes`}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
          {tr("Start Exploring", "Начать исследование", "Kəşfə başla")} <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

function ProviderDashboard({ locale, tr }: { locale: string; tr: Function }) {
  const cards = [
    {
      icon: User,
      title: tr("My Profile", "Мой профиль", "Profilim"),
      desc: tr("Update your info & prices", "Обновите данные и цены", "Məlumat və qiymətləri yeniləyin"),
      href: `/${locale}/provider/profile`,
      color: "#0a7070",
      bg: "rgba(10,112,112,0.08)",
    },
    {
      icon: Calendar,
      title: tr("Availability", "Доступность", "Mövcudluq"),
      desc: tr("Set your schedule", "Настройте расписание", "Cədvəlinizi təyin edin"),
      href: `/${locale}/provider/calendar`,
      color: "#065050",
      bg: "rgba(6,80,80,0.08)",
    },
    {
      icon: Bell,
      title: tr("Requests", "Заявки", "Sorğular"),
      desc: tr("Incoming bookings", "Входящие бронирования", "Daxil olan rezervasiyalar"),
      href: `/${locale}/provider/requests`,
      color: "#c9a84c",
      bg: "rgba(201,168,76,0.08)",
    },
  ];

  const tips = [
    tr("Complete your profile to attract more tourists", "Заполните профиль для привлечения туристов", "Daha çox turist cəlb etmək üçün profilinizi tamamlayın"),
    tr("Add available dates to your calendar", "Добавьте доступные даты в календарь", "Təqviminizə mövcud tarixlər əlavə edin"),
    tr("Respond to booking requests quickly", "Быстро отвечайте на заявки о бронировании", "Rezervasiya sorğularına tez cavab verin"),
  ];

  return (
    <div>
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16, fontWeight: 500 }}>
        {tr("Quick Actions", "Быстрые действия", "Sürətli əməliyyatlar")}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map(card => (
          <Link key={card.title} href={card.href}
            style={{ background: "white", borderRadius: 20, padding: 24, textDecoration: "none", boxShadow: "0 4px 24px rgba(4,46,46,0.06)", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s", border: "1.5px solid transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = card.color; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "transparent"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <card.icon size={24} color={card.color} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600, marginBottom: 4 }}>{card.title}</h3>
              <p style={{ color: "#94a3a3", fontSize: 13 }}>{card.desc}</p>
            </div>
            <ChevronRight size={16} color="#e2eded" />
          </Link>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.06)" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", marginBottom: 20, fontWeight: 500 }}>
          {tr("Tips for success", "Советы для успеха", "Uğur üçün məsləhətlər")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tips.map((tip, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
              </div>
              <p style={{ color: "#4a6060", fontSize: 14 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ locale, tr }: { locale: string; tr: Function }) {
  const cards = [
    {
      icon: MapPin,
      title: tr("Manage Routes", "Маршруты", "Marşrutlar"),
      desc: tr("Add & edit routes", "Добавить и редактировать", "Marşrut əlavə et"),
      href: `/${locale}/admin`,
      color: "#0a7070",
      bg: "rgba(10,112,112,0.08)",
    },
    {
      icon: Users,
      title: tr("Providers", "Провайдеры", "Provayderlar"),
      desc: tr("Moderate providers", "Модерация провайдеров", "Provayderləri idarə et"),
      href: `/${locale}/admin`,
      color: "#065050",
      bg: "rgba(6,80,80,0.08)",
    },
    {
      icon: BarChart3,
      title: tr("All Bookings", "Все бронирования", "Bütün rezervasiyalar"),
      desc: tr("View all requests", "Просмотр всех заявок", "Bütün sorğulara bax"),
      href: `/${locale}/admin`,
      color: "#c9a84c",
      bg: "rgba(201,168,76,0.08)",
    },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16, fontWeight: 500 }}>
        {tr("Admin Controls", "Управление", "İdarəetmə")}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {cards.map(card => (
          <Link key={card.title} href={card.href}
            style={{ background: "white", borderRadius: 20, padding: 24, textDecoration: "none", boxShadow: "0 4px 24px rgba(4,46,46,0.06)", display: "flex", alignItems: "center", gap: 16, transition: "all 0.2s", border: "1.5px solid transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = card.color; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "transparent"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <card.icon size={24} color={card.color} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600, marginBottom: 4 }}>{card.title}</h3>
              <p style={{ color: "#94a3a3", fontSize: 13 }}>{card.desc}</p>
            </div>
            <ChevronRight size={16} color="#e2eded" />
          </Link>
        ))}
      </div>
    </div>
  );
}