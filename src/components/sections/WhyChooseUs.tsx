"use client";

import { getT } from "@/lib/i18n";

export default function WhyChooseUs({ locale = "en" }: { locale?: string }) {
  const t = getT(locale);

  return (
    <section style={{ padding: "96px 24px", background: "linear-gradient(160deg, #021a1a 0%, #042e2e 100%)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12, fontFamily: "DM Sans, sans-serif" }}>
            {t.whyUs.tag}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", fontWeight: 400, marginBottom: 16 }}>
            {t.whyUs.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 480, margin: "0 auto", fontFamily: "DM Sans, sans-serif", lineHeight: 1.7 }}>
            {t.whyUs.subtitle}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {t.whyUs.features.map((f) => (
            <div key={f.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28, transition: "all 0.3s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,212,191,0.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "white", fontWeight: 600, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, fontFamily: "DM Sans, sans-serif" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}