"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Calendar, Users, MessageSquare, Check, X, Clock } from "lucide-react";

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
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>Booking Requests</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ background: bookings.filter(b => b.status === "pending").length > 0 ? "#c9a84c" : "rgba(255,255,255,0.1)", borderRadius: 999, padding: "4px 12px" }}>
            <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
              {bookings.filter(b => b.status === "pending").length} pending
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["all", "pending", "confirmed", "cancelled"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 18px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "DM Sans, sans-serif", background: filter === f ? "#021a1a" : "white", color: filter === f ? "white" : "#4a6060", boxShadow: "0 2px 8px rgba(4,46,46,0.06)", transition: "all 0.2s", textTransform: "capitalize" }}>
              {f} {f === "all" ? `(${bookings.length})` : `(${bookings.filter(b => b.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loadingBookings ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#94a3a3" }}>Loading requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
            <Clock size={48} color="#e2eded" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 8 }}>No requests yet</h3>
            <p style={{ color: "#94a3a3", fontSize: 14 }}>Booking requests will appear here</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map(booking => (
              <div key={booking.id} style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", border: booking.status === "pending" ? "1.5px solid rgba(201,168,76,0.3)" : "1.5px solid transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18 }}>
                      {booking.clientName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 16 }}>{booking.clientName}</p>
                      <p style={{ color: "#94a3a3", fontSize: 12 }}>{booking.clientEmail}</p>
                    </div>
                  </div>
                  <span style={{ background: statusBg[booking.status], color: statusColor[booking.status], fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {booking.status}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: "#f8fafa", borderRadius: 12, padding: "12px 16px" }}>
                    <p style={{ color: "#94a3a3", fontSize: 11, marginBottom: 4 }}>ROUTE</p>
                    <p style={{ color: "#021a1a", fontSize: 14, fontWeight: 600 }}>{booking.routeName || "Custom"}</p>
                  </div>
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
                </div>

                {booking.message && (
                  <div style={{ background: "rgba(10,112,112,0.04)", border: "1px solid rgba(10,112,112,0.1)", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <MessageSquare size={12} color="#0a7070" />
                      <p style={{ color: "#0a7070", fontSize: 11, fontWeight: 600 }}>MESSAGE</p>
                    </div>
                    <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.5 }}>{booking.message}</p>
                  </div>
                )}

                {booking.pricePerDay && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ color: "#94a3a3", fontSize: 13 }}>Estimated earnings</span>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: "#021a1a" }}>
                      ${Number(booking.pricePerDay) * booking.guests}
                    </span>
                  </div>
                )}

                {booking.status === "pending" && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => updateStatus(booking.id, "confirmed")}
                      style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Check size={16} /> Confirm
                    </button>
                    <button onClick={() => updateStatus(booking.id, "cancelled")}
                      style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #fee2e2", background: "white", color: "#ef4444", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <X size={16} /> Decline
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