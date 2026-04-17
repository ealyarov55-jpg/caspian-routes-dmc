"use client";

import { useState, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Send, Check, Calendar, Users, MapPin, MessageSquare, Briefcase } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const ROUTES_LIST = [
  { id: "baku-city-tour", title: { en: "Baku City Tour", ru: "Тур по Баку", az: "Bakı Şəhər Turu" }, netPrice: 800, duration: "3 days" },
  { id: "absheron-peninsula", title: { en: "Absheron Peninsula", ru: "Апшеронский полуостров", az: "Abşeron Yarımadası" }, netPrice: 350, duration: "2 days" },
  { id: "sheki-silk-road", title: { en: "Sheki & Silk Road", ru: "Шеки и Шёлковый путь", az: "Şəki və İpək Yolu" }, netPrice: 560, duration: "4 days" },
  { id: "caspian-sea-cruise", title: { en: "Caspian Sea Cruise", ru: "Круиз по Каспию", az: "Xəzər Dənizi Kruizi" }, netPrice: 960, duration: "5 days" },
];

export default function PartnerQuotePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [form, setForm] = useState({
    routeId: searchParams.get("route") || "",
    arrivalDate: "",
    departureDate: "",
    pax: 2,
    hotelRequired: false,
    transferRequired: false,
    guideLanguage: "",
    specialRequests: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
    if (!loading && profile && profile.role !== "partner" && profile.role !== "admin") {
      router.push(`/${locale}/partner-portal`);
    }
  }, [loading, profile]);

  const selectedRoute = ROUTES_LIST.find(r => r.id === form.routeId);
  const estimatedTotal = selectedRoute ? selectedRoute.netPrice * Math.ceil(form.pax / 2) : 0;

  const handleSubmit = async () => {
    if (!form.routeId || !form.arrivalDate || !profile) return;
    setSending(true);
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "partner_quote",
        quote: {
          partnerName: profile.name,
          partnerEmail: profile.email,
          routeId: form.routeId,
          routeName: selectedRoute?.title[lang as keyof typeof selectedRoute.title] || form.routeId,
          arrivalDate: form.arrivalDate,
          departureDate: form.departureDate,
          pax: form.pax,
          hotelRequired: form.hotelRequired,
          transferRequired: form.transferRequired,
          guideLanguage: form.guideLanguage,
          specialRequests: form.specialRequests,
          estimatedNetTotal: estimatedTotal,
        },
      }),
    });
    setSending(false);
    setSubmitted(true);
  };

  if (loading || !profile) return null;

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 12,
    background: "#f8fafa", border: "1.5px solid #e2eded",
    color: "#0d1f1f", fontSize: 14, fontFamily: "DM Sans, sans-serif",
    outline: "none", boxSizing: "border-box" as const,
  };

  const labelStyle = {
    color: "#4a6060", fontSize: 12, fontWeight: 600,
    textTransform: "uppercase" as const, letterSpacing: "0.1em",
    display: "block", marginBottom: 8,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar locale={locale} />

      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 20px", height: 64, marginTop: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push(`/${locale}/partner-portal`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <ArrowLeft size={14} /> {tr("Portal", "Портал", "Portal")}
          </button>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>
            {tr("Request a Quote", "Запросить цену", "Qiymət sorğusu")}
          </span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 999, padding: "4px 14px" }}>
          <Briefcase size={12} color="#c9a84c" />
          <span style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {tr("Partner", "Партнёр", "Tərəfdaş")}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>

        {submitted ? (
          <div style={{ background: "white", borderRadius: 24, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(4,46,46,0.08)", maxWidth: 500, margin: "40px auto" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Check size={32} color="white" />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#021a1a", marginBottom: 12 }}>
              {tr("Quote Request Sent!", "Запрос отправлен!", "Sorğu göndərildi!")}
            </h2>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              {tr(
                "We will prepare your quote and send it to your email within 2 hours.",
                "Мы подготовим коммерческое предложение и отправим его на ваш email в течение 2 часов.",
                "Kommersiya təklifini hazırlayacaq və 2 saat ərzində e-poçtunuza göndərəcəyik."
              )}
            </p>
            <Link href={`/${locale}/partner-portal`}
              style={{ display: "inline-block", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "14px 32px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
              {tr("Back to Portal", "Вернуться в портал", "Portala qayıt")}
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="quote-grid">
            <style>{`
              @media (min-width: 768px) {
                .quote-grid { grid-template-columns: 1fr 320px !important; }
              }
            `}</style>

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Route selection */}
              <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <MapPin size={18} color="#0a7070" />
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                    {tr("Select Route", "Выберите маршрут", "Marşrut seçin")}
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ROUTES_LIST.map(route => (
                    <button key={route.id} onClick={() => setForm({ ...form, routeId: route.id })}
                      style={{ padding: "14px 16px", borderRadius: 14, border: form.routeId === route.id ? "2px solid #0a7070" : "1.5px solid #e2eded", background: form.routeId === route.id ? "rgba(10,112,112,0.06)" : "white", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", textAlign: "left" }}>
                      <div>
                        <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 15, fontFamily: "DM Sans, sans-serif" }}>{route.title[lang as keyof typeof route.title]}</p>
                        <p style={{ color: "#94a3a3", fontSize: 12, fontFamily: "DM Sans, sans-serif" }}>{route.duration}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 10, color: "#94a3a3", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{tr("Net from", "Net от", "Net-dən")}</p>
                        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#0a7070" }}>${route.netPrice}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates & Pax */}
              <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <Calendar size={18} color="#0a7070" />
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                    {tr("Travel Details", "Детали поездки", "Səyahət detalları")}
                  </h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle}>{tr("Arrival Date", "Дата приезда", "Gəliş tarixi")} *</label>
                    <input type="date" value={form.arrivalDate} onChange={e => setForm({ ...form, arrivalDate: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>{tr("Departure Date", "Дата отъезда", "Ayrılış tarixi")}</label>
                    <input type="date" value={form.departureDate} onChange={e => setForm({ ...form, departureDate: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>{tr("Number of Pax", "Количество человек", "Nəfər sayı")}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button onClick={() => setForm({ ...form, pax: Math.max(1, form.pax - 1) })}
                      style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", fontSize: 20, color: "#4a6060", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: "#021a1a", minWidth: 40, textAlign: "center" }}>{form.pax}</span>
                    <button onClick={() => setForm({ ...form, pax: Math.min(100, form.pax + 1) })}
                      style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", fontSize: 20, color: "#4a6060", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    <span style={{ color: "#94a3a3", fontSize: 14 }}>{tr("persons", "человек", "nəfər")}</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{tr("Guide Language", "Язык гида", "Bələdçi dili")}</label>
                  <select value={form.guideLanguage} onChange={e => setForm({ ...form, guideLanguage: e.target.value })} style={{ ...inputStyle, appearance: "none" }}>
                    <option value="">{tr("Any language", "Любой язык", "İstənilən dil")}</option>
                    <option value="English">English</option>
                    <option value="Russian">Русский</option>
                    <option value="German">Deutsch</option>
                    <option value="French">Français</option>
                    <option value="Arabic">العربية</option>
                  </select>
                </div>
              </div>

              {/* Additional Services */}
              <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <Users size={18} color="#0a7070" />
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                    {tr("Additional Services", "Дополнительные услуги", "Əlavə xidmətlər")}
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { key: "hotelRequired", label: tr("Hotel accommodation needed", "Нужно размещение в отеле", "Otel yerləşdirməsi lazımdır") },
                    { key: "transferRequired", label: tr("Airport transfer needed", "Нужен трансфер из аэропорта", "Hava limanı transferi lazımdır") },
                  ].map(item => (
                    <label key={item.key} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                      <input type="checkbox"
                        checked={form[item.key as keyof typeof form] as boolean}
                        onChange={e => setForm({ ...form, [item.key]: e.target.checked })}
                        style={{ width: 18, height: 18, accentColor: "#0a7070", cursor: "pointer" }} />
                      <span style={{ color: "#4a6060", fontSize: 14 }}>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <MessageSquare size={18} color="#0a7070" />
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                    {tr("Special Requests", "Особые пожелания", "Xüsusi istəklər")}
                  </h3>
                </div>
                <textarea value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })}
                  placeholder={tr("VIP clients, dietary requirements, accessibility needs, custom itinerary requests...", "VIP клиенты, диетические требования, доступность, индивидуальный маршрут...", "VIP müştərilər, pəhriz tələbləri, əlçatımlılıq, fərdi marşrut...")}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>

            {/* Summary */}
            <div style={{ position: "sticky", top: 24, alignSelf: "start" }}>
              <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", marginBottom: 20 }}>
                  {tr("Quote Summary", "Сводка запроса", "Sorğu xülasəsi")}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3a3", fontSize: 13 }}>{tr("Route", "Маршрут", "Marşrut")}</span>
                    <span style={{ color: selectedRoute ? "#021a1a" : "#e2eded", fontSize: 13, fontWeight: 600, textAlign: "right", maxWidth: 160 }}>
                      {selectedRoute ? selectedRoute.title[lang as keyof typeof selectedRoute.title] : tr("Not selected", "Не выбрано", "Seçilməyib")}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3a3", fontSize: 13 }}>{tr("Arrival", "Приезд", "Gəliş")}</span>
                    <span style={{ color: form.arrivalDate ? "#021a1a" : "#e2eded", fontSize: 13, fontWeight: 600 }}>
                      {form.arrivalDate || tr("Not set", "Не указано", "Qeyd edilməyib")}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3a3", fontSize: 13 }}>{tr("Pax", "Человек", "Nəfər")}</span>
                    <span style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{form.pax}</span>
                  </div>
                  {form.hotelRequired && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3a3", fontSize: 13 }}>{tr("Hotel", "Отель", "Otel")}</span>
                      <span style={{ color: "#0a7070", fontSize: 13, fontWeight: 600 }}>✓</span>
                    </div>
                  )}
                  {form.transferRequired && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#94a3a3", fontSize: 13 }}>{tr("Transfer", "Трансфер", "Transfer")}</span>
                      <span style={{ color: "#0a7070", fontSize: 13, fontWeight: 600 }}>✓</span>
                    </div>
                  )}
                </div>

                {selectedRoute && (
                  <div style={{ background: "rgba(10,112,112,0.06)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                    <p style={{ color: "#4a6060", fontSize: 12, marginBottom: 4 }}>{tr("Estimated Net Total", "Примерная Net-сумма", "Təxmini Net cəmi")}</p>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 700, color: "#0a7070" }}>${estimatedTotal}</p>
                    <p style={{ color: "#94a3a3", fontSize: 11, marginTop: 4 }}>{tr("Final price in quote", "Финальная цена в КП", "Yekun qiymət kommersiya təklifində")}</p>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={!form.routeId || !form.arrivalDate || sending}
                  style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: (!form.routeId || !form.arrivalDate) ? "#e2eded" : "linear-gradient(135deg, #0a7070, #0d9090)", color: (!form.routeId || !form.arrivalDate) ? "#94a3a3" : "white", fontSize: 15, fontWeight: 600, cursor: (!form.routeId || !form.arrivalDate) ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: (form.routeId && form.arrivalDate) ? "0 8px 24px rgba(10,112,112,0.3)" : "none" }}>
                  <Send size={16} />
                  {sending ? tr("Sending...", "Отправляем...", "Göndərilir...") : tr("Send Quote Request", "Отправить запрос", "Sorğu göndər")}
                </button>

                <p style={{ fontSize: 11, color: "#94a3a3", textAlign: "center", marginTop: 12 }}>
                  {tr("We reply within 2 hours during business hours.", "Отвечаем в течение 2 часов в рабочее время.", "İş saatlarında 2 saat ərzində cavab veririk.")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}