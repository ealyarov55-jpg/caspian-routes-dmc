"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const links = {
    company: [
      { label: "About Us", href: `/${locale}/about` },
      { label: "How It Works", href: `/${locale}/#how-it-works` },
      { label: "Become a Guide", href: `/${locale}/auth` },
      { label: "Contact", href: `/${locale}/contact` },
    ],
    routes: [
      { label: "Baku City Tour", href: `/${locale}/routes/baku-city-tour` },
      { label: "Absheron Peninsula", href: `/${locale}/routes/absheron-peninsula` },
      { label: "Sheki & Silk Road", href: `/${locale}/routes/sheki-silk-road` },
      { label: "Caspian Sea Cruise", href: `/${locale}/routes/caspian-sea-cruise` },
    ],
    legal: [
      { label: "Privacy Policy", href: `/${locale}/privacy` },
      { label: "Terms of Service", href: `/${locale}/terms` },
    ],
  };

  const socials = [
    {
      href: "https://instagram.com",
      svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
    },
    {
      href: "https://facebook.com",
      svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    },
    {
      href: "https://linkedin.com",
      svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
    },
  ];

  return (
    <footer style={{ background: "#021a1a", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>

          {/* Brand */}
          <div>
            <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 40 40" style={{ width: 26, height: 26 }} fill="none">
                  <path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C30 36 36 28 36 20" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M20 4 L24 14 L20 12 L16 14 Z" fill="#c9a84c"/>
                  <circle cx="20" cy="20" r="3" fill="#2dd4bf"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>Caspian Routes</p>
                <p style={{ color: "#2dd4bf", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em" }}>Travel Routes DMC</p>
              </div>
            </Link>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8, marginBottom: 24, maxWidth: 280 }}>
              Your trusted DMC partner for unforgettable journeys across Azerbaijan, Kazakhstan, Turkmenistan, Iran and Russia.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              {[
                { icon: MapPin, text: "Baku, Azerbaijan" },
                { icon: Phone, text: "+994 XX XXX XX XX" },
                { icon: Mail, text: "info@caspianroutes.az" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon size={14} color="#2dd4bf" />
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {socials.map(({ href, svg }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(45,212,191,0.15)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Company</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {links.company.map(link => (
                <Link key={link.label} href={link.href}
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#2dd4bf")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Routes */}
          <div>
            <h4 style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Routes</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {links.routes.map(link => (
                <Link key={link.label} href={link.href}
                  style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#2dd4bf")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: "white", fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Stay Updated</h4>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              Get travel tips and exclusive offers from Azerbaijan.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input type="email" placeholder="your@email.com"
                style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, fontFamily: "DM Sans, sans-serif", outline: "none" }} />
              <button style={{ padding: "10px 14px", borderRadius: 10, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                Subscribe
              </button>
            </div>
          </div>

        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>© 2025 Caspian Routes DMC. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {links.legal.map(link => (
              <Link key={link.label} href={link.href} style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}