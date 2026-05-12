"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const localesList = [
  { code: "en", label: "EN", full: "English", flagCode: "gb" },
  { code: "ru", label: "RU", full: "Русский", flagCode: "ru" },
  { code: "az", label: "AZ", full: "Azərbaycan", flagCode: "az" },
];

const navContent = {
  ru: { blog: "Путеводитель", planner: "Создать маршрут", contact: "Контакт" },
  en: { blog: "Travel Guide", planner: "Create Itinerary", contact: "Contact" },
  az: { blog: "Bələdçi", planner: "Marşrut Yarat", contact: "Əlaqə" },
};

function FlagImg({ code, size = 20 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w20/${code}.png`}
      width={20}
      height={15}
      alt={code}
      style={{ borderRadius: 2, display: "inline-block", verticalAlign: "middle" }}
    />
  );
}

export default function Navbar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";
  const t = navContent[lang];

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
    setMobileOpen(false);
  };

  const currentLocale = localesList.find(l => l.code === locale) || localesList[0];

  const navLinks = [
    { label: t.blog, href: `/${locale}/blog` },
    { label: t.contact, href: `/${locale}/contact` },
  ];

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-mobile-btn { display: none; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        .nav-link {
          color: rgba(255,255,255,0.8);
          font-family: DM Sans, sans-serif;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #2DD4BF;
          transition: width 0.25s ease;
        }
        .nav-link:hover {
          color: white;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-cta {
          font-size: 13px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #0a7070, #0d9090);
          color: white;
          border-radius: 10px;
          text-decoration: none;
          font-family: DM Sans, sans-serif;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(10,112,112,0.3);
          display: inline-block;
        }
        .nav-cta:hover {
          background: linear-gradient(135deg, #0d9090, #2DD4BF);
          box-shadow: 0 6px 20px rgba(10,112,112,0.5);
          transform: translateY(-1px);
        }
        .lang-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          color: white;
          font-family: DM Sans, sans-serif;
          font-size: 13px;
          transition: all 0.2s ease;
        }
        .lang-btn:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.3);
        }
        .lang-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 10px 16px;
          border: none;
          cursor: pointer;
          font-family: DM Sans, sans-serif;
          font-size: 13px;
          transition: background 0.15s ease;
        }
        .lang-option:hover {
          background: rgba(45,212,191,0.08) !important;
        }
        .mobile-cta {
          display: block;
          text-align: center;
          background: linear-gradient(135deg, #0a7070, #0d9090);
          color: white;
          padding: 14px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          font-family: DM Sans, sans-serif;
          margin-top: 12px;
          transition: all 0.25s ease;
        }
        .mobile-cta:hover {
          background: linear-gradient(135deg, #0d9090, #2DD4BF);
        }
        .mobile-flag-btn {
          padding: 5px 8px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }
        .mobile-flag-btn.active {
          background: #0a7070;
          border-color: #0a7070;
        }
        .mobile-flag-btn:hover {
          border-color: rgba(45,212,191,0.5);
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
              <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontWeight: 600, fontSize: 17 }}>Caspian Routes</span>
              <span style={{ color: "#2dd4bf", fontSize: 8, fontFamily: "DM Sans, sans-serif", textTransform: "uppercase", letterSpacing: "0.2em" }}>AI Travel Planner</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav-desktop" style={{ alignItems: "center", gap: 28 }}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="nav-desktop" style={{ alignItems: "center", gap: 10 }}>

            {/* Lang switcher */}
            <div style={{ position: "relative" }}>
              <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                <FlagImg code={currentLocale.flagCode} size={14} />
                <span>{currentLocale.label}</span>
                <ChevronDown size={12} color="rgba(255,255,255,0.6)" />
              </button>
              {langOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#042e2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", minWidth: 160, boxShadow: "0 16px 40px rgba(0,0,0,0.3)", zIndex: 100 }}>
                  {localesList.map((loc) => (
                    <button key={loc.code} className="lang-option"
                      onClick={() => switchLocale(loc.code)}
                      style={{ background: loc.code === locale ? "rgba(45,212,191,0.1)" : "transparent", color: loc.code === locale ? "#2dd4bf" : "rgba(255,255,255,0.8)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FlagImg code={loc.flagCode} size={14} />
                        <span>{loc.full}</span>
                      </span>
                      <span style={{ fontSize: 11, opacity: 0.6 }}>{loc.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href={`/${locale}/planner`} className="nav-cta">
              {t.planner} →
            </Link>
          </div>

          {/* Mobile Right */}
          <div className="nav-mobile-btn" style={{ alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {localesList.map((loc) => (
                <button key={loc.code} className={`mobile-flag-btn${loc.code === locale ? " active" : ""}`}
                  onClick={() => switchLocale(loc.code)}>
                  <FlagImg code={loc.flagCode} size={16} />
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
            <Link href={`/${locale}/planner`} className="mobile-cta" onClick={() => setMobileOpen(false)}>
              {t.planner} →
            </Link>
          </div>
        )}
      </header>
    </>
  );
}