"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, ChevronDown, Globe } from "lucide-react";
import { getT } from "@/lib/i18n";

const localesList = [
  { code: "en", label: "EN", full: "English" },
  { code: "ru", label: "RU", full: "Русский" },
  { code: "az", label: "AZ", full: "Azərbaycan" },
];

export default function Navbar({ locale }: { locale: string }) {
  const t = getT(locale);
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

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
  };

  const navLinks = [
    { label: t.nav.destinations, href: `/${locale}/destinations`, hasDropdown: true },
    { label: t.nav.experiences, href: `/${locale}/experiences` },
    { label: t.nav.routes, href: `/${locale}/routes` },
    { label: t.nav.about, href: `/${locale}/about` },
    { label: t.nav.contact, href: `/${locale}/contact` },
  ];

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "all 0.5s ease",
      background: scrolled ? "rgba(2,26,26,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.2)" : "none",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 80 }}>

        {/* Logo */}
        <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 40 40" style={{ width: 24, height: 24 }} fill="none">
              <path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C30 36 36 28 36 20" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 4 L24 14 L20 12 L16 14 Z" fill="#c9a84c"/>
              <circle cx="20" cy="20" r="3" fill="#2dd4bf"/>
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontWeight: 600, fontSize: 18 }}>Caspian</span>
            <span style={{ color: "#2dd4bf", fontSize: 9, fontFamily: "DM Sans, sans-serif", textTransform: "uppercase", letterSpacing: "0.2em" }}>Travel Routes DMC</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex" style={{ alignItems: "center", gap: 32 }}>
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}
              style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              {link.label}
              {link.hasDropdown && <ChevronDown size={14} color="#2dd4bf" />}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 12 }}>
          <Search size={16} color="rgba(255,255,255,0.7)" style={{ cursor: "pointer" }} />

          {/* Lang switcher */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setLangOpen(!langOpen)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "white", fontFamily: "DM Sans, sans-serif", fontSize: 13 }}>
              <Globe size={14} color="#2dd4bf" />
              {locale.toUpperCase()}
              <ChevronDown size={12} color="rgba(255,255,255,0.6)" />
            </button>
            {langOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#042e2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", minWidth: 140, boxShadow: "0 16px 40px rgba(0,0,0,0.3)", zIndex: 100 }}>
                {localesList.map((loc) => (
                  <button key={loc.code} onClick={() => switchLocale(loc.code)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 16px", background: loc.code === locale ? "rgba(45,212,191,0.1)" : "transparent", border: "none", cursor: "pointer", color: loc.code === locale ? "#2dd4bf" : "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif", fontSize: 13 }}>
                    <span>{loc.full}</span>
                    <span style={{ fontSize: 11, opacity: 0.6 }}>{loc.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />
          <Link href={`/${locale}/plan`} className="btn-primary" style={{ fontSize: 13, padding: "10px 20px" }}>
            {t.nav.planTrip}
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}>
          {mobileOpen ? <X size={20} color="white" /> : <Menu size={20} color="white" />}
        </button>
      </div>

      {mobileOpen && (
        <div style={{ background: "rgba(2,26,26,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif", fontSize: 16, textDecoration: "none" }}>
              {link.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {localesList.map((loc) => (
              <button key={loc.code} onClick={() => switchLocale(loc.code)}
                style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: loc.code === locale ? "#0a7070" : "transparent", color: "white", fontFamily: "DM Sans, sans-serif", fontSize: 13, cursor: "pointer" }}>
                {loc.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}