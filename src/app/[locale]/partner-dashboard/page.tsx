"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Briefcase, Clock, Check, X, MapPin, Calendar, Users, ChevronRight, Download, FileText } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

interface PartnerQuote {
  id: string;
  routeName: string;
  arrivalDate: string;
  departureDate: string;
  pax: number;
  status: "pending" | "confirmed" | "cancelled";
  estimatedNetTotal: number;
  guideLanguage: string;
  hotelRequired: boolean;
  transferRequired: boolean;
  specialRequests: string;
  createdAt: string;
  clientName?: string;
  type?: string;
  items?: Array<{ name: string; quantity: number; netPrice: number }>;
}

export default function PartnerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [quotes, setQuotes] = useState<PartnerQuote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
    if (!loading && profile && profile.role !== "partner" && profile.role !== "admin") {
      router.push(`/${locale}/dashboard`);
    }
  }, [loading, profile]);

  useEffect(() => {
    if (profile) {
      const q = query(collection(db, "partnerQuotes"), where("partnerId", "==", profile.uid));
      getDocs(q).then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as PartnerQuote));
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setQuotes(data);
        setLoadingQuotes(false);
      });
    }
  }, [profile]);

  const generatePDF = async (quote: PartnerQuote, type: "quote" | "voucher") => {
    setGeneratingPdf(quote.id + type);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      const teal = [10, 112, 112] as [number, number, number];
      const dark = [2, 26, 26] as [number, number, number];
      const gold = [201, 168, 76] as [number, number, number];
      const gray = [74, 96, 96] as [number, number, number];
      const lightGray = [240, 247, 247] as [number, number, number];

      // Header background
      doc.setFillColor(...dark);
      doc.rect(0, 0, 210, 40, "F");

      // Company name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("CASPIAN ROUTES DMC", 20, 18);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(45, 212, 191);
      doc.text("B2B TRAVEL PARTNER IN AZERBAIJAN", 20, 26);

      // Document type badge
      doc.setFillColor(...gold);
      doc.roundedRect(140, 10, 55, 20, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(type === "quote" ? "QUOTE" : "VOUCHER", 167.5, 23, { align: "center" });

      // Document info
      doc.setFillColor(...lightGray);
      doc.rect(0, 40, 210, 20, "F");

      doc.setTextColor(...gray);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Document #: CR-${quote.id.slice(0, 8).toUpperCase()}`, 20, 52);
      doc.text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 90, 52);
      doc.text(`Status: ${quote.status.toUpperCase()}`, 150, 52);

      // Partner info
      doc.setTextColor(...dark);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(type === "quote" ? "Quote For:" : "Voucher For:", 20, 78);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...gray);
      doc.text(profile?.name || "Partner", 20, 86);
      doc.text(profile?.email || "", 20, 93);
      if ((profile as any)?.companyName) doc.text((profile as any).companyName, 20, 100);

      // Tour details box
      doc.setFillColor(...lightGray);
      doc.roundedRect(20, 108, 170, 60, 3, 3, "F");

      doc.setTextColor(...teal);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("TOUR DETAILS", 30, 120);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...dark);

      const details = [
        [`Route:`, quote.routeName || "Custom Tour"],
        [`Arrival:`, quote.arrivalDate || "—"],
        [`Departure:`, quote.departureDate || "—"],
        [`Passengers:`, `${quote.pax} pax`],
        [`Guide Language:`, quote.guideLanguage || "Any"],
      ];

      details.forEach(([label, value], i) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gray);
        doc.text(label, 30, 130 + i * 8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...dark);
        doc.text(value, 80, 130 + i * 8);
      });

      // Services included
      let y = 178;
      if (quote.hotelRequired || quote.transferRequired) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...teal);
        doc.text("SERVICES INCLUDED", 20, y);
        y += 10;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...gray);
        if (quote.hotelRequired) { doc.text("✓ Hotel Accommodation", 25, y); y += 7; }
        if (quote.transferRequired) { doc.text("✓ Airport Transfer", 25, y); y += 7; }
      }

      // Items (for itinerary type)
      if (quote.items && quote.items.length > 0) {
        y += 5;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...teal);
        doc.text("ITINERARY ITEMS", 20, y);
        y += 8;

        doc.setFillColor(...lightGray);
        doc.rect(20, y, 170, 8, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...gray);
        doc.text("Service", 25, y + 6);
        doc.text("Qty", 130, y + 6);
        doc.text("Price", 160, y + 6);
        y += 12;

        quote.items.forEach(item => {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...dark);
          doc.text(item.name, 25, y);
          doc.text(`x${item.quantity}`, 130, y);
          doc.text(`$${item.netPrice * item.quantity}`, 160, y);
          y += 7;
        });
      }

      // Special requests
      if (quote.specialRequests) {
        y += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...teal);
        doc.text("SPECIAL REQUESTS:", 20, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...gray);
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(quote.specialRequests, 160);
        doc.text(lines, 20, y);
        y += lines.length * 6 + 5;
      }

      // Price box
      y = Math.max(y + 10, 220);
      doc.setFillColor(...teal);
      doc.roundedRect(20, y, 170, 25, 3, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(type === "quote" ? "ESTIMATED NET TOTAL:" : "TOTAL:", 30, y + 10);
      doc.setFontSize(16);
      doc.text(`$${quote.estimatedNetTotal || 0}`, 30, y + 20);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(45, 212, 191);
      doc.text("Final price confirmed after review", 100, y + 15);

      // Footer
      doc.setFillColor(...dark);
      doc.rect(0, 272, 210, 25, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Caspian Routes DMC | Baku, Azerbaijan", 20, 282);
      doc.text("ealyarov55@gmail.com | caspian-routes.vercel.app", 20, 289);
      doc.setTextColor(45, 212, 191);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 130, 285);

      doc.save(`CaspianRoutes_${type === "quote" ? "Quote" : "Voucher"}_${quote.id.slice(0, 8)}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
    }
    setGeneratingPdf(null);
  };

  if (loading || !profile) return null;

  const filtered = filter === "all" ? quotes : quotes.filter(q => q.status === filter);

  const statusColor = { pending: "#c9a84c", confirmed: "#0a7070", cancelled: "#ef4444" };
  const statusBg = { pending: "rgba(201,168,76,0.1)", confirmed: "rgba(10,112,112,0.1)", cancelled: "rgba(239,68,68,0.1)" };
  const statusLabel = (s: string) => {
    if (s === "pending") return tr("Pending", "Ожидает", "Gözləyir");
    if (s === "confirmed") return tr("Confirmed", "Подтверждено", "Təsdiqləndi");
    return tr("Cancelled", "Отменено", "Ləğv edildi");
  };

  const stats = [
    { label: tr("Total Requests", "Всего запросов", "Ümumi sorğular"), value: quotes.length, color: "#0a7070" },
    { label: tr("Confirmed", "Подтверждено", "Təsdiqləndi"), value: quotes.filter(q => q.status === "confirmed").length, color: "#2dd4bf" },
    { label: tr("Pending", "Ожидает", "Gözləyir"), value: quotes.filter(q => q.status === "pending").length, color: "#c9a84c" },
    { label: tr("Cancelled", "Отменено", "Ləğv edildi"), value: quotes.filter(q => q.status === "cancelled").length, color: "#ef4444" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar locale={locale} />

      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 20px", height: 64, marginTop: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push(`/${locale}/dashboard`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <ArrowLeft size={14} /> {tr("Dashboard", "Панель", "Panel")}
          </button>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>
            {tr("My Requests", "Мои запросы", "Mənim sorğularım")}
          </span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 999, padding: "4px 14px" }}>
          <Briefcase size={12} color="#c9a84c" />
          <span style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {tr("Partner", "Партнёр", "Tərəfdaş")}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 16px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", textAlign: "center" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, fontWeight: 700, color: stat.color, marginBottom: 4 }}>{stat.value}</p>
              <p style={{ color: "#94a3a3", fontSize: 12 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
          <Link href={`/${locale}/partner-portal`}
            style={{ background: "linear-gradient(135deg, #021a1a, #0a7070)", borderRadius: 16, padding: "20px 24px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <MapPin size={20} color="#2dd4bf" />
            <div>
              <p style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{tr("Browse Catalog", "Каталог услуг", "Xidmət kataloqu")}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{tr("Net prices", "Net-цены", "Net qiymətlər")}</p>
            </div>
            <ChevronRight size={16} color="rgba(255,255,255,0.4)" style={{ marginLeft: "auto" }} />
          </Link>
          <Link href={`/${locale}/partner-quote`}
            style={{ background: "linear-gradient(135deg, #c9a84c, #d4a843)", borderRadius: 16, padding: "20px 24px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
            <Briefcase size={20} color="white" />
            <div>
              <p style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{tr("New Quote", "Новый запрос", "Yeni sorğu")}</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{tr("Request price", "Запросить цену", "Qiymət sorğusu")}</p>
            </div>
            <ChevronRight size={16} color="rgba(255,255,255,0.6)" style={{ marginLeft: "auto" }} />
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {(["all", "pending", "confirmed", "cancelled"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 16px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "DM Sans, sans-serif", background: filter === f ? "#021a1a" : "white", color: filter === f ? "white" : "#4a6060", boxShadow: "0 2px 8px rgba(4,46,46,0.06)", transition: "all 0.2s" }}>
              {f === "all" ? tr("All", "Все", "Hamısı") : statusLabel(f)} ({f === "all" ? quotes.length : quotes.filter(q => q.status === f).length})
            </button>
          ))}
        </div>

        {/* Quotes list */}
        {loadingQuotes ? (
          <p style={{ color: "#94a3a3", textAlign: "center", padding: 40 }}>{tr("Loading...", "Загружаем...", "Yüklənir...")}</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
            <Briefcase size={48} color="#e2eded" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 8 }}>
              {tr("No requests yet", "Запросов пока нет", "Hələ sorğu yoxdur")}
            </h3>
            <p style={{ color: "#94a3a3", fontSize: 14, marginBottom: 24 }}>
              {tr("Start by requesting a quote for your clients", "Начните с запроса цены для ваших клиентов", "Müştəriləriniz üçün qiymət sorğusu göndərməklə başlayın")}
            </p>
            <Link href={`/${locale}/partner-quote`}
              style={{ display: "inline-block", background: "linear-gradient(135deg, #c9a84c, #d4a843)", color: "white", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "DM Sans, sans-serif" }}>
              {tr("Request a Quote", "Запросить цену", "Qiymət sorğusu")}
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map(quote => (
              <div key={quote.id} style={{
                background: "white", borderRadius: 20, padding: 20,
                boxShadow: "0 4px 24px rgba(4,46,46,0.08)",
                border: quote.status === "confirmed" ? "1.5px solid rgba(10,112,112,0.2)" :
                        quote.status === "pending" ? "1.5px solid rgba(201,168,76,0.2)" : "1.5px solid transparent"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600, marginBottom: 4 }}>
                      {quote.routeName || tr("Custom Tour", "Индивидуальный тур", "Fərdi tur")}
                    </h3>
                    <p style={{ color: "#94a3a3", fontSize: 12 }}>
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, background: statusBg[quote.status], color: statusColor[quote.status], fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {quote.status === "pending" && <Clock size={12} />}
                    {quote.status === "confirmed" && <Check size={12} />}
                    {quote.status === "cancelled" && <X size={12} />}
                    {statusLabel(quote.status)}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 14 }}>
                  <div style={{ background: "#f8fafa", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                      <Calendar size={11} color="#94a3a3" />
                      <p style={{ color: "#94a3a3", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>{tr("Arrival", "Приезд", "Gəliş")}</p>
                    </div>
                    <p style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{quote.arrivalDate}</p>
                  </div>
                  <div style={{ background: "#f8fafa", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                      <Users size={11} color="#94a3a3" />
                      <p style={{ color: "#94a3a3", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>{tr("Pax", "Человек", "Nəfər")}</p>
                    </div>
                    <p style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{quote.pax}</p>
                  </div>
                  <div style={{ background: "#f8fafa", borderRadius: 10, padding: "10px 14px" }}>
                    <p style={{ color: "#94a3a3", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{tr("Net Total", "Net-сумма", "Net cəmi")}</p>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", color: "#0a7070", fontSize: 20, fontWeight: 700 }}>
                      ${quote.estimatedNetTotal || "TBD"}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {quote.hotelRequired && <span style={{ fontSize: 11, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "4px 10px", borderRadius: 999 }}>🏨 {tr("Hotel", "Отель", "Otel")}</span>}
                  {quote.transferRequired && <span style={{ fontSize: 11, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "4px 10px", borderRadius: 999 }}>✈️ {tr("Transfer", "Трансфер", "Transfer")}</span>}
                  {quote.guideLanguage && <span style={{ fontSize: 11, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "4px 10px", borderRadius: 999 }}>🌐 {quote.guideLanguage}</span>}
                </div>

                {quote.status === "confirmed" && (
                  <div style={{ background: "rgba(10,112,112,0.06)", border: "1px solid rgba(10,112,112,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <Check size={14} color="#0a7070" />
                    <p style={{ color: "#065050", fontSize: 13 }}>
                      {tr("Quote confirmed! We will send you the full proposal shortly.", "Запрос подтверждён! Мы скоро пришлём полное КП.", "Sorğu təsdiqləndi! Tezliklə tam kommersiya təklifi göndərəcəyik.")}
                    </p>
                  </div>
                )}

                {/* PDF Buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={() => generatePDF(quote, "quote")}
                    disabled={generatingPdf === quote.id + "quote"}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1.5px solid rgba(10,112,112,0.3)", background: "white", color: "#0a7070", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                    <FileText size={14} />
                    {generatingPdf === quote.id + "quote"
                      ? tr("Generating...", "Генерируем...", "Hazırlanır...")
                      : tr("Download Quote PDF", "Скачать Quote PDF", "Quote PDF yüklə")}
                  </button>
                  {quote.status === "confirmed" && (
                    <button
                      onClick={() => generatePDF(quote, "voucher")}
                      disabled={generatingPdf === quote.id + "voucher"}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                      <Download size={14} />
                      {generatingPdf === quote.id + "voucher"
                        ? tr("Generating...", "Генерируем...", "Hazırlanır...")
                        : tr("Download Voucher", "Скачать Ваучер", "Voucher yüklə")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}