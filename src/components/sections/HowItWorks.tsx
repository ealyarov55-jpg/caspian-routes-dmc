export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose Your Route",
      desc: "Browse our curated Azerbaijan routes — from Baku city tours to Silk Road adventures and Caspian cruises.",
      icon: "🗺️",
    },
    {
      number: "02",
      title: "Select Your Guide",
      desc: "Compare local drivers and guides by price, languages, ratings and availability. All verified professionals.",
      icon: "👤",
    },
    {
      number: "03",
      title: "Send a Request",
      desc: "Submit your booking request with your preferred date. No payment required upfront — guide confirms directly.",
      icon: "📅",
    },
    {
      number: "04",
      title: "Enjoy Your Journey",
      desc: "Meet your guide and experience Azerbaijan like a local. After the trip, leave a review to help others.",
      icon: "✈️",
    },
  ];

  return (
    <section style={{ padding: "96px 24px", background: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12, fontFamily: "DM Sans, sans-serif" }}>
            Simple Process
          </p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#021a1a", fontWeight: 400, marginBottom: 16 }}>
            How It Works
          </h2>
          <p style={{ color: "#4a6060", fontSize: 16, maxWidth: 480, margin: "0 auto", fontFamily: "DM Sans, sans-serif", lineHeight: 1.7 }}>
            Book a local guide in minutes. No middlemen, no hidden fees.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32, position: "relative" }}>
          {steps.map((step, i) => (
            <div key={step.number} style={{ position: "relative" }}>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", top: 28, left: "calc(50% + 40px)", right: "-50%",
                  height: 1, background: "linear-gradient(to right, #e2eded, transparent)",
                  display: "none",
                }} className="connector" />
              )}
              <div style={{ textAlign: "center" }}>
                {/* Icon circle */}
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(135deg, #042e2e, #0a7070)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px", fontSize: 24,
                  boxShadow: "0 8px 24px rgba(10,112,112,0.25)",
                }}>
                  {step.icon}
                </div>
                {/* Number */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}