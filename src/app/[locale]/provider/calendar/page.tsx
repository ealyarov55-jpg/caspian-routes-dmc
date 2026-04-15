"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const DAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DAYS_AZ = ["Be", "Ça", "Çə", "Ca", "Cü", "Şə", "Bz"];

const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_RU = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const MONTHS_AZ = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];

export default function ProviderCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const DAYS = lang === "ru" ? DAYS_RU : lang === "az" ? DAYS_AZ : DAYS_EN;
  const MONTHS = lang === "ru" ? MONTHS_RU : lang === "az" ? MONTHS_AZ : MONTHS_EN;

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [available, setAvailable] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
    if (!loading && profile?.role !== "provider") router.push(`/${locale}/dashboard`);
  }, [loading, profile]);

  useEffect(() => {
    if (profile) {
      getDoc(doc(db, "providers", profile.uid)).then(snap => {
        if (snap.exists() && snap.data().availableDates) {
          setAvailable(snap.data().availableDates);
        }
      });
    }
  }, [profile]);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y: number, m: number) => {
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1;
  };

  const toggleDate = (dateStr: string) => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (new Date(dateStr) < todayDate) return;
    setAvailable(prev =>
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
    );
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await setDoc(doc(db, "providers", profile.uid), { availableDates: available }, { merge: true });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const todayStr = today.toISOString().split("T")[0];

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
            {tr("Availability Calendar", "Календарь доступности", "Mövcudluq təqvimi")}
          </span>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ background: saved ? "#065050" : "linear-gradient(135deg, #0a7070, #0d9090)", border: "none", borderRadius: 12, padding: "10px 20px", cursor: "pointer", color: "white", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
          {saved ? <><Check size={16} /> {tr("Saved!", "Сохранено!", "Saxlanıldı!")}</> : saving ? tr("Saving...", "Сохраняем...", "Saxlanılır...") : tr("Save", "Сохранить", "Saxla")}
        </button>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px" }}>

        {/* Info */}
        <div style={{ background: "rgba(10,112,112,0.08)", border: "1px solid rgba(10,112,112,0.2)", borderRadius: 14, padding: "14px 20px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2dd4bf", flexShrink: 0 }} />
          <p style={{ color: "#065050", fontSize: 13 }}>
            {tr(
              "Click on dates to mark yourself as available. Tourists will see your availability when booking.",
              "Нажмите на даты чтобы отметить свою доступность. Туристы увидят ваш календарь при бронировании.",
              "Mövcud olduğunuz tarixləri seçin. Turistlər rezervasiya zamanı mövcudluğunuzu görəcək."
            )}
          </p>
        </div>

        {/* Calendar */}
        <div style={{ background: "white", borderRadius: 24, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
          {/* Month navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <button onClick={prevMonth}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={16} color="#4a6060" />
            </button>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", fontWeight: 600 }}>
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth}
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #e2eded", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} color="#4a6060" />
            </button>
          </div>

          {/* Day names */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#94a3a3", textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 0" }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isPast = dateStr < todayStr;
              const isAvailable = available.includes(dateStr);
              const isToday = dateStr === todayStr;

              return (
                <button key={day} onClick={() => toggleDate(dateStr)} disabled={isPast}
                  style={{
                    aspectRatio: "1", borderRadius: 10, border: "none", cursor: isPast ? "default" : "pointer",
                    background: isAvailable ? "#0a7070" : isToday ? "rgba(10,112,112,0.08)" : "transparent",
                    color: isAvailable ? "white" : isPast ? "#d0dede" : isToday ? "#0a7070" : "#0d1f1f",
                    fontSize: 14, fontWeight: isToday || isAvailable ? 600 : 400,
                    fontFamily: "DM Sans, sans-serif", transition: "all 0.15s",
                    outline: isToday && !isAvailable ? "1.5px solid #0a7070" : "none",
                  }}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 20, marginTop: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { color: "#0a7070", label: tr("Available", "Доступен", "Mövcuddur") },
            { color: "rgba(10,112,112,0.08)", label: tr("Today", "Сегодня", "Bu gün"), outline: "1.5px solid #0a7070" },
            { color: "transparent", label: tr("Not available", "Недоступен", "Mövcud deyil") },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: item.color, border: item.outline || "1px solid #e2eded" }} />
              <span style={{ fontSize: 12, color: "#4a6060" }}>{item.label}</span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 16, color: "#0a7070", fontSize: 13, fontWeight: 600 }}>
          {available.length} {tr("day(s) marked as available", "дн. отмечено как доступно", "gün mövcud kimi qeyd edildi")}
        </p>
      </div>
    </div>
  );
}