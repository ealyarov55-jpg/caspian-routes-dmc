"use client";

import { useState } from "react";

const content = {
  ru: {
    title: "Получи бесплатный гид",
    subtitle: "Выбери что хочешь получить на email",
    guides: [
      { id: "top10", label: "🏙️ Топ-10 мест Баку" },
      { id: "checklist", label: "✅ Чек-лист путешественника" },
    ],
    placeholder: "Твой email",
    btn: "Получить гид →",
    sending: "Отправляем...",
    success: "Гид отправлен на почту! Проверь inbox 📬",
    error: "Ошибка. Попробуй ещё раз.",
  },
  en: {
    title: "Get Your Free Guide",
    subtitle: "Choose what you want to receive",
    guides: [
      { id: "top10", label: "🏙️ Top 10 Places in Baku" },
      { id: "checklist", label: "✅ Traveler's Checklist" },
    ],
    placeholder: "Your email",
    btn: "Get the guide →",
    sending: "Sending...",
    success: "Guide sent to your inbox! Check your email 📬",
    error: "Error. Please try again.",
  },
  az: {
    title: "Pulsuz bələdçi al",
    subtitle: "Nə almaq istədiyini seç",
    guides: [
      { id: "top10", label: "🏙️ Bakının Top-10 yeri" },
      { id: "checklist", label: "✅ Səyahətçi yoxlama siyahısı" },
    ],
    placeholder: "Email ünvanın",
    btn: "Bələdçi al →",
    sending: "Göndərilir...",
    success: "Bələdçi emailinə göndərildi! 📬",
    error: "Xəta. Yenidən cəhd edin.",
  },
  tr: {
  title: "Ücretsiz Rehberinizi Alın",
  subtitle: "Ne almak istediğinizi seçin",
  guides: [
    { id: "top10", label: "🏙️ Bakü'nün Top-10 Yeri" },
    { id: "checklist", label: "✅ Gezgin Kontrol Listesi" },
  ],
  placeholder: "E-posta adresiniz",
  btn: "Rehberi al →",
  sending: "Gönderiliyor...",
  success: "Rehber e-postanıza gönderildi! 📬",
  error: "Hata. Lütfen tekrar deneyin.",
},
};

export default function LeadMagnet({ locale }: { locale: string }) {
  const lang = (locale === "ru" || locale === "az" || locale === "tr") ? locale : "en";
  const t = content[lang as keyof typeof content];

  const [email, setEmail] = useState("");
  const [guide, setGuide] = useState("top10");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, guide }),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(t.error);
    } catch {
      setError(t.error);
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(10,112,112,0.15), rgba(13,144,144,0.08))",
      border: "1px solid rgba(45,212,191,0.2)",
      borderRadius: 16,
      padding: "36px 32px",
      margin: "48px 0 0",
      textAlign: "center",
    }}>
      <style>{`
        .lm-guide-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          font-family: DM Sans, sans-serif;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .lm-guide-btn:hover { border-color: rgba(45,212,191,0.4); color: white; }
        .lm-guide-btn.active { border: 2px solid #2DD4BF; background: rgba(45,212,191,0.12); color: #2DD4BF; font-weight: 500; }
        .lm-input {
          flex: 1;
          padding: 12px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          borderRadius: 8px;
          color: white;
          font-family: DM Sans, sans-serif;
          font-size: 14px;
          outline: none;
          min-width: 0;
          border-radius: 8px;
        }
        .lm-input::placeholder { color: rgba(255,255,255,0.35); }
        .lm-input:focus { border-color: rgba(45,212,191,0.4); }
        .lm-submit {
          padding: 12px 24px;
          background: linear-gradient(135deg, #0a7070, #0d9090);
          color: white;
          border: none;
          border-radius: 8px;
          font-family: DM Sans, sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(10,112,112,0.3);
        }
        .lm-submit:hover:not(:disabled) { background: linear-gradient(135deg, #0d9090, #2DD4BF); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(10,112,112,0.4); }
        .lm-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 600px) {
          .lm-form { flex-direction: column !important; }
          .lm-submit { width: 100%; }
        }
      `}</style>

      {success ? (
        <div>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
          <p style={{ color: "#2DD4BF", fontSize: 16, fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>{t.success}</p>
        </div>
      ) : (
        <>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", color: "white", fontWeight: 400, marginBottom: 8 }}>
            {t.title}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "DM Sans, sans-serif", marginBottom: 24 }}>
            {t.subtitle}
          </p>

          {/* Выбор гида */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
            {t.guides.map(g => (
              <button key={g.id} className={`lm-guide-btn${guide === g.id ? " active" : ""}`} onClick={() => setGuide(g.id)}>
                {g.label}
              </button>
            ))}
          </div>

          {/* Email форма */}
          <div className="lm-form" style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto" }}>
            <input
              className="lm-input"
              type="email"
              placeholder={t.placeholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            <button className="lm-submit" onClick={handleSubmit} disabled={loading || !email}>
              {loading ? t.sending : t.btn}
            </button>
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 13, marginTop: 10, fontFamily: "DM Sans, sans-serif" }}>{error}</p>}

          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "DM Sans, sans-serif", marginTop: 14 }}>
            {lang === "ru" ? "Без спама. Только полезное." : lang === "az" ? "Spam yoxdur." : lang === "tr" ? "Spam yok. Yalnızca faydalı içerik." : "No spam. Just useful content."}
          </p>
        </>
      )}
    </div>
  );
}