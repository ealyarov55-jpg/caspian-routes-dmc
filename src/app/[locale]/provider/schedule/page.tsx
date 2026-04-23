"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Calendar, Users, Phone, Mail, MapPin, Check, Clock, ChevronRight, Navigation } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  routeName: string;
  date: string;
  guests: number;
  message: string;
  status: "pending" | "confirmed" | "cancelled" | "started" | "completed";
  pricePerDay: string;
  createdAt: string;
}

export default function ProviderSchedulePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeDay, setActiveDay] = useState<"today" | "tomorrow" | "week">("today");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
    if (!loading && profile?.role !== "provider") router.push(`/${locale}/dashboard`);
  }, [loading, profile]);

  useEffect(() => {
    if (profile) {
      const q = query(collection(db, "bookings"), where("providerId", "==", profile.uid));
      getDocs(q).then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
        data.sort((a, b) => a.date.localeCompare(b.date));
        setBookings(data);
        setLoadingBookings(false);
      });
    }
  }, [profile]);

  const updateTourStatus = async (bookingId: string, status: "started" | "completed") => {
    setUpdatingId(bookingId);
    await updateDoc(doc(db, "bookings", bookingId), { status });
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    setUpdatingId(null);
  };

  const getFilteredBookings = () => {
    if (activeDay === "today") return bookings.filter(b => b.date === todayStr && b.status !== "cancelled");
    if (activeDay === "tomorrow") return bookings.filter(b => b.date === tomorrowStr && b.status !== "cancelled");
    return bookings.filter(b => weekDates.includes(b.date) && b.status !== "cancelled");
  };

  const filtered = getFilteredBookings();
  const todayBookings = bookings.filter(b => b.date === todayStr && b.status !== "cancelled");
  const tomorrowBookings = bookings.filter(b => b.date === tomorrowStr && b.status !== "cancelled");
  const weekBookings = bookings.filter(b => weekDates.includes(b.date) && b.status !== "cancelled");

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === "ru" ? "ru-RU" : lang === "az" ? "az-AZ" : "en-GB", { weekday: "long", day: "numeric", month: "long" });
  };

  const statusColor = (s: string) => {
    if (s === "confirmed") return "#0a7070";
    if (s === "started") return "#c9a84c";
    if (s === "completed") return "#065050";
    return "#94a3a3";
  };

  const statusBg = (s: string) => {
    if (s === "confirmed") return "rgba(10,112,112,0.1)";
    if (s === "started") return "rgba(201,168,76,0.1)";
    if (s === "completed") return "rgba(6,80,80,0.1)";
    return "rgba(148,163,163,0.1)";
  };

  const statusLabel = (s: string) => {
    if (s === "confirmed") return tr("Confirmed", "Подтверждено", "Təsdiqləndi");
    if (s === "started") return tr("Tour Started", "Тур начат", "Tur başladı");
    if (s === "completed") return tr("Completed", "Завершён", "Tamamlandı");
    return tr("Pending", "Ожидает", "Gözləyir");
  };

  if (loading || !profile) return null;

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
            {tr("My Schedule", "Моё расписание", "Mənim cədvəlim")}
          </span>
        </div>
        {todayBookings.length > 0 && (
          <div style={{ background: "#c9a84c", borderRadius: 999, padding: "4px 14px" }}>
            <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
              {todayBookings.length} {tr("tour(s) today", "тур(ов) сегодня", "bu gün tur")}
            </span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 16px" }}>

        {/* Today summary card */}
        <div style={{ background: "linear-gradient(135deg, #021a1a 0%, #0a7070 100%)", borderRadius: 20, padding: "24px 28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(45,212,191,0.08)" }} />
          <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>
            {tr("Today", "Сегодня", "Bu gün")} — {formatDate(todayStr)}
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{todayBookings.length}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{tr("tours scheduled", "туров запланировано", "planlanmış tur")}</p>
            </div>
            <div>
              <p style={{ fontFamily: "Cormorant Garamond, serif", color: "#2dd4bf", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>
                ${todayBookings.reduce((sum, b) => sum + (Number(b.pricePerDay) * b.guests || 0), 0)}
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{tr("expected earnings", "ожидаемый заработок", "gözlənilən qazanc")}</p>
            </div>
          </div>
        </div>

        {/* Day tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { key: "today", label: tr("Today", "Сегодня", "Bu gün"), count: todayBookings.length },
            { key: "tomorrow", label: tr("Tomorrow", "Завтра", "Sabah"), count: tomorrowBookings.length },
            { key: "week", label: tr("This Week", "Эта неделя", "Bu həftə"), count: weekBookings.length },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveDay(tab.key as any)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "DM Sans, sans-serif", background: activeDay === tab.key ? "#021a1a" : "white", color: activeDay === tab.key ? "white" : "#4a6060", boxShadow: "0 2px 8px rgba(4,46,46,0.06)", transition: "all 0.2s" }}>
              {tab.label}
              {tab.count > 0 && (
                <span style={{ background: activeDay === tab.key ? "rgba(45,212,191,0.3)" : "rgba(10,112,112,0.1)", color: activeDay === tab.key ? "#2dd4bf" : "#0a7070", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loadingBookings ? (
          <p style={{ color: "#94a3a3", textAlign: "center", padding: 40 }}>{tr("Loading...", "Загружаем...", "Yüklənir...")}</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
            <Calendar size={48} color="#e2eded" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", marginBottom: 8 }}>
              {tr("No tours scheduled", "Туров не запланировано", "Planlanmış tur yoxdur")}
            </h3>
            <p style={{ color: "#94a3a3", fontSize: 14 }}>
              {tr("No confirmed bookings for this period", "Нет подтверждённых бронирований на этот период", "Bu dövr üçün təsdiqlənmiş rezervasiya yoxdur")}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map(booking => (
              <div key={booking.id} style={{
                background: "white", borderRadius: 20, overflow: "hidden",
                boxShadow: booking.status === "started" ? "0 8px 32px rgba(201,168,76,0.2)" : "0 4px 24px rgba(4,46,46,0.08)",
                border: booking.status === "started" ? "2px solid #c9a84c" : "1.5px solid transparent"
              }}>
                {/* Date bar */}
                {activeDay === "week" && (
                  <div style={{ background: "#f8fafa", padding: "8px 20px", borderBottom: "1px solid #f0f7f7" }}>
                    <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 600 }}>{formatDate(booking.date)}</p>
                  </div>
                )}

                <div style={{ padding: 20 }}>
                  {/* Client info */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 20, flexShrink: 0 }}>
                        {booking.clientName ? booking.clientName[0].toUpperCase() : "?"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 16 }}>{booking.clientName}</p>
                        <p style={{ color: "#94a3a3", fontSize: 12 }}>{booking.guests} {tr("guest(s)", "гостей", "qonaq")}</p>
                      </div>
                    </div>
                    <span style={{ background: statusBg(booking.status), color: statusColor(booking.status), fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {statusLabel(booking.status)}
                    </span>
                  </div>

                  {/* Route */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "10px 14px", background: "#f8fafa", borderRadius: 12 }}>
                    <MapPin size={14} color="#0a7070" />
                    <p style={{ color: "#021a1a", fontSize: 14, fontWeight: 600 }}>{booking.routeName || tr("Custom Tour", "Индивидуальный тур", "Fərdi tur")}</p>
                    <p style={{ color: "#94a3a3", fontSize: 13, marginLeft: "auto" }}>{booking.date}</p>
                  </div>

                  {/* Contact info */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                    {booking.clientEmail && (
                      <a href={`mailto:${booking.clientEmail}`}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(10,112,112,0.06)", border: "1px solid rgba(10,112,112,0.15)", borderRadius: 10, padding: "8px 14px", textDecoration: "none" }}>
                        <Mail size={13} color="#0a7070" />
                        <span style={{ color: "#0a7070", fontSize: 13, fontWeight: 500 }}>{booking.clientEmail}</span>
                      </a>
                    )}
                    {booking.clientPhone && (
                      <a href={`tel:${booking.clientPhone}`}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(10,112,112,0.06)", border: "1px solid rgba(10,112,112,0.15)", borderRadius: 10, padding: "8px 14px", textDecoration: "none" }}>
                        <Phone size={13} color="#0a7070" />
                        <span style={{ color: "#0a7070", fontSize: 13, fontWeight: 500 }}>{booking.clientPhone}</span>
                      </a>
                    )}
                    {booking.message && (
                      <div style={{ background: "rgba(10,112,112,0.04)", border: "1px solid rgba(10,112,112,0.1)", borderRadius: 10, padding: "8px 14px", flex: 1, minWidth: 200 }}>
                        <p style={{ color: "#4a6060", fontSize: 13 }}>💬 {booking.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Earnings */}
                  {booking.pricePerDay && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(10,112,112,0.04)", borderRadius: 12, marginBottom: 16 }}>
                      <span style={{ color: "#4a6060", fontSize: 13 }}>{tr("Your earnings", "Ваш заработок", "Qazancınız")}</span>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: "#021a1a" }}>
                        ${Number(booking.pricePerDay) * booking.guests}
                      </span>
                    </div>
                  )}

                  {/* Tour status buttons */}
                  {booking.status === "confirmed" && booking.date === todayStr && (
                    <button onClick={() => updateTourStatus(booking.id, "started")} disabled={updatingId === booking.id}
                      style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #c9a84c, #d4a843)", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Navigation size={16} />
                      {updatingId === booking.id ? tr("Updating...", "Обновляем...", "Yenilənir...") : tr("Start Tour", "Начать тур", "Turu başlat")}
                    </button>
                  )}
                  {booking.status === "started" && (
                    <button onClick={() => updateTourStatus(booking.id, "completed")} disabled={updatingId === booking.id}
                      style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Check size={16} />
                      {updatingId === booking.id ? tr("Updating...", "Обновляем...", "Yenilənir...") : tr("Complete Tour", "Завершить тур", "Turu tamamla")}
                    </button>
                  )}
                  {booking.status === "completed" && (
                    <div style={{ background: "rgba(6,80,80,0.08)", border: "1px solid rgba(6,80,80,0.2)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
                      <p style={{ color: "#065050", fontSize: 14, fontWeight: 600 }}>✓ {tr("Tour completed!", "Тур завершён!", "Tur tamamlandı!")}</p>
                    </div>
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