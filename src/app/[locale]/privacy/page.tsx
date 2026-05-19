import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main style={{ background: "#021a1a", minHeight: "100vh" }}>
      <Navbar locale={locale} />
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "100px 24px 80px" }}>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 8 }}>
          Terms of Service
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 48 }}>Last updated: May 2026</p>

        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.8, fontFamily: "DM Sans, sans-serif" }}>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>1. About Caspian Routes</h2>
          <p>Caspian Routes (caspian-routes.com) is an AI-powered travel planning platform. We provide free travel guides, AI-generated itineraries and curated travel content for Azerbaijan and the Caucasus. By using our platform, you agree to these Terms of Service.</p>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>2. Use of the Platform</h2>
          <p>Our platform is free to use. You may use Caspian Routes to plan personal travel itineraries, read travel guides and access affiliate booking links. You agree not to misuse the platform or use it for any unlawful purpose.</p>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>3. AI Trip Planner</h2>
          <p>The AI Trip Planner generates travel itineraries based on your inputs. These are suggestions only and do not constitute professional travel advice. Prices, availability and conditions may change. Always verify information directly with service providers before booking.</p>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>4. Affiliate Links & Partnerships</h2>
          <p>Caspian Routes participates in affiliate programs with Aviasales, Ostrovok, Localrent and GetYourGuide. We may earn a commission when you click an affiliate link and complete a purchase. This does not influence our content or recommendations.</p>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>5. Content Accuracy</h2>
          <p>We strive to keep all travel information accurate and up to date. However prices, schedules, visa requirements and other conditions can change. Caspian Routes is not responsible for losses resulting from outdated information. Always check official sources before traveling.</p>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>6. Intellectual Property</h2>
          <p>All content on Caspian Routes — articles, AI-generated itineraries, design and code — is the property of Caspian Routes. You may share links to our content but may not reproduce or republish it without permission.</p>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>7. Limitation of Liability</h2>
          <p>Caspian Routes provides its services «as is» without warranties. We are not liable for any damages arising from your use of the platform or travel decisions made based on our content.</p>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>8. Changes to Terms</h2>
          <p>We may update these Terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the updated terms.</p>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>9. Governing Law</h2>
          <p>These terms are governed by the laws of the Republic of Azerbaijan.</p>

          <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>10. Contact</h2>
          <p>Email: <a href="mailto:ealyarov55@gmail.com" style={{ color: "#2DD4BF" }}>ealyarov55@gmail.com</a><br />Baku, Azerbaijan</p>
        </div>
      </div>
      <Footer locale={locale} />
    </main>
  );
}