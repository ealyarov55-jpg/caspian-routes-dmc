"use client";

import { useState } from "react";
import { ArrowRight, Check, Briefcase } from "lucide-react";

export default function PartnerCTA({ locale = "en" }: { locale?: string }) {
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [form, setForm] = useState({ name: "", company: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.company) return;
    setSending(true);
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "partner_request",
        partner: { ...form, type: "Homepage CTA" },
      }),
    });
    setSending(false);
    setSubmitted(true);
  };

  const benefits = [
    tr("Net prices on all services", "Net-цены на все услуги", "Bütün xidmətlərə net qiymətlər"),
    tr("No joining fee", "Без вступительного взноса", "Qoşulma haqqı yoxdur"),
    tr("Dedicated account manager", "Персональный менеджер", "Şəxsi menecer"),
    tr("Commission on every booking", "Комиссия с каждого бронирования", "Hər rezervasiyadan komissiya"),
  ];

  return (
    <section style={{ background: "linear-gradient(160deg, #021a1a 0%, #042e2e 60%, #065050 100%)", padding: "96px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, #2dd4bf 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48, alignItems: "center" }} className="cta-grid">
          <style>{`
            @media (min-width: 768px) {
              .cta-grid { grid-template-columns: 1fr 1fr !important; }
            }
          `}</style>

          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 999, padding: "6px 16px", marginBottom: 24 }}>
              <Briefcase size={13} color="#c9a84c" />
              <span style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", fontFamily: "DM Sans, sans-serif" }}>
                {tr("B2B Partner Program", "Партнёрская программа", "B2B Tərəfdaşlıq")}
              </span>
            </div>

            <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 20 }}>
              {tr("Become Our First Partner", "Станьте первым партнёром", "İlk tərəfdaşımız olun")}
            </h2>

            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.8, marginBottom: 32, fontFamily: "DM Sans, sans-serif" }}>
              {tr(
                "We are building Azerbaijan's leading B2B DMC platform. Join now as an early partner and get exclusive access to net prices, dedicated support and first-mover advantages.",
                "Мы строим ведущую B2B DMC платформу Азербайджана. Присоединяйтесь сейчас как ранний партнёр и получите эксклюзивный доступ к net-ценам и персональной поддержке.",
                "Azərbaycanın aparıcı B2B DMC platformasını qururuq. İndi erkən tərəfdaş kimi qoşulun və net qiymətlərə eksklüziv giriş əldə edin."
              )}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(45,212,191,0.2)", border: "1px solid rgba(45,212,191,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={12} color="#2dd4bf" />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: "DM Sans, sans-serif" }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 32, backdropFilter: "blur(20px)" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Check size={28} color="white" />
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "white", marginBottom: 12 }}>
                  {tr("Request Received!", "Заявка получена!", "Müraciət qəbul edildi!")}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, fontFamily: "DM Sans, sans-serif" }}>
                  {tr("We will contact you within 24 hours.", "Свяжемся с вами в течение 24 часов.", "24 saat ərzində sizinlə əlaqə saxlayacağıq.")}
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "white", marginBottom: 24, fontWeight: 500 }}>
                  {tr("Apply for Partnership", "Подать заявку", "Tərəfdaşlıq üçün müraciət")}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8, fontFamily: "DM Sans, sans-serif" }}>
                      {tr("Your Name", "Ваше имя", "Adınız")} *
                    </label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder={tr("Full name", "Полное имя", "Ad Soyad")}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
                  </div>

                  <div>
                    <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8, fontFamily: "DM Sans, sans-serif" }}>
                      {tr("Company Name", "Название компании", "Şirkətin adı")} *
                    </label>
                    <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                      placeholder={tr("Your company", "Ваша компания", "Şirkətiniz")}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
                  </div>

                  <div>
                    <label style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8, fontFamily: "DM Sans, sans-serif" }}>
                      Email *
                    </label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      type="email" placeholder="company@email.com"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
                  </div>

                  <button onClick={handleSubmit} disabled={sending || !form.name || !form.email || !form.company}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: (!form.name || !form.email || !form.company) ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #c9a84c, #d4a843)", color: (!form.name || !form.email || !form.company) ? "rgba(255,255,255,0.3)" : "white", fontSize: 15, fontWeight: 600, cursor: (!form.name || !form.email || !form.company) ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
                    {sending ? tr("Sending...", "Отправляем...", "Göndərilir...") : tr("Send Application", "Отправить заявку", "Müraciəti göndər")}
                    {!sending && <ArrowRight size={16} />}
                  </button>

                  <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "DM Sans, sans-serif" }}>
                    {tr("We reply within 24 hours", "Отвечаем в течение 24 часов", "24 saat ərzində cavab veririk")}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}