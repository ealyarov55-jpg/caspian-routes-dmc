"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Calendar, Users, Clock, Check, X, MapPin, Star } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
interface Booking {
  id: string;
  providerName: string;
  providerId: string;
  routeName: string;
  date: string;
  guests: number;
  message: string;
  status: "pending" | "confirmed" | "cancelled";
  pricePerDay: string;
  createdAt: string;
}

export default function ClientBookingsPage({ params }: { params: Promise<{ locale: string }> }) {
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
  }, [loading, profile]);

  useEffect(() => {
    if (profile) {
      const q = query(collection(db, "bookings"), where("clientId", "==", profile.uid));
      getDocs(q).then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(data);
        setLoadingBookings(false);
      });
    }
  }, [profile]);

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
    <Navbar locale={locale} />
      <style>{`
        .bookings-header { padding: 0 16px !important; }
        .booking-grid { grid-template-columns: 1fr !important; }
        @media (min-width: 768px) {
          .bookings-header { padding: 0 32px !important; }
          .booking-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: "#021a1a", height: 64, marginTop:72,display:"flex", alignItems: "center", justifyContent: "space-between" }} className="bookings-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push(`/${locale}/dashboard`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <ArrowLeft size={14} /> {tr("Dashboard", "Панель", "Panel")}
          </button>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>
            {tr("My Bookings", "Мои бронирования", "Rezervasiyalarım")}
          </span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, padding: "4px 14px" }}>
          <span style={{ color: "white", fontSize: 13 }}>{bookings.length} {tr("total", "всего", "cəmi")}</span>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 16px" }}>

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
            <p style={{ color: "#94a3a3" }}>{tr("Loading bookings...", "Загружаем бронирования...", "Rezervasiyalar yüklənir...")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
            <MapPin size={48} color="#e2eded" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 8 }}>
              {tr("No bookings yet", "Бронирований пока нет", "Hələ rezervasiya yoxdur")}
            </h3>
            <p style={{ color: "#94a3a3", fontSize: 14, marginBottom: 24 }}>
              {tr("Start exploring routes and book a guide", "Начните изучать маршруты и бронировать гида", "Marşrutları kəşf edin və bələdçi rezerv edin")}
            </p>
            <Link href={`/${locale}/routes`}
              style={{ display: "inline-block", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "DM Sans, sans-serif" }}>
              {tr("Browse Routes", "Смотреть маршруты", "Marşrutlara bax")}
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map(booking => (
              <div key={booking.id} style={{
                background: "white", borderRadius: 20, padding: 24,
                boxShadow: "0 4px 24px rgba(4,46,46,0.08)",
                border: booking.status === "confirmed" ? "1.5px solid rgba(10,112,112,0.2)" :
                        booking.status === "pending" ? "1.5px solid rgba(201,168,76,0.2)" : "1.5px solid transparent"
              }}>
                {/* Top */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600, marginBottom: 4 }}>
                      {booking.routeName || tr("Custom Tour", "Индивидуальный тур", "Fərdi tur")}
                    </h3>
                    <p style={{ color: "#94a3a3", fontSize: 13 }}>
                      {tr("Guide", "Гид", "Bələdçi")}: <span style={{ color: "#4a6060", fontWeight: 500 }}>{booking.providerName}</span>
                    </p>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, background: statusBg[booking.status], color: statusColor[booking.status], fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", flexShrink: 0 }}>
                    {booking.status === "pending" && <Clock size={12} />}
                    {booking.status === "confirmed" && <Check size={12} />}
                    {booking.status === "cancelled" && <X size={12} />}
                    {statusLabel(booking.status)}
                  </span>
                </div>

                {/* Details grid */}
                <div style={{ display: "grid", gap: 10, marginBottom: 16 }} className="booking-grid">
                  <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Calendar size={11} color="#94a3a3" />
                      <p style={{ color: "#94a3a3", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>{tr("Date", "Дата", "Tarix")}</p>
                    </div>
                    <p style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{booking.date}</p>
                  </div>
                  <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Users size={11} color="#94a3a3" />
                      <p style={{ color: "#94a3a3", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>{tr("Guests", "Гостей", "Qonaqlar")}</p>
                    </div>
                    <p style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{booking.guests}</p>
                  </div>
                  <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                    <p style={{ color: "#94a3a3", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{tr("Total", "Итого", "Cəmi")}</p>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", color: "#021a1a", fontSize: 20, fontWeight: 700 }}>
                      {booking.pricePerDay ? `$${Number(booking.pricePerDay) * booking.guests}` : "TBD"}
                    </p>
                  </div>
                </div>

                {/* Status messages */}
                {booking.status === "confirmed" && (
                  <div style={{ background: "rgba(10,112,112,0.06)", border: "1px solid rgba(10,112,112,0.15)", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="#0a7070" />
                    <p style={{ color: "#065050", fontSize: 13, fontWeight: 500 }}>
                      {tr("Your booking is confirmed! The guide will contact you shortly.", "Ваше бронирование подтверждено! Гид скоро свяжется с вами.", "Rezervasiyanız təsdiqləndi! Bələdçi tezliklə sizinlə əlaqə saxlayacaq.")}
                    </p>
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    <X size={16} color="#ef4444" />
                    <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 500 }}>
                      {tr("This booking was declined. Please try another guide or date.", "Это бронирование было отклонено. Попробуйте другого гида или дату.", "Bu rezervasiya rədd edildi. Başqa bələdçi və ya tarix sınayın.")}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {booking.status === "confirmed" && booking.providerId && (
                    <Link href={`/${locale}/provider/${booking.providerId}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "9px 18px", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                      <Star size={13} />
                      {tr("Leave a Review", "Оставить отзыв", "Rəy burax")}
                    </Link>
                  )}
                  {booking.status === "cancelled" && (
                    <Link href={`/${locale}/routes`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#021a1a", color: "white", padding: "9px 18px", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                      <MapPin size={13} />
                      {tr("Find Another Guide", "Найти другого гида", "Başqa bələdçi tap")}
                    </Link>
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