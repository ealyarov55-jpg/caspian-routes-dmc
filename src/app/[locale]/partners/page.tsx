"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Check, ArrowRight, Globe, Users, BarChart3, Shield, Star, ChevronDown } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "",
    type: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!form.companyName || !form.email || !form.contactName) return;
    setSending(true);
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "partner_request",
        partner: form,
      }),
    });
    setSending(false);
    setSubmitted(true);
  };

  const benefits = [
    {
      icon: BarChart3,
      title: tr("Net Prices", "Net-цены", "Net qiymətlər"),
      desc: tr("Access wholesale prices on all services. Add your own margin freely.", "Доступ к оптовым ценам на все услуги. Добавляйте свою наценку свободно.", "Bütün xidmətlərə topdansatış qiymətləri. Öz marjınızı sərbəst əlavə edin."),
    },
    {
      icon: Users,
      title: tr("Dedicated Manager", "Персональный менеджер", "Şəxsi menecer"),
      desc: tr("A dedicated account manager available 24/7 for your requests.", "Персональный менеджер доступен 24/7 для ваших запросов.", "Sorğularınız üçün 24/7 mövcud olan şəxsi menecer."),
    },
    {
      icon: Globe,
      title: tr("Full DMC Services", "Полный спектр DMC", "Tam DMC xidmətləri"),
      desc: tr("Guides, drivers, hotels, transfers, MICE — all in one place.", "Гиды, водители, отели, трансферы, MICE — всё в одном месте.", "Bələdçilər, sürücülər, otellər, transferlər, MICE — hamısı bir yerdə."),
    },
    {
      icon: Shield,
      title: tr("Guaranteed Quality", "Гарантия качества", "Keyfiyyət zəmanəti"),
      desc: tr("All guides and drivers are verified and rated.", "Все гиды и водители проверены и оценены.", "Bütün bələdçi və sürücülər yoxlanılıb və qiymətləndirilib."),
    },
    {
      icon: Star,
      title: tr("Partner Commission", "Комиссия партнёрам", "Tərəfdaş komissiyası"),
      desc: tr("Earn 10-20% commission on every booking you send us.", "Зарабатывайте 10-20% комиссию с каждого бронирования.", "Hər rezervasiyadan 10-20% komissiya qazanın."),
    },
    {
      icon: Briefcase,
      title: tr("Custom Itineraries", "Индивидуальные маршруты", "Fərdi marşrutlar"),
      desc: tr("We build custom programs for your clients on request.", "Мы создаём индивидуальные программы для ваших клиентов.", "Müştəriləriniz üçün fərdi proqramlar hazırlayırıq."),
    },
  ];

  const partnerTypes = [
    tr("Tour Operator", "Туроператор", "Tur operatoru"),
    tr("Travel Agency", "Турагентство", "Turizm agentliyi"),
    tr("MICE Agency", "MICE-агентство", "MICE agentliyi"),
    tr("Corporate Travel", "Корпоративные поездки", "Korporativ səyahət"),
    tr("Online Travel Agency (OTA)", "OTA (онлайн тревел агентство)", "Onlayn Turizm Agentliyi"),
    tr("Other", "Другое", "Digər"),
  ];

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    background: "#f8fafa",
    border: "1.5px solid #e2eded",
    color: "#0d1f1f",
    fontSize: 14,
    fontFamily: "DM Sans, sans-serif",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    color: "#4a6060",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    display: "block",
    marginBottom: 8,
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar locale={locale} />

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #021a1a 0%, #042e2e 60%, #065050 100%)", padding: "140px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, #2dd4bf 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 999, padding: "6px 16px", marginBottom: 24 }}>
            <Briefcase size={13} color="#c9a84c" />
            <span style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em" }}>
              {tr("B2B Partner Program", "Партнёрская программа B2B", "B2B Tərəfdaşlıq Proqramı")}
            </span>
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 24, maxWidth: 700 }}>
            {tr("Partner with Azerbaijan's", "Партнёрство с ведущим", "Azərbaycanın aparıcı")}
            <br />
            <span style={{ color: "#2dd4bf" }}>
              {tr("Leading DMC", "DMC Азербайджана", "DMC ilə tərəfdaşlıq")}
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.8, marginBottom: 40, maxWidth: 600 }}>
            {tr(
              "Net prices, dedicated support, and full DMC services for tour operators and travel agencies. No joining fee — you earn commission only after real bookings.",
"Net-цены, персональная поддержка и полный спектр DMC-услуг. Никаких вступительных взносов — комиссия только после реальных бронирований.",
              "Tur operatorları və turizm agentlikləri üçün net qiymətlər və tam DMC xidmətləri. Qoşulma haqqı yoxdur — komissiya yalnız real rezervasiyalardan sonra."
            )}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#apply"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #c9a84c, #d4a843)", color: "white", padding: "14px 32px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
              {tr("Apply Now", "Подать заявку", "İndi müraciət et")} <ArrowRight size={16} />
            </a>
            <Link href={`/${locale}/contact`}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "white", padding: "14px 32px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, border: "1.5px solid rgba(255,255,255,0.3)", fontFamily: "DM Sans, sans-serif" }}>
              {tr("Contact Us", "Связаться с нами", "Bizimlə əlaqə")}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "#021a1a", padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32, textAlign: "center" }}>
          {[
            { value: "50+", label: tr("Active Partners", "Активных партнёров", "Aktiv tərəfdaşlar") },
{ value: "10-20%", label: tr("Commission Rate", "Размер комиссии", "Komissiya dərəcəsi") },
{ value: "24/7", label: tr("Support Available", "Поддержка доступна", "Dəstək mövcuddur") },
{ value: "100%", label: tr("Net Prices", "Net-цены", "Net qiymətlər") },
          ].map(stat => (
            <div key={stat.label}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 40, fontWeight: 700, color: "#2dd4bf", lineHeight: 1, marginBottom: 8 }}>{stat.value}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div style={{ background: "#f0f7f7", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>
              {tr("Why Partner With Us", "Почему работать с нами", "Niyə bizimlə tərəfdaş olmalı")}
            </p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#021a1a", fontWeight: 400 }}>
              {tr("Partner Benefits", "Преимущества партнёрства", "Tərəfdaşlıq üstünlükləri")}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {benefits.map(b => (
              <div key={b.title} style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <b.icon size={22} color="#2dd4bf" />
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 10 }}>{b.title}</h3>
                <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: "white", padding: "96px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#021a1a", fontWeight: 400 }}>
              {tr("How It Works", "Как это работает", "Necə işləyir")}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            {[
              { step: "01", title: tr("Apply", "Подайте заявку", "Müraciət edin"), desc: tr("Fill out the partner application form below.", "Заполните форму заявки партнёра ниже.", "Aşağıdakı tərəfdaş müraciət formasını doldurun.") },
              { step: "02", title: tr("Get Approved", "Получите одобрение", "Təsdiq alın"), desc: tr("We review your application within 24 hours.", "Мы рассматриваем заявку в течение 24 часов.", "Müraciətinizi 24 saat ərzində nəzərdən keçiririk.") },
              { step: "03", title: tr("Access Net Prices", "Получите Net-цены", "Net qiymətlərə çıxış"), desc: tr("Get access to our full catalog with wholesale prices.", "Получите доступ к каталогу с оптовыми ценами.", "Topdansatış qiymətləri ilə tam kataloqumuza çıxış əldə edin.") },
              { step: "04", title: tr("Earn Commission", "Зарабатывайте", "Komissiya qazanın"), desc: tr("Send bookings and earn 10-20% commission.", "Отправляйте бронирования и зарабатывайте 10-20%.", "Rezervasiyalar göndərin və 10-20% komissiya qazanın.") },
            ].map(s => (
              <div key={s.step} style={{ textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <span style={{ color: "#2dd4bf", fontSize: 16, fontWeight: 700 }}>{s.step}</span>
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div id="apply" style={{ background: "#f0f7f7", padding: "96px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>
              {tr("Get Started", "Начать", "Başlayın")}
            </p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#021a1a", fontWeight: 400 }}>
              {tr("Apply for Partnership", "Подать заявку на партнёрство", "Tərəfdaşlıq üçün müraciət edin")}
            </h2>
          </div>

          {submitted ? (
            <div style={{ background: "white", borderRadius: 24, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Check size={32} color="white" />
              </div>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#021a1a", marginBottom: 12 }}>
                {tr("Application Received!", "Заявка получена!", "Müraciət qəbul edildi!")}
              </h3>
              <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.7 }}>
                {tr("Thank you! We will review your application and contact you within 24 hours.", "Спасибо! Мы рассмотрим вашу заявку и свяжемся с вами в течение 24 часов.", "Təşəkkür edirik! Müraciətinizi nəzərdən keçirəcək və 24 saat ərzində sizinlə əlaqə saxlayacağıq.")}
              </p>
            </div>
          ) : (
            <div style={{ background: "white", borderRadius: 24, padding: 36, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>{tr("Company Name", "Название компании", "Şirkətin adı")} *</label>
                  <input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })}
                    placeholder={tr("Your company", "Ваша компания", "Şirkətiniz")}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{tr("Contact Name", "Контактное лицо", "Əlaqə şəxsi")} *</label>
                  <input value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })}
                    placeholder={tr("Your name", "Ваше имя", "Adınız")}
                    style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    type="email" placeholder="company@email.com"
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{tr("Phone", "Телефон", "Telefon")}</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 234 567 890"
                    style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>{tr("Country", "Страна", "Ölkə")}</label>
                  <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                    placeholder={tr("Your country", "Ваша страна", "Ölkəniz")}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{tr("Company Type", "Тип компании", "Şirkətin növü")}</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    style={{ ...inputStyle, appearance: "none" }}>
                    <option value="">{tr("Select type", "Выберите тип", "Növü seçin")}</option>
                    {partnerTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>{tr("Message", "Сообщение", "Mesaj")}</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder={tr("Tell us about your business and what services you need...", "Расскажите о вашем бизнесе и какие услуги вам нужны...", "Biznesiniz və hansı xidmətlərə ehtiyacınız olduğu barədə bizə məlumat verin...")}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <button onClick={handleSubmit} disabled={sending || !form.companyName || !form.email || !form.contactName}
                style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: (!form.companyName || !form.email || !form.contactName) ? "#e2eded" : "linear-gradient(135deg, #c9a84c, #d4a843)", color: (!form.companyName || !form.email || !form.contactName) ? "#94a3a3" : "white", fontSize: 16, fontWeight: 600, cursor: (!form.companyName || !form.email || !form.contactName) ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {sending ? tr("Sending...", "Отправляем...", "Göndərilir...") : tr("Submit Application", "Отправить заявку", "Müraciəti göndər")}
                {!sending && <ArrowRight size={18} />}
              </button>

              <p style={{ textAlign: "center", marginTop: 16, color: "#94a3a3", fontSize: 12 }}>
                {tr("We will contact you within 24 hours after reviewing your application.", "Мы свяжемся с вами в течение 24 часов после рассмотрения заявки.", "Müraciətinizi nəzərdən keçirdikdən sonra 24 saat ərzində sizinlə əlaqə saxlayacağıq.")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}