"use client";

import { use, useState } from "react";
import { MapPin, Phone, Mail, Send, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setSubmitted(true);
  };

  const contacts = [
    {
      icon: MapPin,
      title: tr("Address", "Адрес", "Ünvan"),
      value: "Baku, Azerbaijan",
      sub: tr("Available for meetings by appointment", "Встречи по договорённости", "Görüş razılaşma ilə mümkündür"),
    },
    {
      icon: Phone,
      title: tr("Phone", "Телефон", "Telefon"),
      value: "+994 XX XXX XX XX",
      sub: tr("Mon–Fri, 9:00–18:00", "Пн–Пт, 9:00–18:00", "B.e–Cü, 9:00–18:00"),
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@caspianroutes.az",
      sub: tr("We reply within 24 hours", "Отвечаем в течение 24 часов", "24 saat ərzində cavab veririk"),
    },
  ];

  return (
  <div style={{ minHeight: "100vh", fontFamily: "DM Sans, sans-serif" }}>
    <Navbar locale={locale} />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #021a1a 0%, #042e2e 60%, #065050 100%)", padding: "160px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, #2dd4bf 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>
            {tr("Get in Touch", "Свяжитесь с нами", "Bizimlə əlaqə")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 20 }}>
            {tr("Contact Us", "Контакты", "Əlaqə")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.7 }}>
            {tr(
              "Have a question or want to plan your trip? We're here to help.",
              "Есть вопрос или хотите спланировать поездку? Мы готовы помочь.",
              "Sualınız var və ya səfər planlaşdırmaq istəyirsiniz? Biz kömək etməyə hazırıq."
            )}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: "#f0f7f7", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="contact-grid">
          <style>{`
            .contact-grid { grid-template-columns: 1fr !important; }
            @media (min-width: 768px) {
              .contact-grid { grid-template-columns: 1fr 1fr !important; }
            }
          `}</style>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, color: "#021a1a", fontWeight: 400, marginBottom: 12 }}>
              {tr("Let's Talk", "Давайте поговорим", "Danışaq")}
            </h2>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
              {tr(
                "Whether you're planning a corporate trip, a private tour, or need DMC services in Azerbaijan — reach out and we'll get back to you promptly.",
                "Планируете корпоративную поездку, частный тур или нуждаетесь в DMC-услугах в Азербайджане — напишите нам и мы быстро ответим.",
                "Korporativ səfər, özəl tur planlaşdırırsınız və ya Azərbaycanda DMC xidmətlərinə ehtiyacınız var — bizimlə əlaqə saxlayın, tez cavab verəcəyik."
              )}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {contacts.map(c => (
                <div key={c.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <c.icon size={20} color="#2dd4bf" />
                  </div>
                  <div>
                    <p style={{ color: "#94a3a3", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{c.title}</p>
                    <p style={{ color: "#021a1a", fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{c.value}</p>
                    <p style={{ color: "#4a6060", fontSize: 13 }}>{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ marginTop: 40, padding: 24, background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <p style={{ color: "#4a6060", fontSize: 13, marginBottom: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {tr("Follow Us", "Мы в соцсетях", "Bizi izləyin")}
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { name: "Instagram", href: "https://instagram.com" },
                  { name: "Facebook", href: "https://facebook.com" },
                  { name: "LinkedIn", href: "https://linkedin.com" },
                ].map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "8px 16px", borderRadius: 10, background: "#f0f7f7", color: "#0a7070", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1.5px solid #e2eded" }}>
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "white", borderRadius: 24, padding: 32, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Check size={28} color="white" />
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#021a1a", marginBottom: 12 }}>
                  {tr("Message Sent!", "Сообщение отправлено!", "Mesaj göndərildi!")}
                </h3>
                <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.6 }}>
                  {tr("Thank you! We'll get back to you within 24 hours.", "Спасибо! Мы ответим в течение 24 часов.", "Təşəkkür edirik! 24 saat ərzində cavab verəcəyik.")}
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, color: "#021a1a", marginBottom: 24, fontWeight: 500 }}>
                  {tr("Send a Message", "Написать нам", "Mesaj göndər")}
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: "#4a6060", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                      {tr("Name", "Имя", "Ad")}
                    </label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder={tr("Your name", "Ваше имя", "Adınız")}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2eded", background: "#f8fafa", color: "#021a1a", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ color: "#4a6060", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                      Email
                    </label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      type="email" placeholder="your@email.com"
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2eded", background: "#f8fafa", color: "#021a1a", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: "#4a6060", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                    {tr("Subject", "Тема", "Mövzu")}
                  </label>
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder={tr("How can we help?", "Чем можем помочь?", "Necə kömək edə bilərik?")}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2eded", background: "#f8fafa", color: "#021a1a", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ color: "#4a6060", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                    {tr("Message", "Сообщение", "Mesaj")}
                  </label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder={tr("Tell us about your trip plans...", "Расскажите о ваших планах поездки...", "Səfər planlarınız haqqında danışın...")}
                    rows={5}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e2eded", background: "#f8fafa", color: "#021a1a", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                </div>

                <button onClick={handleSubmit} disabled={sending || !form.name || !form.email || !form.message}
                  style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: (!form.name || !form.email || !form.message) ? "#e2eded" : "linear-gradient(135deg, #0a7070, #0d9090)", color: (!form.name || !form.email || !form.message) ? "#94a3a3" : "white", fontSize: 15, fontWeight: 600, cursor: (!form.name || !form.email || !form.message) ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Send size={16} />
                  {sending ? tr("Sending...", "Отправляем...", "Göndərilir...") : tr("Send Message", "Отправить", "Göndər")}
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}