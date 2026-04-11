export default function WhyChooseUs() {
  const features = [
    {
      icon: "🏆",
      title: "Verified Local Guides",
      desc: "All drivers and guides are verified locals with proven experience in Azerbaijan travel.",
    },
    {
      icon: "💰",
      title: "Transparent Pricing",
      desc: "Compare prices directly. No hidden fees, no commissions. Pay your guide directly.",
    },
    {
      icon: "🌍",
      title: "Multilingual Support",
      desc: "Find guides who speak your language — English, Russian, Arabic, Turkish and more.",
    },
    {
      icon: "⭐",
      title: "Rated by Travelers",
      desc: "Read real reviews from tourists who experienced Azerbaijan with our guides.",
    },
    {
      icon: "📅",
      title: "Flexible Booking",
      desc: "No upfront payment. Send a request, get confirmed, pay on the day of your tour.",
    },
    {
      icon: "🛡️",
      title: "DMC Expertise",
      desc: "Backed by Caspian Routes DMC — years of experience in Azerbaijani tourism.",
    },
  ];

  return (
    <section style={{ padding: "96px 24px", background: "linear-gradient(160deg, #021a1a 0%, #042e2e 100%)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12, fontFamily: "DM Sans, sans-serif" }}>
            Why Us
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", fontWeight: 400, marginBottom: 16 }}>
            Why Choose Caspian Routes
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 480, margin: "0 auto", fontFamily: "DM Sans, sans-serif", lineHeight: 1.7 }}>
            We connect you with the best local talent in Azerbaijan for an authentic travel experience.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20, padding: 28,
              transition: "all 0.3s",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(45,212,191,0.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "white", fontWeight: 600, marginBottom: 10 }}>
                {f.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, fontFamily: "DM Sans, sans-serif" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}