"use client";

import Link from "next/link";
import { Clock, ArrowRight, Bookmark } from "lucide-react";
import { getT } from "@/lib/i18n";
import { useState } from "react";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export interface Tour {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  duration: string;
  price: number;
  tag?: string;
}

export default function TourCard({ tour, locale = "en" }: { tour: Tour; locale?: string }) {
  const t = getT(locale);
  const lang = (locale === "ru" || locale === "az") ? locale : "en";
  const { profile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState("");
  const [saving, setSaving] = useState(false);

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!profile) return;
    setSaving(true);
    if (saved && savedId) {
      await deleteDoc(doc(db, "savedRoutes", savedId));
      setSaved(false);
      setSavedId("");
    } else {
      const ref = await addDoc(collection(db, "savedRoutes"), {
        userId: profile.uid,
        routeId: tour.id,
        title: tour.title,
        subtitle: tour.subtitle,
        image: tour.image,
        duration: tour.duration,
        savedAt: new Date().toISOString(),
      });
      setSaved(true);
      setSavedId(ref.id);
    }
    setSaving(false);
  };

  return (
    <div className="card-hover rounded-2xl overflow-hidden bg-white flex flex-col"
      style={{ boxShadow: "0 4px 24px rgba(4,46,46,0.10)" }}>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "210px" }}>
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(2,26,26,0.75) 0%, transparent 60%)"
        }} />
        {tour.tag && (
          <span style={{
            position: "absolute", top: 12, left: 12,
            background: "#c9a84c", color: "white",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "4px 12px", borderRadius: 999,
          }}>
            {tour.tag}
          </span>
        )}

        {/* Bookmark button */}
        {profile && profile.role === "client" && (
          <button onClick={toggleSave} disabled={saving}
            style={{
              position: "absolute", top: 12, right: 12,
              width: 32, height: 32, borderRadius: "50%",
              background: saved ? "rgba(45,212,191,0.9)" : "rgba(2,26,26,0.6)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>
            <Bookmark size={14} color="white" fill={saved ? "white" : "none"} />
          </button>
        )}

        <div style={{
          position: "absolute", bottom: 12, left: 12,
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          borderRadius: 999, padding: "4px 12px",
        }}>
          <Clock size={12} color="#2dd4bf" />
          <span style={{ color: "white", fontSize: 12 }}>{tour.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{
          color: "#0a7070", fontSize: 11, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4,
          fontFamily: "DM Sans, sans-serif"
        }}>
          {tour.subtitle}
        </p>
        <h3 style={{
          fontFamily: "Cormorant Garamond, serif",
          color: "#0d1f1f", fontSize: 20, fontWeight: 600,
          lineHeight: 1.2, marginBottom: 12,
        }}>
          {tour.title}
        </h3>

        {/* Price — By request */}
        <Link
          href={`/${locale}/partners#apply`}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(10,112,112,0.08)", border: "1px solid rgba(10,112,112,0.2)",
            borderRadius: 10, padding: "8px 14px", marginBottom: 8,
            textDecoration: "none", width: "fit-content",
          }}>
          <span style={{ color: "#0a7070", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
            {tr("By request", "По запросу", "Sorğu ilə")}
          </span>
          <ArrowRight size={12} color="#0a7070" />
        </Link>

        {/* Net prices note */}
        <p style={{ color: "#94a3a3", fontSize: 11, fontFamily: "DM Sans, sans-serif", marginBottom: 12 }}>
          {tr("Net prices available for partners", "Net-цены по запросу для партнёров", "Tərəfdaşlar üçün net qiymətlər sorğu ilə")}
        </p>

        <div style={{ marginTop: "auto" }}>
          <Link
            href={`/${locale}/routes/${tour.id}`}
            className="flex items-center gap-1.5 text-white text-xs font-medium rounded-xl transition-colors duration-200 hover:bg-[#0a7070]"
            style={{
              background: "#042e2e",
              padding: "10px 16px",
              textDecoration: "none",
              fontFamily: "DM Sans, sans-serif",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {t.curated.explore} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}