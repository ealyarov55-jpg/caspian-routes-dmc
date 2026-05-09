"use client";

import { use, useState } from "react";
import { Mail, Send, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { showToast } from "@/components/ui/Toast";

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      showToast(tr("Please fill all required fields", "Заполните все обязательные поля", "Bütün sahələri doldurun"), "error");
      return;
    }
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      showToast(tr("Something went wrong. Try again.", "Что-то пошло не так. Попробуйте ещё раз.", "Xəta baş verdi. Yenidən cəhd edin."), "error");
    }
    setSending(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#021a1a", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar locale={locale} />

      {/* Hero */}
      <div style={{ padding: "140px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>
            {tr("Contact", "Контакт", "Əlaqə")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 20 }}>
            {tr("Get in Touch", "Напишите нам", "Bizimlə əlaqə")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.7 }}>
            {tr(
              "Have a question about your trip to Azerbaijan? We'll reply within 24 hours.",
              "Есть вопрос о поездке в Азербайджан? Ответим в течение 24 часов.",
              "Azərbaycana səfəriniz haqqında sualınız var? 24 saat ərzində cavab verəcəyik."
            )}
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "40px 36px" }}>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Check size={28} color="white" />
              </div>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "white", marginBottom: 12 }}>
                {tr("Message Sent!", "Сообщение отправлено!", "Mesaj göndərildi!")}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.6 }}>
                {tr("We'll get back to you within 24 hours.", "Ответим в течение 24 часов.", "24 saat ərzində cavab verəcəyik.")}
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={18} color="#2dd4bf" />
                </div>
                <div>
                  <p style={{ color: "white", fontSize: 15, fontWeight: 500 }}>ealyarov55@gmail.com</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                    {tr("Reply within 24 hours", "Ответ в течение 24 часов", "24 saat ərzində cavab")}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                  {tr("Name", "Имя", "Ad")}
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder={tr("Your name", "Ваше имя", "Adınız")}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                  Email
                </label>
                <input
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  type="email"
                  placeholder="your@email.com"
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                  {tr("Message", "Сообщение", "Mesaj")}
                </label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder={tr("Your question about Azerbaijan trip...", "Ваш вопрос о поездке в Азербайджан...", "Azərbaycana səfəriniz haqqında sualınız...")}
                  rows={5}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={sending || !form.name || !form.email || !form.message}
                style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: (!form.name || !form.email || !form.message) ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #0a7070, #0d9090)", color: (!form.name || !form.email || !form.message) ? "rgba(255,255,255,0.3)" : "white", fontSize: 15, fontWeight: 600, cursor: (!form.name || !form.email || !form.message) ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.25s" }}>
                <Send size={16} />
                {sending ? tr("Sending...", "Отправляем...", "Göndərilir...") : tr("Send Message", "Отправить", "Göndər")}
              </button>
            </>
          )}
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  );
}