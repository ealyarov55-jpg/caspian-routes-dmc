"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Users, Star, Award } from "lucide-react";

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  const stats = [
    { value: "4+", label: "Countries", icon: MapPin },
    { value: "120+", label: "Routes", icon: MapPin },
    { value: "5000+", label: "Travelers", icon: Users },
    { value: "4.9", label: "Average Rating", icon: Star },
  ];

  const team = [
    { name: "Elnur Alyarov", role: "Founder & CEO", desc: "10+ years in Azerbaijan tourism. Expert in DMC operations across the Caspian region." },
    { name: "Operations Team", role: "Route Specialists", desc: "Local experts who curate and verify every route and guide on our platform." },
    { name: "Guide Network", role: "Local Guides & Drivers", desc: "Verified professionals who bring Azerbaijan's culture and history to life." },
  ];

  const values = [
    { icon: "🤝", title: "Local First", desc: "We connect travelers directly with local guides — no middlemen, no hidden fees." },
    { icon: "🌍", title: "Authentic Experiences", desc: "Every route is curated by people who know Azerbaijan inside out." },
    { icon: "⭐", title: "Quality Assured", desc: "All guides are verified and rated by real travelers." },
    { icon: "💚", title: "Sustainable Tourism", desc: "We support local communities and responsible travel practices." },
  ];

  return (
    <div style={{ minHeight: "100vh", fontFamily: "DM Sans, sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #021a1a 0%, #042e2e 60%, #065050 100%)", padding: "120px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, #2dd4bf 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
          <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>About Us</p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 24 }}>
            Connecting Travelers with<br />
            <span style={{ color: "#2dd4bf" }}>Azerbaijan's Best Guides</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.8, marginBottom: 40 }}>
            Caspian Routes DMC is Azerbaijan's premier platform for connecting international travelers with verified local drivers, guides and tour operators. We believe travel is best experienced through local eyes.
          </p>
          <Link href={`/${locale}/routes`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", textDecoration: "none", padding: "14px 32px", borderRadius: 14, fontSize: 15, fontWeight: 600, boxShadow: "0 8px 24px rgba(10,112,112,0.4)" }}>
            Explore Routes <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "white", padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 48, fontWeight: 700, color: "#021a1a", lineHeight: 1, marginBottom: 8 }}>{stat.value}</p>
              <p style={{ color: "#94a3a3", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story */}
      <div style={{ background: "#f0f7f7", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>Our Story</p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#021a1a", fontWeight: 400, marginBottom: 24, lineHeight: 1.2 }}>
              Born from a Passion for Azerbaijan
            </h2>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
              Caspian Routes DMC was founded with a simple mission: to make Azerbaijan's incredible destinations accessible to the world, while ensuring local guides and drivers get the recognition and business they deserve.
            </p>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
              We started as a traditional DMC, organizing tours for corporate clients and travel agencies. Over time, we realized that individual travelers needed a better way to connect with trusted local experts — so we built this platform.
            </p>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.9 }}>
              Today, Caspian Routes connects thousands of travelers with hand-picked guides across Azerbaijan, from the flame towers of Baku to the ancient caravanserais of Sheki and the shores of the Caspian Sea.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <img src="/images/maxxja-baku-1997163_1920.jpg" alt="Baku" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 16 }} />
            <img src="/images/pexels-zulfugarkarimov-33085326.jpg" alt="Azerbaijan" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 16, marginTop: 24 }} />
            <img src="/images/pexels-arzu-ibaeva-479643718-16976814.jpg" alt="Nature" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 16, marginTop: -24 }} />
            <img src="/images/pozziss-azerbaijan-4856054_1920.jpg" alt="Caspian" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 16 }} />
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ background: "white", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>What We Stand For</p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#021a1a", fontWeight: 400 }}>Our Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {values.map(v => (
              <div key={v.title} style={{ background: "#f8fafa", borderRadius: 20, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 10 }}>{v.title}</h3>
                <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div style={{ background: "#f0f7f7", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>The People</p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#021a1a", fontWeight: 400 }}>Behind Caspian Routes</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {team.map(member => (
              <div key={member.name} style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>{member.name[0]}</span>
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 4 }}>{member.name}</h3>
                <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{member.role}</p>
                <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.7 }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg, #021a1a, #042e2e)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, marginBottom: 16 }}>
            Ready to Explore Azerbaijan?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            Browse our curated routes and connect with a local guide today.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/${locale}/routes`}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", textDecoration: "none", padding: "14px 32px", borderRadius: 14, fontSize: 15, fontWeight: 600 }}>
              Explore Routes <ArrowRight size={16} />
            </Link>
            <Link href={`/${locale}/auth`}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "white", textDecoration: "none", padding: "14px 32px", borderRadius: 14, fontSize: 15, fontWeight: 600, border: "1.5px solid rgba(255,255,255,0.3)" }}>
              Become a Guide
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}