"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Users, MapPin, Calendar, Check, X, Trash2, Eye } from "lucide-react";

interface Provider {
  uid: string;
  name: string;
  email: string;
  carModel: string;
  pricePerDay: string;
  languages: string[];
  services: string[];
  approved?: boolean;
}

interface Booking {
  id: string;
  clientName: string;
  providerName: string;
  routeName: string;
  date: string;
  guests: number;
  status: string;
  pricePerDay: string;
}

export default function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "providers" | "bookings">("overview");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
    if (!loading && profile?.role !== "admin") router.push(`/${locale}/dashboard`);
  }, [loading, profile]);

  useEffect(() => {
    if (profile?.role === "admin") {
      Promise.all([
        getDocs(collection(db, "providers")),
        getDocs(collection(db, "bookings")),
      ]).then(([provSnap, bookSnap]) => {
        setProviders(provSnap.docs.map(d => d.data() as Provider));
        setBookings(bookSnap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
        setLoadingData(false);
      });
    }
  }, [profile]);

  const approveProvider = async (uid: string) => {
    await updateDoc(doc(db, "providers", uid), { approved: true });
    setProviders(prev => prev.map(p => p.uid === uid ? { ...p, approved: true } : p));
  };

  const deleteProvider = async (uid: string) => {
    await deleteDoc(doc(db, "providers", uid));
    setProviders(prev => prev.filter(p => p.uid !== uid));
  };

  if (loading || !profile) return null;

  const stats = [
    { label: "Total Providers", value: providers.length, icon: Users, color: "#0a7070" },
    { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "#c9a84c" },
    { label: "Pending Bookings", value: bookings.filter(b => b.status === "pending").length, icon: MapPin, color: "#065050" },
    { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, icon: Check, color: "#2dd4bf" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push(`/${locale}/dashboard`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <ArrowLeft size={14} /> Dashboard
          </button>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>Admin Panel</span>
        </div>
        <span style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em" }}>Admin</span>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <stat.icon size={18} color={stat.color} />
                </div>
              </div>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#021a1a", marginBottom: 4 }}>{stat.value}</p>
              <p style={{ color: "#94a3a3", fontSize: 12 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["overview", "providers", "bookings"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "DM Sans, sans-serif", background: tab === t ? "#021a1a" : "white", color: tab === t ? "white" : "#4a6060", boxShadow: "0 2px 8px rgba(4,46,46,0.06)", transition: "all 0.2s", textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Providers Tab */}
        {tab === "providers" && (
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16 }}>All Providers ({providers.length})</h2>
            {providers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: 20 }}>
                <p style={{ color: "#94a3a3" }}>No providers registered yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {providers.map(p => (
                  <div key={p.uid} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                      {p.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 15 }}>{p.name}</p>
                      <p style={{ color: "#94a3a3", fontSize: 12 }}>{p.email} · {p.carModel || "No vehicle"}</p>
                      {p.languages?.length > 0 && (
                        <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                          {p.languages.map(l => (
                            <span key={l} style={{ fontSize: 10, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "2px 8px", borderRadius: 999 }}>{l}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {p.pricePerDay && (
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#021a1a" }}>${p.pricePerDay}/day</p>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      {!p.approved ? (
                        <button onClick={() => approveProvider(p.uid)}
                          style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", border: "none", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                          <Check size={14} /> Approve
                        </button>
                      ) : (
                        <span style={{ background: "rgba(10,112,112,0.1)", color: "#0a7070", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 10 }}>✓ Approved</span>
                      )}
                      <button onClick={() => deleteProvider(p.uid)}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16 }}>All Bookings ({bookings.length})</h2>
            {bookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: 20 }}>
                <p style={{ color: "#94a3a3" }}>No bookings yet</p>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafa" }}>
                      {["Client", "Guide", "Route", "Date", "Guests", "Total", "Status"].map(h => (
                        <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3a3", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={b.id} style={{ borderTop: "1px solid #f0f7f7" }}>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#021a1a", fontWeight: 500 }}>{b.clientName}</td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#4a6060" }}>{b.providerName}</td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#4a6060" }}>{b.routeName || "Custom"}</td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#4a6060" }}>{b.date}</td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#4a6060" }}>{b.guests}</td>
                        <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#021a1a" }}>
                          {b.pricePerDay ? `$${Number(b.pricePerDay) * b.guests}` : "-"}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, textTransform: "uppercase",
                            background: b.status === "confirmed" ? "rgba(10,112,112,0.1)" : b.status === "pending" ? "rgba(201,168,76,0.1)" : "rgba(239,68,68,0.1)",
                            color: b.status === "confirmed" ? "#0a7070" : b.status === "pending" ? "#c9a84c" : "#ef4444",
                          }}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Overview Tab */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", marginBottom: 16 }}>Recent Bookings</h3>
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f7f7" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#021a1a" }}>{b.clientName}</p>
                    <p style={{ fontSize: 12, color: "#94a3a3" }}>{b.routeName || "Custom"} · {b.date}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", background: b.status === "confirmed" ? "rgba(10,112,112,0.1)" : b.status === "pending" ? "rgba(201,168,76,0.1)" : "rgba(239,68,68,0.1)", color: b.status === "confirmed" ? "#0a7070" : b.status === "pending" ? "#c9a84c" : "#ef4444" }}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", marginBottom: 16 }}>Recent Providers</h3>
              {providers.slice(0, 5).map(p => (
                <div key={p.uid} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f7f7" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700 }}>
                    {p.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#021a1a" }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: "#94a3a3" }}>{p.carModel || "No vehicle"}</p>
                  </div>
                  {p.approved ? <span style={{ fontSize: 11, color: "#0a7070", fontWeight: 600 }}>✓ Active</span> : <span style={{ fontSize: 11, color: "#c9a84c", fontWeight: 600 }}>Pending</span>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}