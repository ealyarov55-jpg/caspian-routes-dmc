"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Car, DollarSign, FileText, ArrowLeft, Check } from "lucide-react";
import AvatarUpload from "@/components/ui/AvatarUpload";

export default function ProviderProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [form, setForm] = useState({
    bio: "",
    carModel: "",
    carYear: "",
    carColor: "",
    pricePerDay: "",
    pricePerHour: "",
    languages: [] as string[],
    services: [] as string[],
    phone: "",
    whatsapp: "",
  });

  const langOptions = ["English", "Russian", "Azerbaijani", "Turkish", "Arabic"];
  const serviceOptions = ["Airport Transfer", "City Tour", "Multi-day Tour", "Hiking Guide", "Silk Road Tour", "Caspian Cruise"];

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
    if (!loading && profile?.role !== "provider") router.push(`/${locale}/dashboard`);
  }, [loading, profile]);

  useEffect(() => {
    if (profile) {
      getDoc(doc(db, "providers", profile.uid)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setPhotoURL(data.photoURL || "");
          setForm({
            bio: data.bio || "",
            carModel: data.carModel || "",
            carYear: data.carYear || "",
            carColor: data.carColor || "",
            pricePerDay: data.pricePerDay || "",
            pricePerHour: data.pricePerHour || "",
            languages: data.languages || [],
            services: data.services || [],
            phone: data.phone || "",
            whatsapp: data.whatsapp || "",
          });
        }
      });
    }
  }, [profile]);

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    await setDoc(doc(db, "providers", profile.uid), {
      ...form,
      photoURL,
      uid: profile.uid,
      name: profile.name,
      email: profile.email,
      updatedAt: new Date().toISOString(),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading || !profile) return null;

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 12,
    background: "white", border: "1.5px solid #e2eded",
    color: "#0d1f1f", fontSize: 14, fontFamily: "DM Sans, sans-serif",
    outline: "none", boxSizing: "border-box" as const,
  };

  const labelStyle = {
    color: "#4a6060", fontSize: 12, fontWeight: 600,
    textTransform: "uppercase" as const, letterSpacing: "0.1em",
    display: "block", marginBottom: 8,
  };

  const sectionStyle = {
    background: "white", borderRadius: 20, padding: 28,
    boxShadow: "0 4px 24px rgba(4,46,46,0.08)", marginBottom: 20,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => router.push(`/${locale}/dashboard`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <ArrowLeft size={14} /> Dashboard
          </button>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>Provider Profile</span>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ background: saved ? "#065050" : "linear-gradient(135deg, #0a7070, #0d9090)", border: "none", borderRadius: 12, padding: "10px 24px", cursor: "pointer", color: "white", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
          {saved ? <><Check size={16} /> Saved!</> : saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>

        {/* Avatar */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(10,112,112,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={18} color="#0a7070" />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600 }}>Profile Photo</h2>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <AvatarUpload
              uid={profile.uid}
              name={profile.name}
              currentPhoto={photoURL}
              onUpload={(url) => setPhotoURL(url)}
            />
          </div>
        </div>

        {/* Basic Info */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(10,112,112,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={18} color="#0a7070" />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600 }}>Basic Information</h2>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>About You</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell tourists about yourself, your experience, specializations..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+994 XX XXX XX XX" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>WhatsApp</label>
              <input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="+994 XX XXX XX XX" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(10,112,112,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Car size={18} color="#0a7070" />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600 }}>Vehicle Details</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Car Model</label>
              <input value={form.carModel} onChange={e => setForm({ ...form, carModel: e.target.value })}
                placeholder="Toyota Camry" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input value={form.carYear} onChange={e => setForm({ ...form, carYear: e.target.value })}
                placeholder="2022" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Color</label>
              <input value={form.carColor} onChange={e => setForm({ ...form, carColor: e.target.value })}
                placeholder="White" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={18} color="#c9a84c" />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600 }}>Pricing</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Price per Day (USD)</label>
              <input value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: e.target.value })}
                placeholder="150" type="number" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price per Hour (USD)</label>
              <input value={form.pricePerHour} onChange={e => setForm({ ...form, pricePerHour: e.target.value })}
                placeholder="25" type="number" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Languages & Services */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(10,112,112,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={18} color="#0a7070" />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600 }}>Languages & Services</h2>
          </div>

          <label style={labelStyle}>Languages Spoken</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
            {langOptions.map(lang => (
              <button key={lang} onClick={() => setForm({ ...form, languages: toggle(form.languages, lang) })}
                style={{ padding: "8px 16px", borderRadius: 999, border: form.languages.includes(lang) ? "1.5px solid #0a7070" : "1.5px solid #e2eded", background: form.languages.includes(lang) ? "rgba(10,112,112,0.1)" : "white", color: form.languages.includes(lang) ? "#0a7070" : "#4a6060", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans, sans-serif", transition: "all 0.2s" }}>
                {lang}
              </button>
            ))}
          </div>

          <label style={labelStyle}>Services Offered</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {serviceOptions.map(svc => (
              <button key={svc} onClick={() => setForm({ ...form, services: toggle(form.services, svc) })}
                style={{ padding: "8px 16px", borderRadius: 999, border: form.services.includes(svc) ? "1.5px solid #c9a84c" : "1.5px solid #e2eded", background: form.services.includes(svc) ? "rgba(201,168,76,0.1)" : "white", color: form.services.includes(svc) ? "#c9a84c" : "#4a6060", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans, sans-serif", transition: "all 0.2s" }}>
                {svc}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}