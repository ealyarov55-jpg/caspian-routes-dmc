"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Plus, Trash2, Send, Check, MapPin, Clock, Users, Briefcase, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const SERVICES = {
  routes: [
    { id: "baku-city-tour", name: { en: "Baku City Tour", ru: "Тур по Баку", az: "Bakı Şəhər Turu" }, duration: "3 days", netPrice: 800 },
    { id: "absheron-peninsula", name: { en: "Absheron Peninsula", ru: "Апшеронский полуостров", az: "Abşeron Yarımadası" }, duration: "2 days", netPrice: 350 },
    { id: "sheki-silk-road", name: { en: "Sheki & Silk Road", ru: "Шеки и Шёлковый путь", az: "Şəki və İpək Yolu" }, duration: "4 days", netPrice: 560 },
    { id: "caspian-sea-cruise", name: { en: "Caspian Sea Cruise", ru: "Круиз по Каспию", az: "Xəzər Dənizi Kruizi" }, duration: "5 days", netPrice: 960 },
  ],
  hotels: [
    { id: "hotel-baku-5star", name: { en: "5★ Baku City Hotel", ru: "5★ Отель в Баку", az: "5★ Bakı Oteli" }, duration: "per night", netPrice: 180 },
    { id: "hotel-baku-4star", name: { en: "4★ Baku Hotel", ru: "4★ Отель в Баку", az: "4★ Bakı Oteli" }, duration: "per night", netPrice: 90 },
    { id: "hotel-sheki", name: { en: "Sheki Hotel", ru: "Отель в Шеки", az: "Şəki Oteli" }, duration: "per night", netPrice: 70 },
  ],
  transfers: [
    { id: "airport-transfer", name: { en: "Airport Transfer", ru: "Трансфер из аэропорта", az: "Hava limanı transferi" }, duration: "1 way", netPrice: 40 },
    { id: "city-transfer", name: { en: "City Transfer", ru: "Городской трансфер", az: "Şəhər transferi" }, duration: "per day", netPrice: 60 },
    { id: "intercity-transfer", name: { en: "Intercity Transfer", ru: "Межгородской трансфер", az: "Şəhərlərarası transfer" }, duration: "one way", netPrice: 120 },
  ],
  guides: [
    { id: "english-guide", name: { en: "English Speaking Guide", ru: "Англоязычный гид", az: "İngilis dilli bələdçi" }, duration: "per day", netPrice: 80 },
    { id: "russian-guide", name: { en: "Russian Speaking Guide", ru: "Русскоязычный гид", az: "Rus dilli bələdçi" }, duration: "per day", netPrice: 70 },
    { id: "arabic-guide", name: { en: "Arabic Speaking Guide", ru: "Арабоязычный гид", az: "Ərəb dilli bələdçi" }, duration: "per day", netPrice: 90 },
  ],
};

interface ItineraryItem {
  id: string;
  category: string;
  serviceId: string;
  name: string;
  netPrice: number;
  quantity: number;
  notes: string;
}

export default function ItineraryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<"routes" | "hotels" | "transfers" | "guides">("routes");
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [pax, setPax] = useState(2);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
    if (!loading && profile && profile.role !== "partner" && profile.role !== "admin") {
      router.push(`/${locale}/dashboard`);
    }
  }, [loading, profile]);

  if (loading || !profile) return null;

  const addItem = (category: string, service: any) => {
    const existing = items.find(i => i.serviceId === service.id);
    if (existing) {
      setItems(prev => prev.map(i => i.serviceId === service.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems(prev => [...prev, {
        id: `${service.id}-${Date.now()}`,
        category,
        serviceId: service.id,
        name: service.name[lang as keyof typeof service.name],
        netPrice: service.netPrice,
        quantity: 1,
        notes: "",
      }]);
    }
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const totalNet = items.reduce((sum, i) => sum + i.netPrice * i.quantity, 0);

  const handleSubmit = async () => {
    if (!profile || items.length === 0 || !startDate) return;
    setSending(true);

    await addDoc(collection(db, "partnerQuotes"), {
      partnerId: profile.uid,
      partnerName: profile.name,
      partnerEmail: profile.email,
      type: "itinerary",
      clientName,
      startDate,
      pax,
      notes,
      items: items.map(i => ({ name: i.name, quantity: i.quantity, netPrice: i.netPrice, category: i.category })),
      estimatedNetTotal: totalNet,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "partner_itinerary",
        itinerary: {
          partnerName: profile.name,
          partnerEmail: profile.email,
          clientName,
          startDate,
          pax,
          items: items.map(i => `${i.name} x${i.quantity} = $${i.netPrice * i.quantity}`).join(", "),
          totalNet,
          notes,
        },
      }),
    });

    setSending(false);
    setSubmitted(true);
  };

  const categories = [
    { key: "routes", label: tr("Routes", "Маршруты", "Marşrutlar"), icon: MapPin },
    { key: "hotels", label: tr("Hotels", "Отели", "Otellər"), icon: Briefcase },
    { key: "transfers", label: tr("Transfers", "Трансферы", "Transferlər"), icon: Clock },
    { key: "guides", label: tr("Guides", "Гиды", "Bələdçilər"), icon: Users },
  ];

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
            {tr("Itinerary Builder", "Конструктор маршрутов", "Marşrut qurucusu")}
          </span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 999, padding: "4px 14px" }}>
          <Briefcase size={12} color="#c9a84c" />
          <span style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {tr("Partner", "Партнёр", "Tərəfdaş")}
          </span>
        </div>
      </div>

      {submitted ? (
        <div style={{ maxWidth: 500, margin: "80px auto", padding: 24, textAlign: "center" }}>
          <div style={{ background: "white", borderRadius: 24, padding: 48, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Check size={32} color="white" />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#021a1a", marginBottom: 12 }}>
              {tr("Itinerary Sent!", "Маршрут отправлен!", "Marşrut göndərildi!")}
            </h2>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              {tr("We will prepare the full quote and send it within 2 hours.", "Мы подготовим полное КП и отправим в течение 2 часов.", "2 saat ərzində tam kommersiya təklifi hazırlayacağıq.")}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={`/${locale}/partner-dashboard`}
                style={{ display: "inline-block", background: "linear-gradient(135deg, #c9a84c, #d4a843)", color: "white", padding: "14px 28px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                {tr("My Requests", "Мои запросы", "Sorğularım")}
              </Link>
              <Link href={`/${locale}/itinerary`}
                style={{ display: "inline-block", background: "white", border: "1.5px solid #e2eded", color: "#021a1a", padding: "14px 28px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                {tr("New Itinerary", "Новый маршрут", "Yeni marşrut")}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="itinerary-grid">
            <style>{`
              @media (min-width: 900px) {
                .itinerary-grid { grid-template-columns: 1fr 380px !important; }
              }
            `}</style>

            {/* Left — Service catalog */}
            <div>
              {/* Client info */}
              <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", marginBottom: 16, fontWeight: 600 }}>
                  {tr("Trip Details", "Детали поездки", "Səyahət detalları")}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ color: "#4a6060", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                      {tr("Client Name", "Имя клиента", "Müştərinin adı")}
                    </label>
                    <input value={clientName} onChange={e => setClientName(e.target.value)}
                      placeholder={tr("Client or group name", "Имя клиента или группы", "Müştəri və ya qrup adı")}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: 12, background: "#f8fafa", border: "1.5px solid #e2eded", color: "#021a1a", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ color: "#4a6060", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                      {tr("Start Date", "Дата начала", "Başlama tarixi")} *
                    </label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: 12, background: "#f8fafa", border: "1.5px solid #e2eded", color: "#021a1a", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ color: "#4a6060", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                      {tr("Pax", "Человек", "Nəfər")}
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button onClick={() => setPax(p => Math.max(1, p - 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", fontSize: 18, color: "#4a6060", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#021a1a", minWidth: 30, textAlign: "center" }}>{pax}</span>
                      <button onClick={() => setPax(p => Math.min(100, p + 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", fontSize: 18, color: "#4a6060", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                  </div>
                  <div>
                    <label style={{ color: "#4a6060", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                      {tr("Notes", "Примечания", "Qeydlər")}
                    </label>
                    <input value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder={tr("Special requirements...", "Особые пожелания...", "Xüsusi tələblər...")}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: 12, background: "#f8fafa", border: "1.5px solid #e2eded", color: "#021a1a", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
              </div>

              {/* Category tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {categories.map(cat => (
                  <button key={cat.key} onClick={() => setActiveCategory(cat.key as any)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "DM Sans, sans-serif", background: activeCategory === cat.key ? "#021a1a" : "white", color: activeCategory === cat.key ? "white" : "#4a6060", boxShadow: "0 2px 8px rgba(4,46,46,0.06)", transition: "all 0.2s" }}>
                    <cat.icon size={14} />
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Services list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {SERVICES[activeCategory].map((service: any) => {
                  const inItinerary = items.find(i => i.serviceId === service.id);
                  return (
                    <div key={service.id} style={{ background: "white", borderRadius: 16, padding: "16px 20px", boxShadow: "0 4px 24px rgba(4,46,46,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, border: inItinerary ? "1.5px solid rgba(10,112,112,0.3)" : "1.5px solid transparent", transition: "all 0.2s" }}>
                      <div>
                        <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 15 }}>{service.name[lang as keyof typeof service.name]}</p>
                        <p style={{ color: "#94a3a3", fontSize: 12 }}>{service.duration}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 10, color: "#94a3a3", textTransform: "uppercase", letterSpacing: "0.1em" }}>{tr("Net", "Net", "Net")}</p>
                          <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#0a7070" }}>${service.netPrice}</p>
                        </div>
                        <button onClick={() => addItem(activeCategory, service)}
                          style={{ width: 36, height: 36, borderRadius: "50%", border: "none", background: inItinerary ? "#0a7070" : "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right — Itinerary summary */}
            <div style={{ position: "sticky", top: 24, alignSelf: "start" }}>
              <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", marginBottom: 20 }}>
                  {tr("Your Itinerary", "Ваш маршрут", "Sizin marşrutunuz")}
                </h3>

                {items.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <MapPin size={36} color="#e2eded" style={{ marginBottom: 12 }} />
                    <p style={{ color: "#94a3a3", fontSize: 14 }}>
                      {tr("Add services from the catalog", "Добавьте услуги из каталога", "Kataloqdan xidmət əlavə edin")}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "#f8fafa", borderRadius: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#021a1a", marginBottom: 2 }}>{item.name}</p>
                          <p style={{ fontSize: 11, color: "#94a3a3" }}>${item.netPrice} × {item.quantity} = ${item.netPrice * item.quantity}</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid #e2eded", background: "white", cursor: "pointer", fontSize: 14, color: "#4a6060", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#021a1a", minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid #e2eded", background: "white", cursor: "pointer", fontSize: 14, color: "#4a6060", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {items.length > 0 && (
                  <div style={{ background: "rgba(10,112,112,0.06)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#4a6060", fontSize: 14 }}>{tr("Total Net", "Итого Net", "Cəmi Net")}</span>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, fontWeight: 700, color: "#0a7070" }}>${totalNet}</span>
                    </div>
                    <p style={{ color: "#94a3a3", fontSize: 11, marginTop: 4 }}>{tr("Final price confirmed after review", "Финальная цена после подтверждения", "Yekun qiymət nəzərdən keçirildikdən sonra")}</p>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={items.length === 0 || !startDate || sending}
                  style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: (items.length === 0 || !startDate) ? "#e2eded" : "linear-gradient(135deg, #0a7070, #0d9090)", color: (items.length === 0 || !startDate) ? "#94a3a3" : "white", fontSize: 15, fontWeight: 600, cursor: (items.length === 0 || !startDate) ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Send size={16} />
                  {sending ? tr("Sending...", "Отправляем...", "Göndərilir...") : tr("Send Itinerary", "Отправить маршрут", "Marşrutu göndər")}
                </button>

                <p style={{ fontSize: 11, color: "#94a3a3", textAlign: "center", marginTop: 12 }}>
                  {tr("We reply within 2 hours", "Отвечаем в течение 2 часов", "2 saat ərzində cavab veririk")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}