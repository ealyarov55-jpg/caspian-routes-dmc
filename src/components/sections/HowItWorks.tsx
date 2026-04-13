import { getT } from "@/lib/i18n";

export default function HowItWorks({ locale = "en" }: { locale?: string }) {
  const t = getT(locale);

  return (
    <section style={{ padding: "96px 24px", background: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12, fontFamily: "DM Sans, sans-serif" }}>
            {t.howItWorks.tag}
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#021a1a", fontWeight: 400, marginBottom: 16 }}>
            {t.howItWorks.title}
          </h2>
          <p style={{ color: "#4a6060", fontSize: 16, maxWidth: 480, margin: "0 auto", fontFamily: "DM Sans, sans-serif", lineHeight: 1.7 }}>
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
          {t.howItWorks.steps.map((step, i) => {
            const icons = ["🗺️", "👤", "📅", "✈️"];
            return (
              <div key={step.number} style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24, boxShadow: "0 8px 24px rgba(10,112,112,0.25)" }}>
                  {icons[i]}
                </div>
                <p style={{ color: "#2dd4bf", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 8, fontFamily: "DM Sans, sans-serif" }}>
                  STEP {step.number}
                </p>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 12 }}>
                  {step.title}
                </h3>
                <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.7, fontFamily: "DM Sans, sans-serif" }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}