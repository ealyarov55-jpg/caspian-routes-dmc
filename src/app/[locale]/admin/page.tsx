"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Users, MapPin, Calendar, Check, X, Trash2, Briefcase, BarChart3, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

interface Provider {
  uid: string;
  name: string;
  email: string;
  carModel: string;
  pricePerDay: string;
  languages: string[];
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
  createdAt: string;
}

interface PartnerQuote {
  id: string;
  partnerName: string;
  partnerEmail: string;
  routeName: string;
  arrivalDate: string;
  departureDate: string;
  pax: number;
  guideLanguage: string;
  hotelRequired: boolean;
  transferRequired: boolean;
  specialRequests: string;
  estimatedNetTotal: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

interface User {
  uid: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [tab, setTab] = useState<"overview" | "providers" | "bookings" | "partners" | "quotes" | "users">("overview");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [partnerQuotes, setPartnerQuotes] = useState<PartnerQuote[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
        getDocs(collection(db, "users")),
        getDocs(collection(db, "partnerQuotes")),
      ]).then(([provSnap, bookSnap, userSnap, quotesSnap]) => {
        setProviders(provSnap.docs.map(d => d.data() as Provider));
        const booksData = bookSnap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
        booksData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookings(booksData);
        setUsers(userSnap.docs.map(d => d.data() as User));
        const quotesData = quotesSnap.docs.map(d => ({ id: d.id, ...d.data() } as PartnerQuote));
        quotesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPartnerQuotes(quotesData);
        setLoadingData(false);
      });
    }
  }, [profile]);

  const approveProvider = async (uid: string) => {
    await updateDoc(doc(db, "providers", uid), { approved: true });
    setProviders(prev => prev.map(p => p.uid === uid ? { ...p, approved: true } : p));
  };

  const deleteProvider = async (uid: string) => {
    if (!confirm(tr("Are you sure?", "Вы уверены?", "Əminsiniz?"))) return;
    await deleteDoc(doc(db, "providers", uid));
    setProviders(prev => prev.filter(p => p.uid !== uid));
  };

  const changeUserRole = async (uid: string, newRole: string) => {
    await updateDoc(doc(db, "users", uid), { role: newRole });
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
  };

  const updateQuoteStatus = async (id: string, status: "confirmed" | "cancelled") => {
    await updateDoc(doc(db, "partnerQuotes", id), { status });
    setPartnerQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
  };

  if (loading || !profile) return null;

  const partners = users.filter(u => u.role === "partner");
  const pendingProviders = providers.filter(p => !p.approved);
  const pendingQuotes = partnerQuotes.filter(q => q.status === "pending");

  const stats = [
    { label: tr("Providers", "Провайдеры", "Provayderlar"), value: providers.length, icon: Users, color: "#0a7070" },
    { label: tr("Bookings", "Бронирования", "Rezervasiyalar"), value: bookings.length, icon: Calendar, color: "#c9a84c" },
    { label: tr("Partner Quotes", "Запросы партнёров", "Tərəfdaş sorğuları"), value: partnerQuotes.length, icon: Briefcase, color: "#065050" },
    { label: tr("Partners", "Партнёры", "Tərəfdaşlar"), value: partners.length, icon: BarChart3, color: "#2dd4bf" },
  ];

  const tabs = [
    { key: "overview", label: tr("Overview", "Обзор", "Ümumi baxış") },
    { key: "quotes", label: `${tr("Partner Quotes", "Запросы партнёров", "Tərəfdaş sorğuları")} ${pendingQuotes.length > 0 ? `(${pendingQuotes.length})` : ""}` },
    { key: "bookings", label: tr("Bookings", "Бронирования", "Rezervasiyalar") },
    { key: "providers", label: tr("Providers", "Провайдеры", "Provayderlar") },
    { key: "partners", label: tr("Partners", "Партнёры", "Tərəfdaşlar") },
    { key: "users", label: tr("Users", "Пользователи", "İstifadəçilər") },
  ];

  const statusColor = (s: string) => s === "confirmed" ? "#0a7070" : s === "pending" ? "#c9a84c" : "#ef4444";
  const statusBg = (s: string) => s === "confirmed" ? "rgba(10,112,112,0.1)" : s === "pending" ? "rgba(201,168,76,0.1)" : "rgba(239,68,68,0.1)";
  const statusLabel = (s: string) => {
    if (s === "confirmed") return tr("Confirmed", "Подтверждено", "Təsdiqləndi");
    if (s === "pending") return tr("Pending", "Ожидает", "Gözləyir");
    return tr("Cancelled", "Отменено", "Ləğv edildi");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar locale={locale} />
      <style>{`
        .admin-stats { grid-template-columns: repeat(4, 1fr) !important; }
        .admin-overview { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 767px) {
          .admin-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-overview { grid-template-columns: 1fr !important; }
        }
        .admin-table { overflow-x: auto; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 20px", height: 64, marginTop: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push(`/${locale}/dashboard`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <ArrowLeft size={14} /> {tr("Dashboard", "Панель", "Panel")}
          </button>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>
            {tr("Admin Panel", "Панель администратора", "Admin paneli")}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {pendingQuotes.length > 0 && (
            <span style={{ background: "#c9a84c", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>
              {pendingQuotes.length} {tr("new quotes", "новых запросов", "yeni sorğu")}
            </span>
          )}
          {pendingProviders.length > 0 && (
            <span style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>
              {pendingProviders.length} {tr("pending", "ожидает", "gözləyir")}
            </span>
          )}
          <span style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em" }}>Admin</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gap: 16, marginBottom: 28 }} className="admin-stats">
          {stats.map(stat => (
            <div key={stat.label} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#021a1a", marginBottom: 4 }}>{stat.value}</p>
              <p style={{ color: "#94a3a3", fontSize: 12 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ padding: "10px 18px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "DM Sans, sans-serif", background: tab === t.key ? "#021a1a" : t.key === "quotes" && pendingQuotes.length > 0 ? "rgba(201,168,76,0.15)" : "white", color: tab === t.key ? "white" : t.key === "quotes" && pendingQuotes.length > 0 ? "#c9a84c" : "#4a6060", boxShadow: "0 2px 8px rgba(4,46,46,0.06)", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div style={{ display: "grid", gap: 20 }} className="admin-overview">
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", marginBottom: 16 }}>
                {tr("Recent Partner Quotes", "Последние запросы партнёров", "Son tərəfdaş sorğuları")}
              </h3>
              {partnerQuotes.slice(0, 5).map(q => (
                <div key={q.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f7f7" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#021a1a" }}>{q.partnerName}</p>
                    <p style={{ fontSize: 12, color: "#94a3a3" }}>{q.routeName} · {q.arrivalDate} · {q.pax} pax</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", background: statusBg(q.status), color: statusColor(q.status) }}>
                    {statusLabel(q.status)}
                  </span>
                </div>
              ))}
              {partnerQuotes.length === 0 && <p style={{ color: "#94a3a3", fontSize: 14 }}>{tr("No quotes yet", "Запросов пока нет", "Hələ sorğu yoxdur")}</p>}
            </div>
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", marginBottom: 16 }}>
                {tr("Recent Bookings", "Последние бронирования", "Son rezervasiyalar")}
              </h3>
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f7f7" }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#021a1a" }}>{b.clientName}</p>
                    <p style={{ fontSize: 12, color: "#94a3a3" }}>{b.routeName || "Custom"} · {b.date}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", background: statusBg(b.status), color: statusColor(b.status) }}>
                    {statusLabel(b.status)}
                  </span>
                </div>
              ))}
              {bookings.length === 0 && <p style={{ color: "#94a3a3", fontSize: 14 }}>{tr("No bookings yet", "Бронирований пока нет", "Hələ rezervasiya yoxdur")}</p>}
            </div>
          </div>
        )}

        {/* Partner Quotes */}
        {tab === "quotes" && (
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16 }}>
              {tr("Partner Quote Requests", "Запросы от партнёров", "Tərəfdaş sorğuları")} ({partnerQuotes.length})
            </h2>
            {partnerQuotes.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, background: "white", borderRadius: 20 }}>
                <Briefcase size={48} color="#e2eded" style={{ marginBottom: 16 }} />
                <p style={{ color: "#94a3a3" }}>{tr("No partner quotes yet", "Запросов от партнёров пока нет", "Hələ tərəfdaş sorğusu yoxdur")}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {partnerQuotes.map(q => (
                  <div key={q.id} style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", border: q.status === "pending" ? "1.5px solid rgba(201,168,76,0.3)" : "1.5px solid transparent" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
                      <div>
                        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600, marginBottom: 4 }}>
                          {q.routeName}
                        </h3>
                        <p style={{ color: "#4a6060", fontSize: 13 }}>
                          {tr("Partner", "Партнёр", "Tərəfdaş")}: <strong>{q.partnerName}</strong> · {q.partnerEmail}
                        </p>
                        {(q as any).clientName && (
  <p style={{ color: "#4a6060", fontSize: 13 }}>
    {tr("Client", "Клиент", "Müştəri")}: <strong>{(q as any).clientName}</strong>
  </p>
)}
{(q as any).type === "itinerary" && (q as any).items && (
  <p style={{ color: "#94a3a3", fontSize: 12, marginTop: 4 }}>
    {tr("Itinerary", "Маршрут", "Marşrut")}: {(q as any).items.map((i: any) => `${i.name} ×${i.quantity}`).join(", ")}
  </p>
)}
                        <p style={{ color: "#94a3a3", fontSize: 12, marginTop: 2 }}>{new Date(q.createdAt).toLocaleString()}</p>
                      </div>
                      <span style={{ display: "flex", alignItems: "center", gap: 5, background: statusBg(q.status), color: statusColor(q.status), fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 999, textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>
                        {q.status === "pending" && <Clock size={12} />}
                        {q.status === "confirmed" && <Check size={12} />}
                        {q.status === "cancelled" && <X size={12} />}
                        {statusLabel(q.status)}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 16 }}>
                      <div style={{ background: "#f8fafa", borderRadius: 10, padding: "10px 14px" }}>
                        <p style={{ color: "#94a3a3", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{tr("Arrival", "Приезд", "Gəliş")}</p>
                        <p style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{q.arrivalDate}</p>
                      </div>
                      {q.departureDate && (
                        <div style={{ background: "#f8fafa", borderRadius: 10, padding: "10px 14px" }}>
                          <p style={{ color: "#94a3a3", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{tr("Departure", "Отъезд", "Ayrılış")}</p>
                          <p style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{q.departureDate}</p>
                        </div>
                      )}
                      <div style={{ background: "#f8fafa", borderRadius: 10, padding: "10px 14px" }}>
                        <p style={{ color: "#94a3a3", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{tr("Pax", "Человек", "Nəfər")}</p>
                        <p style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{q.pax}</p>
                      </div>
                      <div style={{ background: "rgba(10,112,112,0.06)", borderRadius: 10, padding: "10px 14px" }}>
                        <p style={{ color: "#94a3a3", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{tr("Net Total", "Net-сумма", "Net cəmi")}</p>
                        <p style={{ fontFamily: "Cormorant Garamond, serif", color: "#0a7070", fontSize: 20, fontWeight: 700 }}>${q.estimatedNetTotal}</p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: q.specialRequests ? 12 : 0 }}>
                      {q.guideLanguage && <span style={{ fontSize: 11, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "4px 10px", borderRadius: 999 }}>🌐 {q.guideLanguage}</span>}
                      {q.hotelRequired && <span style={{ fontSize: 11, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "4px 10px", borderRadius: 999 }}>🏨 {tr("Hotel", "Отель", "Otel")}</span>}
                      {q.transferRequired && <span style={{ fontSize: 11, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "4px 10px", borderRadius: 999 }}>✈️ {tr("Transfer", "Трансфер", "Transfer")}</span>}
                    </div>

                    {q.specialRequests && (
                      <div style={{ background: "rgba(10,112,112,0.04)", border: "1px solid rgba(10,112,112,0.1)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                        <p style={{ color: "#0a7070", fontSize: 11, fontWeight: 600, marginBottom: 4, textTransform: "uppercase" }}>{tr("Special Requests", "Особые пожелания", "Xüsusi istəklər")}</p>
                        <p style={{ color: "#4a6060", fontSize: 13 }}>{q.specialRequests}</p>
                      </div>
                    )}

                    {q.status === "pending" && (
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => updateQuoteStatus(q.id, "confirmed")}
                          style={{ flex: 1, padding: "11px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <Check size={16} /> {tr("Confirm Quote", "Подтвердить запрос", "Sorğunu təsdiq et")}
                        </button>
                        <button onClick={() => updateQuoteStatus(q.id, "cancelled")}
                          style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1.5px solid #fee2e2", background: "white", color: "#ef4444", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <X size={16} /> {tr("Decline", "Отклонить", "Rədd et")}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings */}
        {tab === "bookings" && (
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16 }}>
              {tr("All Bookings", "Все бронирования", "Bütün rezervasiyalar")} ({bookings.length})
            </h2>
            {bookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, background: "white", borderRadius: 20 }}>
                <p style={{ color: "#94a3a3" }}>{tr("No bookings yet", "Бронирований пока нет", "Hələ rezervasiya yoxdur")}</p>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }} className="admin-table">
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr style={{ background: "#f8fafa" }}>
                      {[tr("Client", "Клиент", "Müştəri"), tr("Guide", "Гид", "Bələdçi"), tr("Route", "Маршрут", "Marşrut"), tr("Date", "Дата", "Tarix"), tr("Guests", "Гостей", "Qonaqlar"), tr("Total", "Итого", "Cəmi"), tr("Status", "Статус", "Status")].map(h => (
                        <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3a3", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderTop: "1px solid #f0f7f7" }}>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#021a1a", fontWeight: 500 }}>{b.clientName}</td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#4a6060" }}>{b.providerName}</td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#4a6060" }}>{b.routeName || "Custom"}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#4a6060" }}>{b.date}</td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#4a6060" }}>{b.guests}</td>
                        <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#021a1a" }}>
                          {b.pricePerDay ? `$${Number(b.pricePerDay) * b.guests}` : "-"}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, textTransform: "uppercase", background: statusBg(b.status), color: statusColor(b.status) }}>
                            {statusLabel(b.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Providers */}
        {tab === "providers" && (
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16 }}>
              {tr("All Providers", "Все провайдеры", "Bütün provayderlar")} ({providers.length})
            </h2>
            {providers.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, background: "white", borderRadius: 20 }}>
                <p style={{ color: "#94a3a3" }}>{tr("No providers yet", "Провайдеров пока нет", "Hələ prövaydr yoxdur")}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {providers.map(p => (
                  <div key={p.uid} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                      {p.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 15 }}>{p.name}</p>
                      <p style={{ color: "#94a3a3", fontSize: 12 }}>{p.email} · {p.carModel || "No vehicle"}</p>
                      {p.languages?.length > 0 && (
                        <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                          {p.languages.map(l => (
                            <span key={l} style={{ fontSize: 10, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "2px 8px", borderRadius: 999 }}>{l}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {p.pricePerDay && (
                      <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#021a1a" }}>${p.pricePerDay}/day</p>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      {!p.approved ? (
                        <button onClick={() => approveProvider(p.uid)}
                          style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", border: "none", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                          <Check size={14} /> {tr("Approve", "Одобрить", "Təsdiq et")}
                        </button>
                      ) : (
                        <span style={{ background: "rgba(10,112,112,0.1)", color: "#0a7070", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 10 }}>✓ {tr("Approved", "Одобрен", "Təsdiqləndi")}</span>
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

        {/* Partners */}
        {tab === "partners" && (
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16 }}>
              {tr("Partner Accounts", "Партнёрские аккаунты", "Tərəfdaş hesabları")} ({partners.length})
            </h2>
            {partners.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <Briefcase size={48} color="#e2eded" style={{ marginBottom: 16 }} />
                <p style={{ color: "#94a3a3", fontSize: 15 }}>{tr("No partner accounts yet", "Партнёрских аккаунтов пока нет", "Hələ tərəfdaş hesabı yoxdur")}</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {partners.map(u => (
                  <div key={u.uid} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #d4a843)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 15 }}>{u.name}</p>
                      <p style={{ color: "#94a3a3", fontSize: 12 }}>{u.email}</p>
                      <p style={{ color: "#94a3a3", fontSize: 11, marginTop: 2 }}>{tr("Registered", "Зарегистрирован", "Qeydiyyat")} {new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ background: "rgba(201,168,76,0.1)", color: "#c9a84c", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, textTransform: "uppercase" }}>Partner</span>
                      <button onClick={() => changeUserRole(u.uid, "client")}
                        style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif" }}>
                        {tr("Revoke", "Отозвать", "Ləğv et")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16 }}>
              {tr("All Users", "Все пользователи", "Bütün istifadəçilər")} ({users.length})
            </h2>
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }} className="admin-table">
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                  <tr style={{ background: "#f8fafa" }}>
                    {[tr("Name", "Имя", "Ad"), "Email", tr("Role", "Роль", "Rol"), tr("Registered", "Зарегистрирован", "Qeydiyyat"), tr("Actions", "Действия", "Əməliyyatlar")].map(h => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3a3", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.uid} style={{ borderTop: "1px solid #f0f7f7" }}>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#021a1a", fontWeight: 500 }}>{u.name}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#4a6060" }}>{u.email}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", background: u.role === "admin" ? "rgba(239,68,68,0.1)" : u.role === "partner" ? "rgba(201,168,76,0.1)" : u.role === "provider" ? "rgba(10,112,112,0.1)" : "rgba(94,163,163,0.1)", color: u.role === "admin" ? "#ef4444" : u.role === "partner" ? "#c9a84c" : u.role === "provider" ? "#0a7070" : "#4a6060" }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#94a3a3" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {u.role !== "admin" && (
                          <select value={u.role} onChange={e => changeUserRole(u.uid, e.target.value)}
                            style={{ padding: "6px 10px", borderRadius: 8, border: "1.5px solid #e2eded", background: "white", color: "#021a1a", fontSize: 12, fontFamily: "DM Sans, sans-serif", cursor: "pointer" }}>
                            <option value="client">client</option>
                            <option value="provider">provider</option>
                            <option value="partner">partner</option>
                            <option value="admin">admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}