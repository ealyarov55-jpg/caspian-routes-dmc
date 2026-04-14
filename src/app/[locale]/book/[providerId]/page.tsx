"use client";

import { useState, use, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Calendar, User, MessageSquare, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const MONTHS_AZ = ["Yanvar","Fevral","Mart","Aprel","May","İyun","İyul","Avqust","Sentyabr","Oktyabr","Noyabr","Dekabr"];
const DAYS_EN = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAYS_RU = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
const DAYS_AZ = ["Be","Ça","Çə","Ca","Cü","Şə","Bz"];

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
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const MONTHS = lang === "ru" ? MONTHS_RU : lang === "az" ? MONTHS_AZ : MONTHS_EN;
  const DAYS = lang === "ru" ? DAYS_RU : lang === "az" ? DAYS_AZ : DAYS_EN;

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
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

  const toggleDate = (dateStr: string) => {
    setSelectedDates(prev =>
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr].sort()
    );
  };

  const handleSubmit = async () => {
    if (!profile || !provider || selectedDates.length === 0) return;
    setSubmitting(true);

    const dateRange = selectedDates.length === 1
      ? selectedDates[0]
      : `${selectedDates[0]} → ${selectedDates[selectedDates.length - 1]}`;

    await addDoc(collection(db, "bookings"), {
      clientId: profile.uid,
      clientName: profile.name,
      clientEmail: profile.email,
      providerId: provider.uid,
      providerName: provider.name,
      routeId,
      routeName: ROUTE_NAMES[routeId] || routeId,
      date: dateRange,
      dates: selectedDates,
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
          date: dateRange,
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
    <div style={{ minHeight: "100vh", background: "#f0f7f7", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 440, width: "100%" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 32px rgba(10,112,112,0.3)" }}>
          <Check size={36} color="white" />
        </div>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 36, color: "#021a1a", marginBottom: 12 }}>
          {tr("Booking Sent!", "Заявка отправлена!", "Rezervasiya göndərildi!")}
        </h1>
        <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          {tr("Your booking request has been sent to", "Ваша заявка отправлена гиду", "Rezervasiya sorğunuz bələdçiyə göndərildi")} <strong>{provider.name}</strong>.
        </p>
        <div style={{ background: "white", borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "left", boxShadow: "0 4px 16px rgba(4,46,46,0.08)" }}>
          <p style={{ fontSize: 13, color: "#94a3a3", marginBottom: 8 }}>{tr("Booking Summary", "Детали бронирования", "Rezervasiya məlumatları")}</p>
          <p style={{ fontSize: 15, color: "#021a1a", fontWeight: 600 }}>{ROUTE_NAMES[routeId] || tr("Custom Tour", "Индивидуальный тур", "Fərdi tur")}</p>
          <p style={{ fontSize: 14, color: "#4a6060" }}>{tr("Guide", "Гид", "Bələdçi")}: {provider.name}</p>
          <p style={{ fontSize: 14, color: "#4a6060" }}>{tr("Dates", "Даты", "Tarixlər")}: {selectedDates.join(", ")}</p>
          <p style={{ fontSize: 14, color: "#4a6060" }}>{tr("Guests", "Гостей", "Qonaqlar")}: {guests}</p>
        </div>
        <Link href={`/${locale}/routes`}
          style={{ display: "inline-block", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "14px 32px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
          {tr("Browse More Routes", "Смотреть маршруты", "Marşrutlara bax")}
        </Link>
      </div>
    </div>
  );

  const todayStr = today.toISOString().split("T")[0];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const totalPrice = provider.pricePerDay ? Number(provider.pricePerDay) * guests * (selectedDates.length || 1) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <style>{`
        .book-grid { grid-template-columns: minmax(0,1fr) !important; }
        .book-summary { position: static !important; }
        @media (min-width: 768px) {
          .book-grid { grid-template-columns: 1fr 320px !important; }
          .book-summary { position: sticky !important; top: 24px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 20px", height: 64, display: "flex", alignItems: "center", gap: 16 }}>
        <Link href={`/${locale}/routes/${routeId}`}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", color: "white", textDecoration: "none", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
          <ArrowLeft size={14} /> {tr("Back", "Назад", "Geri")}
        </Link>
        <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>
          {tr("Book a Guide", "Забронировать гида", "Bələdçi rezerv et")}
        </span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "grid", gap: 20 }} className="book-grid">

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {routeId && (
              <div style={{ background: "rgba(10,112,112,0.08)", border: "1px solid rgba(10,112,112,0.2)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2dd4bf", flexShrink: 0 }} />
                <p style={{ color: "#065050", fontSize: 14 }}>
                  {tr("Booking for", "Бронирование для", "Rezervasiya")}: <strong>{ROUTE_NAMES[routeId]}</strong>
                </p>
              </div>
            )}

            {/* Calendar */}
            <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Calendar size={18} color="#0a7070" />
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                  {tr("Select Date(s)", "Выберите дату(ы)", "Tarix(lər) seçin")}
                </h2>
              </div>
              <p style={{ fontSize: 12, color: "#94a3a3", marginBottom: 12 }}>
                {tr("You can select multiple dates", "Можно выбрать несколько дат", "Bir neçə tarix seçə bilərsiniz")}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronLeft size={14} color="#4a6060" />
                </button>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, color: "#021a1a", fontWeight: 600 }}>{MONTHS[month]} {year}</span>
                <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight size={14} color="#4a6060" />
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
                {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#94a3a3", textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 0" }}>{d}</div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isPast = dateStr < todayStr;
                  const isAvailable = provider.availableDates?.includes(dateStr);
                  const isSelected = selectedDates.includes(dateStr);
                  return (
                    <button key={day}
                      onClick={() => !isPast && isAvailable && toggleDate(dateStr)}
                      disabled={isPast || !isAvailable}
                      style={{
                        aspectRatio: "1", borderRadius: 8, border: isSelected ? "2px solid #0a7070" : "none",
                        cursor: isPast || !isAvailable ? "default" : "pointer",
                        background: isSelected ? "#0a7070" : isAvailable && !isPast ? "rgba(10,112,112,0.08)" : "transparent",
                        color: isSelected ? "white" : isPast ? "#e2eded" : isAvailable ? "#0a7070" : "#d0dede",
                        fontSize: 13, fontWeight: isSelected || isAvailable ? 600 : 400,
                        fontFamily: "DM Sans, sans-serif", transition: "all 0.15s",
                      }}>
                      {day}
                    </button>
                  );
                })}
              </div>
              {selectedDates.length > 0 && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(10,112,112,0.06)", borderRadius: 10 }}>
                  <p style={{ fontSize: 12, color: "#065050", fontWeight: 600 }}>
                    {tr("Selected", "Выбрано", "Seçildi")}: {selectedDates.length} {tr("day(s)", "день(дней)", "gün")}
                  </p>
                  <p style={{ fontSize: 11, color: "#4a6060", marginTop: 4 }}>{selectedDates.join(", ")}</p>
                </div>
              )}
            </div>

            {/* Guests */}
            <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <User size={18} color="#0a7070" />
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                  {tr("Number of Guests", "Количество гостей", "Qonaqların sayı")}
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => setGuests(g => Math.max(1, g - 1))} style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", fontSize: 20, color: "#4a6060", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 600, color: "#021a1a", minWidth: 40, textAlign: "center" }}>{guests}</span>
                <button onClick={() => setGuests(g => Math.min(20, g + 1))} style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", fontSize: 20, color: "#4a6060", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                <span style={{ color: "#94a3a3", fontSize: 14 }}>
                  {tr(`person${guests !== 1 ? "s" : ""}`, `${guests === 1 ? "человек" : "человека"}`, `nəfər`)}
                </span>
              </div>
            </div>

            {/* Message */}
            <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <MessageSquare size={18} color="#0a7070" />
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                  {tr("Message to Guide", "Сообщение гиду", "Bələdçiyə mesaj")}
                </h2>
              </div>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder={tr("Tell the guide about your group, special requirements, interests...", "Расскажите гиду о вашей группе, пожеланиях и интересах...", "Bələdçiyə qrupunuz, xüsusi tələbləriniz və maraqlarınız haqqında məlumat verin...")}
                rows={4}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "#f8fafa", border: "1.5px solid #e2eded", color: "#0d1f1f", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>
          </div>

          {/* Summary */}
          <div className="book-summary">
            <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", marginBottom: 16 }}>
                {tr("Booking Summary", "Детали бронирования", "Rezervasiya məlumatları")}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f0f7f7", marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18 }}>
                  {provider.name ? provider.name[0].toUpperCase() : "?"}
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 15 }}>{provider.name}</p>
                  <p style={{ color: "#94a3a3", fontSize: 12 }}>{provider.carModel} {provider.carYear}</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3a3", fontSize: 13 }}>{tr("Dates", "Даты", "Tarixlər")}</span>
                  <span style={{ color: selectedDates.length > 0 ? "#021a1a" : "#e2eded", fontSize: 13, fontWeight: 600 }}>
                    {selectedDates.length > 0 ? `${selectedDates.length} ${tr("day(s)", "дн.", "gün")}` : tr("Not selected", "Не выбрано", "Seçilməyib")}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3a3", fontSize: 13 }}>{tr("Guests", "Гостей", "Qonaqlar")}</span>
                  <span style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>{guests}</span>
                </div>
                {provider.pricePerDay && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3a3", fontSize: 13 }}>{tr("Per day", "В день", "Gündə")}</span>
                    <span style={{ color: "#021a1a", fontSize: 13, fontWeight: 600 }}>${provider.pricePerDay}</span>
                  </div>
                )}
              </div>
              {provider.pricePerDay && selectedDates.length > 0 && (
                <div style={{ background: "#f0f7f7", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#4a6060", fontSize: 14 }}>{tr("Total", "Итого", "Cəmi")}</span>
                    <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, fontWeight: 700, color: "#021a1a" }}>
                      ${totalPrice}
                    </span>
                  </div>
                </div>
              )}
              <button onClick={handleSubmit} disabled={selectedDates.length === 0 || submitting}
                style={{
                  width: "100%", padding: "14px", borderRadius: 14, border: "none",
                  background: selectedDates.length === 0 ? "#e2eded" : "linear-gradient(135deg, #0a7070, #0d9090)",
                  color: selectedDates.length === 0 ? "#94a3a3" : "white",
                  fontSize: 15, fontWeight: 600, cursor: selectedDates.length === 0 ? "not-allowed" : "pointer",
                  fontFamily: "DM Sans, sans-serif", transition: "all 0.2s",
                  boxShadow: selectedDates.length > 0 ? "0 8px 24px rgba(10,112,112,0.3)" : "none",
                }}>
                {submitting
                  ? tr("Sending...", "Отправляем...", "Göndərilir...")
                  : selectedDates.length === 0
                    ? tr("Select a Date First", "Выберите дату", "Tarix seçin")
                    : tr("Send Booking Request", "Отправить заявку", "Rezervasiya sorğusu göndər")}
              </button>
              <p style={{ fontSize: 11, color: "#94a3a3", textAlign: "center", marginTop: 12 }}>
                {tr("No payment required. Guide will contact you to confirm.", "Предоплата не требуется. Гид свяжется для подтверждения.", "Ödəniş tələb olunmur. Bələdçi təsdiq üçün əlaqə saxlayacaq.")}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}