"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Eye, EyeOff, ArrowRight, Clock } from "lucide-react";

type Mode = "login" | "register";

export default function AuthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { login, register } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Partner extra fields
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyCountry, setCompanyCountry] = useState("");
  const [iataCode, setIataCode] = useState("");

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError(tr("Please fill all fields", "Заполните все поля", "Bütün sahələri doldurun"));
      return;
    }
    if (mode === "register" && !name) {
      setError(tr("Please enter your name", "Введите ваше имя", "Adınızı daxil edin"));
      return;
    }
    if (mode === "register" && role === "partner" && !companyName) {
      setError(tr("Please enter your company name", "Введите название компании", "Şirkətin adını daxil edin"));
      return;
    }
    if (mode === "register" && role === "partner" && !agreedToTerms) {
      setError(tr("Please accept the Terms & Conditions", "Примите условия использования", "İstifadə şərtlərini qəbul edin"));
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        router.push(`/${locale}/dashboard`);
      } else {
        const actualRole: UserRole = role === "partner" ? "pending_partner" as UserRole : role;
        await register(email, password, name, actualRole, {
          companyName,
          companyWebsite,
          companyCountry,
          iataCode,
        });
        if (role === "partner") {
          setRegistered(true);
        } else {
          router.push(`/${locale}/dashboard`);
        }
      }
    } catch (e: any) {
      setError(e.message || tr("Something went wrong", "Что-то пошло не так", "Xəta baş verdi"));
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "client",
      label: tr("Tourist / Client", "Турист / Клиент", "Turist / Müştəri"),
      desc: tr("Browse routes & book", "Смотреть маршруты и бронировать", "Marşrutlara bax və rezerv et"),
    },
    {
      value: "provider",
      label: tr("Driver / Guide", "Водитель / Гид", "Sürücü / Bələdçi"),
      desc: tr("Offer your services", "Предложите свои услуги", "Xidmətlərinizi təklif edin"),
    },
    {
      value: "partner",
      label: tr("Travel Agency / Partner", "Турагентство / Партнёр", "Turizm agentliyi / Tərəfdaş"),
      desc: tr("B2B access & net prices", "B2B доступ и net-цены", "B2B giriş və net qiymətlər"),
    },
  ];

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 12,
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif",
    outline: "none", boxSizing: "border-box" as const,
  };

  const labelStyle = {
    color: "rgba(255,255,255,0.6)", fontSize: 12, display: "block", marginBottom: 6,
  };

  if (registered) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #021a1a 0%, #065050 50%, #0a5560 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "DM Sans, sans-serif" }}>
        <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 40, backdropFilter: "blur(20px)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #d4a843)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Clock size={32} color="white" />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 28, marginBottom: 16 }}>
              {tr("Application Received!", "Заявка получена!", "Müraciət qəbul edildi!")}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
              {tr(
                "Thank you for applying to become a partner. We will review your application and contact you within 24 hours.",
                "Спасибо за заявку на партнёрство. Мы рассмотрим её и свяжемся с вами в течение 24 часов.",
                "Tərəfdaşlıq müraciətiniz üçün təşəkkür edirik. 24 saat ərzində nəzərdən keçirəcəyik."
              )}
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>
              {tr(
                "After approval you will receive full access to net prices and the partner portal.",
                "После одобрения вы получите полный доступ к net-ценам и партнёрскому порталу.",
                "Təsdiqləndikdən sonra net qiymətlərə və tərəfdaş portalına tam giriş əldə edəcəksiniz."
              )}
            </p>
            <button onClick={() => router.push(`/${locale}`)}
              style={{ background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "13px 28px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
              {tr("Back to Home", "На главную", "Ana səhifəyə qayıt")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #021a1a 0%, #065050 50%, #0a5560 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "DM Sans, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: role === "partner" && mode === "register" ? 560 : 460, position: "relative", zIndex: 10 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(10,112,112,0.4)" }}>
            <svg viewBox="0 0 40 40" style={{ width: 32, height: 32 }} fill="none">
              <path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C30 36 36 28 36 20" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 4 L24 14 L20 12 L16 14 Z" fill="#c9a84c"/>
              <circle cx="20" cy="20" r="3" fill="#2dd4bf"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>Caspian Routes</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Travel Routes DMC</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 32, backdropFilter: "blur(20px)" }}>

          {/* Tabs */}
          <div style={{ display: "flex", background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {(["login", "register"] as Mode[]).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); setAgreedToTerms(false); }}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "DM Sans, sans-serif", background: mode === m ? "#0a7070" : "transparent", color: mode === m ? "white" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
                {m === "login" ? tr("Sign In", "Войти", "Daxil ol") : tr("Sign Up", "Регистрация", "Qeydiyyat")}
              </button>
            ))}
          </div>

          {/* Role selector */}
          {mode === "register" && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {tr("I am a...", "Я являюсь...", "Mən...")}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {roles.map((r) => (
                  <button key={r.value} onClick={() => setRole(r.value as UserRole)}
                    style={{ flex: 1, minWidth: 120, padding: "12px", borderRadius: 12, cursor: "pointer", border: role === r.value ? "1.5px solid #2dd4bf" : "1.5px solid rgba(255,255,255,0.1)", background: role === r.value ? "rgba(45,212,191,0.1)" : "rgba(255,255,255,0.03)", textAlign: "left", transition: "all 0.2s" }}>
                    <p style={{ color: role === r.value ? "#2dd4bf" : "white", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r.label}</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name */}
          {mode === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>{tr("Full Name", "Полное имя", "Ad Soyad")}</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder={tr("Your name", "Ваше имя", "Adınız")}
                style={inputStyle} />
            </div>
          )}

          {/* Partner extra fields */}
          {mode === "register" && role === "partner" && (
            <>
              <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
                <p style={{ color: "#c9a84c", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
                  {tr("Company Information", "Информация о компании", "Şirkət məlumatları")}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>{tr("Company Name", "Название компании", "Şirkətin adı")} *</label>
                    <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                      placeholder={tr("Your travel agency", "Ваше турагентство", "Turizm agentliyiniz")}
                      style={inputStyle} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>{tr("Country", "Страна", "Ölkə")}</label>
                      <input value={companyCountry} onChange={e => setCompanyCountry(e.target.value)}
                        placeholder={tr("Russia, UAE, Germany...", "Россия, ОАЭ...", "Rusiya, BƏƏ...")}
                        style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>{tr("IATA Code (optional)", "Код IATA (необязательно)", "IATA kodu (isteğe bağlı)")}</label>
                      <input value={iataCode} onChange={e => setIataCode(e.target.value)}
                        placeholder="12345678"
                        style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>{tr("Company Website", "Сайт компании", "Şirkətin veb saytı")}</label>
                    <input value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)}
                      placeholder="https://youragency.com"
                      style={inputStyle} />
                  </div>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <Clock size={14} color="#c9a84c" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.5 }}>
                  {tr(
                    "Partner accounts are reviewed within 24 hours. After approval you get full access to net prices.",
                    "Партнёрские аккаунты проверяются в течение 24 часов. После одобрения — полный доступ к net-ценам.",
                    "Tərəfdaş hesabları 24 saat ərzində nəzərdən keçirilir. Təsdiqləndikdən sonra net qiymətlərə tam giriş."
                  )}
                </p>
              </div>
            </>
          )}

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{tr("Email", "Электронная почта", "E-poçt")}</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="your@email.com"
              style={inputStyle} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16, position: "relative" }}>
            <label style={labelStyle}>{tr("Password", "Пароль", "Şifrə")}</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? "text" : "password"} placeholder="••••••••"
              style={{ ...inputStyle, padding: "12px 48px 12px 16px" }} />
            <button onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: 14, top: 36, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Terms checkbox — only for partner registration */}
          {mode === "register" && role === "partner" && (
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 16, padding: "12px 14px", background: agreedToTerms ? "rgba(45,212,191,0.06)" : "rgba(255,255,255,0.03)", borderRadius: 10, border: agreedToTerms ? "1px solid rgba(45,212,191,0.2)" : "1px solid rgba(255,255,255,0.08)", transition: "all 0.2s" }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#0a7070", cursor: "pointer", marginTop: 2, flexShrink: 0 }}
              />
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.6 }}>
                {tr("I have read and agree to the ", "Я прочитал и принимаю ", "Oxudum və razılaşıram ")}
                <a href={`/${locale}/terms`} target="_blank" rel="noopener noreferrer" style={{ color: "#2dd4bf", textDecoration: "none", fontWeight: 600 }}
                  onClick={e => e.stopPropagation()}>
                  {tr("Terms & Conditions", "Условия использования", "İstifadə şərtləri")}
                </a>
                {tr(" and ", " и ", " və ")}
                <a href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer" style={{ color: "#2dd4bf", textDecoration: "none", fontWeight: 600 }}
                  onClick={e => e.stopPropagation()}>
                  {tr("Privacy Policy", "Политику конфиденциальности", "Məxfilik siyasəti")}
                </a>
                {tr(" of Caspian Routes DMC.", " Caspian Routes DMC.", " Caspian Routes DMC.")}
              </span>
            </label>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ color: "#fca5a5", fontSize: 13 }}>{error}</p>
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading || (mode === "register" && role === "partner" && !agreedToTerms)}
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: (loading || (mode === "register" && role === "partner" && !agreedToTerms)) ? "rgba(10,112,112,0.4)" : "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", fontSize: 15, fontWeight: 600, cursor: (loading || (mode === "register" && role === "partner" && !agreedToTerms)) ? "not-allowed" : "pointer", fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 24px rgba(10,112,112,0.3)", opacity: (mode === "register" && role === "partner" && !agreedToTerms) ? 0.6 : 1 }}>
            {loading
              ? tr("Please wait...", "Подождите...", "Gözləyin...")
              : mode === "login"
                ? tr("Sign In", "Войти", "Daxil ol")
                : role === "partner"
                  ? tr("Submit Application", "Подать заявку", "Müraciət göndər")
                  : tr("Create Account", "Создать аккаунт", "Hesab yarat")}
            {!loading && <ArrowRight size={16} />}
          </button>

          {/* Switch mode */}
          <p style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            {mode === "login"
              ? tr("Don't have an account? ", "Нет аккаунта? ", "Hesabınız yoxdur? ")
              : tr("Already have an account? ", "Уже есть аккаунт? ", "Artıq hesabınız var? ")}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setAgreedToTerms(false); }}
              style={{ background: "none", border: "none", color: "#2dd4bf", cursor: "pointer", fontSize: 13, fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
              {mode === "login"
                ? tr("Sign Up", "Зарегистрироваться", "Qeydiyyatdan keç")
                : tr("Sign In", "Войти", "Daxil ol")}
            </button>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>© 2026 Caspian Routes DMC</p>
      </div>
    </div>
  );
}