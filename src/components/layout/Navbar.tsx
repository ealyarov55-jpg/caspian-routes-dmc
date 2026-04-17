"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Briefcase } from "lucide-react";
import { getT } from "@/lib/i18n";
import { useAuth } from "@/context/AuthContext";

const localesList = [
  { code: "en", label: "EN", full: "English", flag: "🇬🇧" },
  { code: "ru", label: "RU", full: "Русский", flag: "🇷🇺" },
  { code: "az", label: "AZ", full: "Azərbaycan", flag: "🇦🇿" },
];

export default function Navbar({ locale }: { locale: string }) {
  const t = getT(locale);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setLangOpen(false);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push(`/${locale}`);
    setUserOpen(false);
    setMobileOpen(false);
  };

  const navLinks = [
    { label: t.nav.routes, href: `/${locale}/routes` },
    { label: t.nav.about, href: `/${locale}/about` },
    { label: t.nav.contact, href: `/${locale}/contact` },
  ];

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-mobile-btn { display: none; }
        .nav-mobile-lang { display: none; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .nav-mobile-lang { display: flex !important; }
        }
      `}</style>

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        transition: "all 0.5s ease",
        background: scrolled || mobileOpen ? "rgba(2,26,26,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.2)" : "none",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* Logo */}
          <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 40 40" style={{ width: 22, height: 22 }} fill="none">
                <path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C30 36 36 28 36 20" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M20 4 L24 14 L20 12 L16 14 Z" fill="#c9a84c"/>
                <circle cx="20" cy="20" r="3" fill="#2dd4bf"/>
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontWeight: 600, fontSize: 17 }}>Caspian</span>
              <span style={{ color: "#2dd4bf", fontSize: 8, fontFamily: "DM Sans, sans-serif", textTransform: "uppercase", letterSpacing: "0.2em" }}>Travel Routes DMC</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-desktop" style={{ alignItems: "center", gap: 28 }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="nav-desktop" style={{ alignItems: "center", gap: 10 }}>

            {/* Lang switcher */}
            <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
              <button onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "white", fontFamily: "DM Sans, sans-serif", fontSize: 13 }}>
                <span>{localesList.find(l => l.code === locale)?.flag || "🇬🇧"}</span>
                {locale?.toUpperCase() || "EN"}
                <ChevronDown size={12} color="rgba(255,255,255,0.6)" />
              </button>
              {langOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#042e2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", minWidth: 140, boxShadow: "0 16px 40px rgba(0,0,0,0.3)", zIndex: 100 }}>
                  {localesList.map((loc) => (
                    <button key={loc.code} onClick={() => switchLocale(loc.code)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 16px", background: loc.code === locale ? "rgba(45,212,191,0.1)" : "transparent", border: "none", cursor: "pointer", color: loc.code === locale ? "#2dd4bf" : "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif", fontSize: 13 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{loc.flag}</span>
                        <span>{loc.full}</span>
                      </span>
                      <span style={{ fontSize: 11, opacity: 0.6 }}>{loc.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />

            {/* For Partners button */}
            <Link href={`/${locale}/partners`}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 16px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", color: "#c9a84c", borderRadius: 10, textDecoration: "none", fontFamily: "DM Sans, sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}>
              <Briefcase size={13} />
              {tr("For Partners", "Для партнёров", "Tərəfdaşlar üçün")}
            </Link>

            {/* Auth section */}
            {profile ? (
              <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                <button onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #0a7070, #2dd4bf)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{profile.name ? profile.name[0].toUpperCase() : "?"}</span>
                  </div>
                  <span style={{ color: "white", fontSize: 13, fontWeight: 500 }}>{profile.name?.split(" ")[0]}</span>
                  <ChevronDown size={12} color="rgba(255,255,255,0.6)" />
                </button>
                {userOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#042e2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, overflow: "hidden", minWidth: 180, boxShadow: "0 16px 40px rgba(0,0,0,0.3)", zIndex: 100 }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <p style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{profile.name}</p>
                      <p style={{ color: "#2dd4bf", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>{profile.role}</p>
                    </div>
                    <Link href={`/${locale}/dashboard`} onClick={() => setUserOpen(false)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <LayoutDashboard size={14} color="#2dd4bf" />
                      {tr("Dashboard", "Панель управления", "İdarə paneli")}
                    </Link>
                    {profile.role === "provider" && (
                      <Link href={`/${locale}/provider/profile`} onClick={() => setUserOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <User size={14} color="#2dd4bf" />
                        {tr("My Profile", "Мой профиль", "Profilim")}
                      </Link>
                    )}
                    {profile.role === "client" && (
                      <Link href={`/${locale}/bookings`} onClick={() => setUserOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <User size={14} color="#2dd4bf" />
                        {tr("My Bookings", "Мои бронирования", "Rezervasiyalarım")}
                      </Link>
                    )}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <button onClick={handleLogout}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", color: "rgba(239,68,68,0.8)", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "DM Sans, sans-serif", width: "100%" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <LogOut size={14} />
                        {tr("Logout", "Выйти", "Çıxış")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href={`/${locale}/auth`}
                style={{ fontSize: 13, padding: "10px 20px", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", borderRadius: 10, textDecoration: "none", fontFamily: "DM Sans, sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}>
                {tr("Sign In", "Войти", "Daxil ol")}
              </Link>
            )}
          </div>

          {/* Mobile Right */}
          <div className="nav-mobile-btn" style={{ alignItems: "center", gap: 8 }}>
            <div className="nav-mobile-lang" style={{ gap: 4 }}>
              {localesList.map((loc) => (
                <button key={loc.code} onClick={() => switchLocale(loc.code)}
                  style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", background: loc.code === locale ? "#0a7070" : "transparent", color: "white", fontFamily: "DM Sans, sans-serif", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                  {loc.flag} {loc.label}
                </button>
              ))}
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, cursor: "pointer", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {mobileOpen ? <X size={20} color="white" /> : <Menu size={20} color="white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ background: "rgba(2,26,26,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                style={{ color: "rgba(255,255,255,0.85)", fontFamily: "DM Sans, sans-serif", fontSize: 16, textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "block" }}>
                {link.label}
              </Link>
            ))}

            {/* Partners link mobile */}
            <Link href={`/${locale}/partners`} onClick={() => setMobileOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 8, color: "#c9a84c", fontFamily: "DM Sans, sans-serif", fontSize: 16, textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <Briefcase size={16} />
              {tr("For Partners", "Для партнёров", "Tərəfdaşlar üçün")}
            </Link>

            {profile ? (
              <>
                <div style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #0a7070, #2dd4bf)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>{profile.name ? profile.name[0].toUpperCase() : "?"}</span>
                    </div>
                    <div>
                      <p style={{ color: "white", fontSize: 14, fontWeight: 600 }}>{profile.name}</p>
                      <p style={{ color: "#2dd4bf", fontSize: 11, textTransform: "uppercase" }}>{profile.role}</p>
                    </div>
                  </div>
                  <Link href={`/${locale}/dashboard`} onClick={() => setMobileOpen(false)}
                    style={{ display: "block", textAlign: "center", background: "rgba(10,112,112,0.2)", color: "#2dd4bf", padding: "10px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif", marginBottom: 8 }}>
                    {tr("Dashboard", "Панель управления", "İdarə paneli")}
                  </Link>
                </div>
                <button onClick={handleLogout}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", padding: "12px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif", marginTop: 8 }}>
                  <LogOut size={16} />
                  {tr("Logout", "Выйти", "Çıxış")}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth`} onClick={() => setMobileOpen(false)}
                  style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "14px", borderRadius: 12, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: "DM Sans, sans-serif", marginTop: 12 }}>
                  {tr("Sign In", "Войти", "Daxil ol")}
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}