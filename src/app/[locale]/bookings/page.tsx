"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Calendar, Users, Clock, Check, X, MapPin } from "lucide-react";

interface Booking {
  id: string;
  providerName: string;
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
  const statusIcon = { pending: <Clock size={14} />, confirmed: <Check size={14} />, cancelled: <X size={14} /> };

  if (loading || !profile) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push(`/${locale}/dashboard`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <ArrowLeft size={14} /> Dashboard
          </button>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>My Bookings</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, padding: "4px 14px" }}>
          <span style={{ color: "white", fontSize: 13 }}>{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["all", "pending", "confirmed", "cancelled"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 18px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "DM Sans, sans-serif", background: filter === f ? "#021a1a" : "white", color: filter === f ? "white" : "#4a6060", boxShadow: "0 2px 8px rgba(4,46,46,0.06)", transition: "all 0.2s", textTransform: "capitalize" }}>
              {f} ({f === "all" ? bookings.length : bookings.filter(b => b.status === f).length})
            </button>
          ))}
        </div>

        {loadingBookings ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#94a3a3" }}>Loading bookings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
            <MapPin size={48} color="#e2eded" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 8 }}>No bookings yet</h3>
            <p style={{ color: "#94a3a3", fontSize: 14, marginBottom: 24 }}>Start exploring routes and book a guide</p>
            <button onClick={() => router.push(`/${locale}/routes`)}
              style={{ background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
              Browse Routes
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map(booking => (
              <div key={booking.id} style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", border: booking.status === "confirmed" ? "1.5px solid rgba(10,112,112,0.2)" : booking.status === "pending" ? "1.5px solid rgba(201,168,76,0.2)" : "1.5px solid transparent" }}>

                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600, marginBottom: 4 }}>
                      {booking.routeName || "Custom Tour"}
                    </h3>
                    <p style={{ color: "#94a3a3", fontSize: 13 }}>Guide: <span style={{ color: "#4a6060", fontWeight: 500 }}>{booking.providerName}</span></p>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, background: statusBg[booking.status], color: statusColor[booking.status], fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {statusIcon[booking.status]} {booking.status}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: booking.message ? 16 : 0 }}>
                  <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Calendar size={11} color="#94a3a3" />
                      <p style={{ color: "#94a3a3", fontSize: 11 }}>DATE</p>
                    </div>
                    <p style={{ color: "#021a1a", fontSize: 14, fontWeight: 600 }}>{booking.date}</p>
                  </div>
                  <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Users size={11} color="#94a3a3" />
                      <p style={{ color: "#94a3a3", fontSize: 11 }}>GUESTS</p>
                    </div>
                    <p style={{ color: "#021a1a", fontSize: 14, fontWeight: 600 }}>{booking.guests} person{booking.guests !== 1 ? "s" : ""}</p>
                  </div>
                  <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                    <p style={{ color: "#94a3a3", fontSize: 11, marginBottom: 4 }}>TOTAL</p>
                    <p style={{ fontFamily: "Cormorant Garamond, serif", color: "#021a1a", fontSize: 20, fontWeight: 700 }}>
                      {booking.pricePerDay ? `$${Number(booking.pricePerDay) * booking.guests}` : "TBD"}
                    </p>
                  </div>
                </div>

                {booking.status === "confirmed" && (
                  <div style={{ background: "rgba(10,112,112,0.06)", border: "1px solid rgba(10,112,112,0.15)", borderRadius: 12, padding: "12px 16px", marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={16} color="#0a7070" />
                    <p style={{ color: "#065050", fontSize: 13, fontWeight: 500 }}>Your booking is confirmed! The guide will contact you shortly.</p>
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: "12px 16px", marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
                    <X size={16} color="#ef4444" />
                    <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 500 }}>This booking was declined. Please try another guide or date.</p>
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