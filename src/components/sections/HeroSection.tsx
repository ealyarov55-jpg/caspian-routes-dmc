"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Star, Users } from "lucide-react";
import { getT } from "@/lib/i18n";

const slideImages = [
  { image: "/images/maxxja-baku-1997163_1920.jpg", badgeKey: "badge1" },
  { image: "/images/pexels-zulfugarkarimov-33085326.jpg", badgeKey: "badge2" },
  { image: "/images/pozziss-azerbaijan-4856054_1920.jpg", badgeKey: "badge3" },
];

const slideTitles = [
  ["Discover the", "Caspian Routes"],
  ["Ancient Paths,", "Modern Journeys"],
  ["Where Mountains", "Meet the Sea"],
];

export default function HeroSection({ locale }: { locale: string }) {
  const t = getT(locale);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slideImages.length);
        setAnimating(false);
      }, 600);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const badges = [t.hero.countries === "Countries" ? "Azerbaijan" : t.hero.countries === "Страны" ? "Азербайджан" : "Azərbaycan",
    t.hero.countries === "Countries" ? "Silk Road" : t.hero.countries === "Страны" ? "Шёлковый путь" : "İpək yolu",
    t.hero.countries === "Countries" ? "Caucasus" : t.hero.countries === "Страны" ? "Кавказ" : "Qafqaz"];

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${slideImages[current].image})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: animating ? 0 : 1, transition: "opacity 0.7s ease",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(2,26,26,0.95) 0%, rgba(4,46,46,0.75) 50%, rgba(10,80,80,0.3) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(2,26,26,0.8) 0%, transparent 60%)" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "96px 24px 64px", width: "100%" }}>
        <div style={{ maxWidth: 680 }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(10,112,112,0.3)", border: "1px solid rgba(45,212,191,0.3)",
            borderRadius: 999, padding: "6px 16px", marginBottom: 24,
            opacity: animating ? 0 : 1, transition: "opacity 0.5s ease",
          }}>
            <MapPin size={14} color="#2dd4bf" />
            <span style={{ color: "#5eead4", fontSize: 11, fontFamily: "DM Sans, sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em" }}>
              {badges[current]}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "Cormorant Garamond, serif", color: "white", fontWeight: 300,
            lineHeight: 1.1, marginBottom: 24, fontSize: "clamp(2.8rem, 6vw, 5rem)",
            opacity: animating ? 0 : 1, transition: "opacity 0.5s ease",
          }}>
            {slideTitles[current][0]}<br />
            <span style={{ color: "#2dd4bf" }}>{slideTitles[current][1]}</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
            {t.hero.subtitle}
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 64 }}>
            <Link href={`/${locale}/routes`} className="btn-primary">
              {t.hero.exploreBtn} <ArrowRight size={16} />
            </Link>
            <Link href={`/${locale}/plan`} className="btn-outline">
              {t.hero.planBtn}
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 40 }}>
            {[
              { icon: MapPin, value: "4", label: t.hero.countries },
              { icon: Star, value: "120+", label: t.hero.routes },
              { icon: Users, value: "5000+", label: t.hero.travelers },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <Icon size={14} color="#2dd4bf" />
                  <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 26, fontWeight: 600 }}>{value}</span>
                </div>
                <span style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
        {slideImages.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            style={{ borderRadius: 999, border: "none", cursor: "pointer", transition: "all 0.3s", width: i === current ? 32 : 8, height: 8, background: i === current ? "#2dd4bf" : "rgba(255,255,255,0.3)" }} />
        ))}
      </div>
    </section>
  );
}