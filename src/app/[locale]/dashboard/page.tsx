"use client";

import { useEffect, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, MapPin, Calendar, Star, Bell } from "lucide-react";

export default function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading, logout } = useAuth();
  const router = useRouter();
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    // Ждём 3 секунды прежде чем редиректить
    const timer = setTimeout(() => setWaited(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (waited && !loading && !profile) {
      router.push(`/${locale}/auth`);
    }
  }, [waited, loading, profile]);

  if (loading || !profile) {
    return (
      <div style={{ minHeight: "100vh", background: "#021a1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg viewBox="0 0 40 40" style={{ width: 28, height: 28 }} fill="none">
            <path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C30 36 36 28 36 20" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M20 4 L24 14 L20 12 L16 14 Z" fill="#c9a84c"/>
            <circle cx="20" cy="20" r="3" fill="#2dd4bf"/>
          </svg>
        </div>
        <div style={{ color: "#2dd4bf", fontFamily: "DM Sans, sans-serif", fontSize: 15 }}>Loading your dashboard...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}/auth`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#021a1a", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 40 40" style={{ width: 22, height: 22 }} fill="none">
              <path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C30 36 36 28 36 20" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 4 L24 14 L20 12 L16 14 Z" fill="#c9a84c"/>
              <circle cx="20" cy="20" r="3" fill="#2dd4bf"/>
            </svg>
          </div>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 18, fontWeight: 600 }}>Caspian Routes</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Bell size={18} color="rgba(255,255,255,0.5)" style={{ cursor: "pointer" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0a7070", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={16} color="white" />
            </div>
            <span style={{ color: "white", fontSize: 14 }}>{profile.name}</span>
          </div>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
            {profile.role === "client" ? "Tourist Account" : profile.role === "provider" ? "Provider Account" : "Admin Panel"}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, color: "#021a1a", fontWeight: 500 }}>
            Welcome, {profile.name}!
          </h1>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(10,112,112,0.1)", border: "1px solid #0a7070", borderRadius: 999, padding: "6px 16px", marginBottom: 40 }}>
          <Star size={12} color="#0a7070" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0a7070", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {profile.role}
          </span>
        </div>

        {profile.role === "client" && <ClientDashboard locale={locale} />}
        {profile.role === "provider" && <ProviderDashboard locale={locale} />}
        {profile.role === "admin" && <AdminDashboard locale={locale} />}
      </div>
    </div>
  );
}

function ClientDashboard({ locale }: { locale: string }) {
  const cards = [
    { icon: MapPin, title: "Browse Routes", desc: "Explore Azerbaijan tours", color: "#0a7070", href: `/${locale}/routes` },
    { icon: Calendar, title: "My Bookings", desc: "View your reservations", color: "#065050", href: `/${locale}/bookings` },
    { icon: Star, title: "Saved Routes", desc: "Your favourite tours", color: "#c9a84c", href: `/${locale}/saved` },
  ];
  return <DashboardCards cards={cards} />;
}

function ProviderDashboard({ locale }: { locale: string }) {
  const cards = [
    { icon: User, title: "My Profile", desc: "Update your info & prices", color: "#0a7070", href: `/${locale}/provider/profile` },
    { icon: Calendar, title: "Availability", desc: "Set your schedule", color: "#065050", href: `/${locale}/provider/calendar` },
    { icon: Bell, title: "Requests", desc: "Incoming bookings", color: "#c9a84c", href: `/${locale}/provider/requests` },
  ];
  return <DashboardCards cards={cards} />;
}

function AdminDashboard({ locale }: { locale: string }) {
  const cards = [
    { icon: MapPin, title: "Manage Routes", desc: "Add & edit routes", color: "#0a7070", href: `/${locale}/admin/routes` },
    { icon: User, title: "Providers", desc: "Moderate providers", color: "#065050", href: `/${locale}/admin/providers` },
    { icon: Bell, title: "All Bookings", desc: "View all requests", color: "#c9a84c", href: `/${locale}/admin/bookings` },
  ];
  return <DashboardCards cards={cards} />;
}

function DashboardCards({ cards }: { cards: any[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
      {cards.map((card) => (
        <a key={card.title} href={card.href}
          style={{ background: "white", borderRadius: 20, padding: 28, textDecoration: "none", boxShadow: "0 4px 24px rgba(4,46,46,0.08)", display: "block", transition: "all 0.3s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px rgba(4,46,46,0.15)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(4,46,46,0.08)"; }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <card.icon size={22} color={card.color} />
          </div>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 6 }}>{card.title}</h3>
          <p style={{ color: "#94a3a3", fontSize: 14 }}>{card.desc}</p>
        </a>
      ))}
    </div>
  );
}