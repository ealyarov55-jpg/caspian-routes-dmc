"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Clock, Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

interface SavedRoute {
  id: string;
  routeId: string;
  title: string;
  subtitle: string;
  image: string;
  duration: string;
  userId: string;
  savedAt: string;
}

export default function SavedRoutesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
  }, [loading, profile]);

  useEffect(() => {
    if (profile) {
      const q = query(collection(db, "savedRoutes"), where("userId", "==", profile.uid));
      getDocs(q).then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as SavedRoute));
        data.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        setSavedRoutes(data);
        setLoadingSaved(false);
      });
    }
  }, [profile]);

  const handleRemove = async (savedId: string) => {
    await deleteDoc(doc(db, "savedRoutes", savedId));
    setSavedRoutes(prev => prev.filter(r => r.id !== savedId));
  };

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
            {tr("Saved Routes", "Сохранённые маршруты", "Saxlanılmış marşrutlar")}
          </span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, padding: "4px 14px" }}>
          <span style={{ color: "white", fontSize: 13 }}>{savedRoutes.length} {tr("saved", "сохранено", "saxlanıldı")}</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
        {loadingSaved ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#94a3a3" }}>{tr("Loading...", "Загружаем...", "Yüklənir...")}</p>
          </div>
        ) : savedRoutes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
            <Bookmark size={48} color="#e2eded" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 8 }}>
              {tr("No saved routes yet", "Нет сохранённых маршрутов", "Hələ saxlanılmış marşrut yoxdur")}
            </h3>
            <p style={{ color: "#94a3a3", fontSize: 14, marginBottom: 24 }}>
              {tr("Save routes you like to view them later", "Сохраняйте понравившиеся маршруты", "Bəyəndiyiniz marşrutları sonra baxmaq üçün saxlayın")}
            </p>
            <Link href={`/${locale}/routes`}
              style={{ display: "inline-block", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "DM Sans, sans-serif" }}>
              {tr("Browse Routes", "Смотреть маршруты", "Marşrutlara bax")}
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {savedRoutes.map(route => (
              <div key={route.id} style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <div style={{ position: "relative", height: 180 }}>
                  <img src={route.image} alt={route.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(2,26,26,0.7) 0%, transparent 60%)" }} />
                  <button onClick={() => handleRemove(route.id)}
                    style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", background: "rgba(2,26,26,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Bookmark size={14} color="#2dd4bf" fill="#2dd4bf" />
                  </button>
                  <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={12} color="#2dd4bf" />
                    <span style={{ color: "white", fontSize: 12 }}>{route.duration}</span>
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <p style={{ color: "#0a7070", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>{route.subtitle}</p>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600, marginBottom: 16 }}>{route.title}</h3>
                  <Link href={`/${locale}/routes/${route.routeId}`}
                    style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "10px", borderRadius: 12, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                    {tr("View Route", "Открыть маршрут", "Marşruta bax")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}