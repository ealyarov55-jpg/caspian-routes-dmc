"use client";

import { useState, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Calendar, User, MessageSquare, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const ROUTE_NAMES: Record<string, string> = {
  "baku-city-tour": "Baku City Tour",
  "absheron-peninsula": "Absheron Peninsula",
  "sheki-silk-road": "Sheki & Silk Road",
  "caspian-sea-cruise": "Caspian Sea Cruise",
};

interface Provider {
  uid: string;
  name: string;
  carModel: string;
  carYear: string;
  pricePerDay: string;
  languages: string[];
  bio: string;
  availableDates: string[];
  phone: string;
  email: string;
}

export default function BookPage({ params }: { params: Promise<{ locale: string; providerId: string }> }) {
  const { locale, providerId } = use(params);
  const searchParams = useSearchParams();
  const routeId = searchParams.get("route") || "";
  const { profile, loading } = useAuth();
  const router = useRouter();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
  }, [loading, profile]);

  useEffect(() => {
    getDoc(doc(db, "providers", providerId)).then(snap => {
      if (snap.exists()) setProvider(snap.data() as Provider);
      setLoadingProvider(false);
    });
  }, [providerId]);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y: number, m: number) => {
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1;
  };

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const handleSubmit = async () => {
    if (!profile || !provider || !selectedDate) return;
    setSubmitting(true);

    await addDoc(collection(db, "bookings"), {
      clientId: profile.uid,
      clientName: profile.name,
      clientEmail: profile.email,
      providerId: provider.uid,
      providerName: provider.name,
      routeId,
      routeName: ROUTE_NAMES[routeId] || routeId,
      date: selectedDate,
      guests,
      message,
      status: "pending",
      createdAt: new Date().toISOString(),
      pricePerDay: provider.pricePerDay,
    });

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "booking_created",
        booking: {
          clientName: profile.name,
          clientEmail: profile.email,
          providerName: provider.name,
          providerEmail: provider.email,
          routeName: ROUTE_NAMES[routeId] || routeId,
          date: selectedDate,
          guests,
          message,
          pricePerDay: provider.pricePerDay,
        },
      }),
    });

    setSubmitting(false);
    setSubmitted(true);
  };

  if (loadingProvider || !provider) return (
    <div style={{ minHeight: "100vh", background: "#021a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#2dd4bf", fontFamily: "DM Sans, sans-serif" }}>Loading...</p>
    </div>
  );

  if (submitted) return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 440, padding: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 32px rgba(10,112,112,0.3)" }}>
          <Check size={36} color="white" />
        </div>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, color: "#021a1a", marginBottom: 12 }}>Booking Sent!</h1>
        <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          Your booking request has been sent to <strong>{provider.name}</strong>. They will contact you soon to confirm.
        </p>
        <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "left", boxShadow: "0 4px 16px rgba(4,46,46,0.08)" }}>
          <p style={{ fontSize: 13, color: "#94a3a3", marginBottom: 4 }}>Booking Summary</p>
          <p style={{ fontSize: 15, color: "#021a1a", fontWeight: 600 }}>{ROUTE_NAMES[routeId] || "Custom Tour"}</p>
          <p style={{ fontSize: 14, color: "#4a6060" }}>Guide: {provider.name}</p>
          <p style={{ fontSize: 14, color: "#4a6060" }}>Date: {selectedDate}</p>
          <p style={{ fontSize: 14, color: "#4a6060" }}>Guests: {guests}</p>
        </div>
        <Link href={`/${locale}/routes`}
          style={{ display: "inline-block", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "14px 32px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
          Browse More Routes
        </Link>
      </div>
    </div>
  );

  const todayStr = today.toISOString().split("T")[0];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ background: "#021a1a", padding: "0 32px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
        <Link href={`/${locale}/routes/${routeId}`}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", color: "white", textDecoration: "none", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>Book a Guide</span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {routeId && (
              <div style={{ background: "rgba(10,112,112,0.08)", border: "1px solid rgba(10,112,112,0.2)", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2dd4bf" }} />
                <p style={{ color: "#065050", fontSize: 14 }}>Booking for: <strong>{ROUTE_NAMES[routeId]}</strong></p>
              </div>
            )}

            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <Calendar size={18} color="#0a7070" />
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600 }}>Select Date</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronLeft size={14} color="#4a6060" />
                </button>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>{MONTHS[month]} {year}</span>
                <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight size={14} color="#4a6060" />
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
                {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#94a3a3", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d}</div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isPast = dateStr < todayStr;
                  const isProviderAvailable = provider.availableDates?.includes(dateStr);
                  const isSelected = dateStr === selectedDate;
                  return (
                    <button key={day}
                      onClick={() => !isPast && isProviderAvailable && setSelectedDate(dateStr)}
                      disabled={isPast || !isProviderAvailable}
                      style={{
                        aspectRatio: "1", borderRadius: 8, border: "none", cursor: isPast || !isProviderAvailable ? "default" : "pointer",
                        background: isSelected ? "#0a7070" : isProviderAvailable && !isPast ? "rgba(10,112,112,0.08)" : "transparent",
                        color: isSelected ? "white" : isPast ? "#e2eded" : isProviderAvailable ? "#0a7070" : "#d0dede",
                        fontSize: 13, fontWeight: isSelected || isProviderAvailable ? 600 : 400,
                        fontFamily: "DM Sans, sans-serif", transition: "all 0.15s",
                      }}>
                      {day}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: 12, color: "#94a3a3", marginTop: 12, textAlign: "center" }}>Highlighted dates = guide is available</p>
            </div>

            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <User size={18} color="#0a7070" />
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600 }}>Number of Guests</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => setGuests(g => Math.max(1, g - 1))} style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", fontSize: 20, color: "#4a6060", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: "#021a1a", minWidth: 40, textAlign: "center" }}>{guests}</span>
                <button onClick={() => setGuests(g => Math.min(20, g + 1))} style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", fontSize: 20, color: "#4a6060", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                <span style={{ color: "#94a3a3", fontSize: 14 }}>person{guests !== 1 ? "s" : ""}</span>
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <MessageSquare size={18} color="#0a7070" />
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600 }}>Message to Guide</h2>
              </div>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Tell the guide about your group, special requirements, interests..."
                rows={4}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "#f8fafa", border: "1.5px solid #e2eded", color: "#0d1f1f", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", marginBottom: 20 }}>Booking Summary</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", borderBottom: "1px solid #f0f7f7", marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 20 }}>
                  {provider.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 15 }}>{provider.name}</p>
                  <p style={{ color: "#94a3a3", fontSize: 12 }}>{provider.carModel} {provider.carYear}</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3a3", fontSize: 13 }}>Date</span>
                  <span style={{ color: selectedDate ? "#021a1a" : "#e2eded", fontSize: 13, fontWeight: 600 }}>{selectedDate || "Not selected"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3a3", fontSize: 13 }}>Guests</span>
                  <span style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{guests} person{guests !== 1 ? "s" : ""}</span>
                </div>
                {provider.pricePerDay && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3a3", fontSize: 13 }}>Price per day</span>
                    <span style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>${provider.pricePerDay}</span>
                  </div>
                )}
              </div>
              {provider.pricePerDay && (
                <div style={{ background: "#f0f7f7", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#4a6060", fontSize: 14 }}>Estimated Total</span>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#021a1a" }}>
                      ${Number(provider.pricePerDay) * guests}
                    </span>
                  </div>
                </div>
              )}
              <button onClick={handleSubmit} disabled={!selectedDate || submitting}
                style={{
                  width: "100%", padding: "14px", borderRadius: 14, border: "none",
                  background: !selectedDate ? "#e2eded" : "linear-gradient(135deg, #0a7070, #0d9090)",
                  color: !selectedDate ? "#94a3a3" : "white",
                  fontSize: 15, fontWeight: 600, cursor: !selectedDate ? "not-allowed" : "pointer",
                  fontFamily: "DM Sans, sans-serif", boxShadow: selectedDate ? "0 8px 24px rgba(10,112,112,0.3)" : "none",
                  transition: "all 0.2s",
                }}>
                {submitting ? "Sending..." : !selectedDate ? "Select a Date First" : "Send Booking Request"}
              </button>
              <p style={{ fontSize: 11, color: "#94a3a3", textAlign: "center", marginTop: 12 }}>
                No payment required. Guide will contact you to confirm.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}