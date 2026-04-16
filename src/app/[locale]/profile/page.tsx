"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ArrowLeft, User, Lock, Globe, Check, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function ClientProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [savedInfo, setSavedInfo] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !profile) router.push(`/${locale}/auth`);
  }, [loading, profile]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      getDoc(doc(db, "users", profile.uid)).then(snap => {
        if (snap.exists()) {
          setPhone(snap.data().phone || "");
        }
      });
    }
  }, [profile]);

  const handleSaveInfo = async () => {
    if (!profile) return;
    setSavingInfo(true);
    await setDoc(doc(db, "users", profile.uid), { name, phone }, { merge: true });
    setSavingInfo(false);
    setSavedInfo(true);
    setTimeout(() => setSavedInfo(false), 3000);
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (!newPassword || !currentPassword) {
      setPasswordError(tr("Please fill all fields", "Заполните все поля", "Bütün sahələri doldurun"));
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(tr("Password must be at least 6 characters", "Пароль должен быть не менее 6 символов", "Şifrə ən az 6 simvol olmalıdır"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(tr("Passwords do not match", "Пароли не совпадают", "Şifrələr uyğun gəlmir"));
      return;
    }
    setSavingPassword(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) return;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (e: any) {
      setPasswordError(tr("Current password is incorrect", "Неверный текущий пароль", "Cari şifrə yanlışdır"));
    }
    setSavingPassword(false);
  };

  if (loading || !profile) return null;

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 12,
    background: "#f8fafa", border: "1.5px solid #e2eded",
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
      <Navbar locale={locale} />

      {/* Header */}
      <div style={{ background: "#021a1a", padding: "0 20px", height: 64, marginTop: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push(`/${locale}/dashboard`)}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 14px", cursor: "pointer", color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
            <ArrowLeft size={14} /> {tr("Dashboard", "Панель", "Panel")}
          </button>
          <span style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 20, fontWeight: 600 }}>
            {tr("My Profile", "Мой профиль", "Profilim")}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 16px" }}>

        {/* Avatar */}
        <div style={{ ...sectionStyle, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(10,112,112,0.3)" }}>
            <span style={{ color: "white", fontSize: 32, fontWeight: 700 }}>{profile.name ? profile.name[0].toUpperCase() : "?"}</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 4 }}>{profile.name}</h2>
          <p style={{ color: "#94a3a3", fontSize: 13 }}>{profile.email}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(10,112,112,0.08)", border: "1px solid rgba(10,112,112,0.2)", borderRadius: 999, padding: "4px 14px", marginTop: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0a7070" }} />
            <span style={{ color: "#0a7070", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{profile.role}</span>
          </div>
        </div>

        {/* Personal Info */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(10,112,112,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={18} color="#0a7070" />
            </div>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
              {tr("Personal Information", "Личная информация", "Şəxsi məlumatlar")}
            </h3>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{tr("Full Name", "Полное имя", "Ad Soyad")}</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder={tr("Your name", "Ваше имя", "Adınız")}
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>{tr("Phone", "Телефон", "Telefon")}</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+994 XX XXX XX XX"
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input value={profile.email || ""} disabled
              style={{ ...inputStyle, background: "#f0f7f7", color: "#94a3a3", cursor: "not-allowed" }} />
          </div>

          <button onClick={handleSaveInfo} disabled={savingInfo}
            style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: savedInfo ? "#065050" : "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {savedInfo ? <><Check size={16} /> {tr("Saved!", "Сохранено!", "Saxlanıldı!")}</> : savingInfo ? tr("Saving...", "Сохраняем...", "Saxlanılır...") : tr("Save Changes", "Сохранить изменения", "Dəyişiklikləri saxla")}
          </button>
        </div>

        {/* Change Password */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(10,112,112,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={18} color="#0a7070" />
            </div>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
              {tr("Change Password", "Изменить пароль", "Şifrəni dəyiş")}
            </h3>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{tr("Current Password", "Текущий пароль", "Cari şifrə")}</label>
            <div style={{ position: "relative" }}>
              <input value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                type={showCurrent ? "text" : "password"} placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: 44 }} />
              <button onClick={() => setShowCurrent(!showCurrent)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3a3" }}>
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{tr("New Password", "Новый пароль", "Yeni şifrə")}</label>
            <div style={{ position: "relative" }}>
              <input value={newPassword} onChange={e => setNewPassword(e.target.value)}
                type={showNew ? "text" : "password"} placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: 44 }} />
              <button onClick={() => setShowNew(!showNew)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3a3" }}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>{tr("Confirm New Password", "Подтвердите пароль", "Yeni şifrəni təsdiq edin")}</label>
            <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              type="password" placeholder="••••••••"
              style={inputStyle} />
          </div>

          {passwordError && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ color: "#ef4444", fontSize: 13 }}>{passwordError}</p>
            </div>
          )}

          {passwordSuccess && (
            <div style={{ background: "rgba(10,112,112,0.08)", border: "1px solid rgba(10,112,112,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Check size={14} color="#0a7070" />
              <p style={{ color: "#0a7070", fontSize: 13 }}>{tr("Password changed successfully!", "Пароль успешно изменён!", "Şifrə uğurla dəyişdirildi!")}</p>
            </div>
          )}

          <button onClick={handleChangePassword} disabled={savingPassword}
            style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
            {savingPassword ? tr("Changing...", "Меняем...", "Dəyişdirilir...") : tr("Change Password", "Изменить пароль", "Şifrəni dəyiş")}
          </button>
        </div>

        {/* Language */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(10,112,112,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={18} color="#0a7070" />
            </div>
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
              {tr("Language", "Язык", "Dil")}
            </h3>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { code: "en", label: "🇬🇧 English" },
              { code: "ru", label: "🇷🇺 Русский" },
              { code: "az", label: "🇦🇿 Azərbaycan" },
            ].map(l => (
              <button key={l.code} onClick={() => router.push(`/${l.code}/profile`)}
                style={{ flex: 1, padding: "10px", borderRadius: 12, border: l.code === locale ? "1.5px solid #0a7070" : "1.5px solid #e2eded", background: l.code === locale ? "rgba(10,112,112,0.08)" : "white", color: l.code === locale ? "#0a7070" : "#4a6060", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}