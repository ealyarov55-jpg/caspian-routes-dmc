"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Calendar, Users, MessageSquare, Check, X, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  routeName: string;
  date: string;
  guests: number;
  message: string;
  status: "pending" | "confirmed" | "cancelled";
  pricePerDay: string;
  createdAt: string;
}

export default function ProviderRequestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
    if (!loading && profile?.role !== "provider") router.push(`/${locale}/dashboard`);
  }, [loading, profile]);

  useEffect(() => {
    if (profile) {
      const q = query(collection(db, "bookings"), where("providerId", "==", profile.uid));
      getDocs(q).then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(data);
        setLoadingBookings(false);
      });
    }
  }, [profile]);

  const updateStatus = async (bookingId: string, status: "confirmed" | "cancelled") => {
    await updateDoc(doc(db, "bookings", bookingId), { status });
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const statusColor = { pending: "#c9a84c", confirmed: "#0a7070", cancelled: "#ef4444" };
  const statusBg = { pending: "rgba(201,168,76,0.1)", confirmed: "rgba(10,112,112,0.1)", cancelled: "rgba(239,68,68,0.1)" };

  const statusLabel = (s: string) => {
    if (s === "pending") return tr("Pending", "Ожидает", "Gözləyir");
    if (s === "confirmed") return tr("Confirmed", "Подтверждено", "Təsdiqləndi");
    return tr("Cancelled", "Отменено", "Ləğv edildi");
  };

  const filterLabel = (f: string) => {
    if (f === "all") return tr("All", "Все", "Hamısı");
    return statusLabel(f);
  };

  if (loading || !profile) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <style>{`
        .req-grid { grid-template-columns: repeat(3, 1fr) !important; }
        .req-actions { flex-direction: row !important; }
        @media (max-width: 767px) {
          .req-grid { grid-template-columns: 1fr !important; }
          .req-actions { flex-direction: column !important; }
        }
      `}</style>

      <Navbar locale={locale} />

      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 20px", height: 64, marginTop: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push(`/${locale}/dashboard`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <ArrowLeft size={14} /> {tr("Dashboard", "Панель", "Panel")}
          </button>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>
            {tr("Booking Requests", "Заявки на бронирование", "Rezervasiya sorğuları")}
          </span>
        </div>
        <div style={{ background: bookings.filter(b => b.status === "pending").length > 0 ? "#c9a84c" : "rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 12px" }}>
          <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
            {bookings.filter(b => b.status === "pending").length} {tr("pending", "ожидает", "gözləyir")}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {(["all", "pending", "confirmed", "cancelled"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 16px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "DM Sans, sans-serif", background: filter === f ? "#021a1a" : "white", color: filter === f ? "white" : "#4a6060", boxShadow: "0 2px 8px rgba(4,46,46,0.06)", transition: "all 0.2s" }}>
              {filterLabel(f)} ({f === "all" ? bookings.length : bookings.filter(b => b.status === f).length})
            </button>
          ))}
        </div>

        {loadingBookings ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#94a3a3" }}>{tr("Loading requests...", "Загружаем заявки...", "Sorğular yüklənir...")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
            <Clock size={48} color="#e2eded" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 8 }}>
              {tr("No requests yet", "Заявок пока нет", "Hələ sorğu yoxdur")}
            </h3>
            <p style={{ color: "#94a3a3", fontSize: 14 }}>
              {tr("Booking requests will appear here", "Здесь появятся заявки на бронирование", "Rezervasiya sorğuları burada görünəcək")}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map(booking => (
              <div key={booking.id} style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", border: booking.status === "pending" ? "1.5px solid rgba(201,168,76,0.3)" : "1.5px solid transparent" }}>

                {/* Top */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                      {booking.clientName ? booking.clientName[0].toUpperCase() : "?"}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 15 }}>{booking.clientName}</p>
                      <p style={{ color: "#94a3a3", fontSize: 12 }}>{booking.clientEmail}</p>
                    </div>
                  </div>
                  <span style={{ background: statusBg[booking.status], color: statusColor[booking.status], fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {statusLabel(booking.status)}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: "grid", gap: 10, marginBottom: 16 }} className="req-grid">
                  <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                    <p style={{ color: "#94a3a3", fontSize: 11, marginBottom: 4, textTransform: "uppercase" }}>{tr("Route", "Маршрут", "Marşrut")}</p>
                    <p style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{booking.routeName || tr("Custom", "Индивидуальный", "Fərdi")}</p>
                  </div>
                  <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Calendar size={11} color="#94a3a3" />
                      <p style={{ color: "#94a3a3", fontSize: 11, textTransform: "uppercase" }}>{tr("Date", "Дата", "Tarix")}</p>
                    </div>
                    <p style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{booking.date}</p>
                  </div>
                  <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Users size={11} color="#94a3a3" />
                      <p style={{ color: "#94a3a3", fontSize: 11, textTransform: "uppercase" }}>{tr("Guests", "Гостей", "Qonaqlar")}</p>
                    </div>
                    <p style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{booking.guests} {tr("person(s)", "чел.", "nəfər")}</p>
                  </div>
                </div>

                {booking.message && (
                  <div style={{ background: "rgba(10,112,112,0.04)", border: "1px solid rgba(10,112,112,0.1)", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <MessageSquare size={12} color="#0a7070" />
                      <p style={{ color: "#0a7070", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>{tr("Message", "Сообщение", "Mesaj")}</p>
                    </div>
                    <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.5 }}>{booking.message}</p>
                  </div>
                )}

                {booking.pricePerDay && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "12px 16px", background: "rgba(10,112,112,0.04)", borderRadius: 12 }}>
                    <span style={{ color: "#4a6060", fontSize: 13 }}>{tr("Estimated earnings", "Ожидаемый заработок", "Gözlənilən qazanc")}</span>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: "#021a1a" }}>
                      ${Number(booking.pricePerDay) * booking.guests}
                    </span>
                  </div>
                )}

                {booking.status === "pending" && (
                  <div style={{ display: "flex", gap: 10 }} className="req-actions">
                    <button onClick={() => updateStatus(booking.id, "confirmed")}
                      style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Check size={16} /> {tr("Confirm", "Подтвердить", "Təsdiq et")}
                    </button>
                    <button onClick={() => updateStatus(booking.id, "cancelled")}
                      style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #fee2e2", background: "white", color: "#ef4444", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <X size={16} /> {tr("Decline", "Отклонить", "Rədd et")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}