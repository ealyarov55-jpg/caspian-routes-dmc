import Link from "next/link";
import Footer from "@/components/sections/Footer";
import { FadeIn, BlogCards } from "@/components/sections/HomeAnimations";
import AzerbaijanMap from "@/components/sections/AzerbaijanMap";
const content = {
  ru: {
    badge: "AI Travel Planner",
    headline: "Спланируй\nАзербайджан",
    accent: "за 2 минуты",
    sub: "Реальные места Азербайджана. Прямые ссылки на отели и экскурсии. Без регистрации и лишних шагов.",
    cta: "Создать маршрут",
    weatherLabel: "Баку сейчас",
    rubLabel: "1 AZN",
    blogTitle: "Путеводитель",
    editorialLabel: "Редакция советует",
    allArticles: "Все статьи →",
    howTitle: "Как это работает",
    steps: [
      { num: "01", label: "Инициация", title: "Выбор ритма", desc: "Интересы, темп и группа — за 60 секунд." },
      { num: "02", label: "Анализ", title: "AI-просчёт", desc: "Только реальные живые локации Азербайджана." },
      { num: "03", label: "Результат", title: "Готовый маршрут", desc: "Инсайды и прямые ссылки на бронирование." },
    ],
    mapTitle: "Азербайджан на карте",
  },
  en: {
    badge: "AI Travel Planner",
    headline: "Plan\nAzerbaijan",
    accent: "in 2 minutes",
    sub: "Real locations. Partner links for hotels and tours. No signup required.",
    cta: "Create Itinerary",
    weatherLabel: "Baku now",
    rubLabel: "1 AZN",
    blogTitle: "Travel Guide",
    editorialLabel: "Editor's picks",
    allArticles: "All articles →",
    howTitle: "How it works",
    steps: [
      { num: "01", label: "Init", title: "Set the rhythm", desc: "Interests, pace and group — in 60 seconds." },
      { num: "02", label: "Analysis", title: "AI processing", desc: "Only real, living locations in Azerbaijan." },
      { num: "03", label: "Result", title: "Ready itinerary", desc: "Insider tips and direct booking links." },
    ],
    mapTitle: "Azerbaijan on the map",
  },
  az: {
    badge: "AI Səyahət Planlayıcısı",
    headline: "Azərbaycanı\nPlanlaşdır",
    accent: "2 dəqiqədə",
    sub: "Real lokasiyalar. Otel və tur üçün tərəfdaş linklər. Qeydiyyatsız.",
    cta: "Marşrut Yarat",
    weatherLabel: "Bakı indi",
    rubLabel: "1 AZN",
    blogTitle: "Bələdçi",
    editorialLabel: "Redaksiya tövsiyə edir",
    allArticles: "Bütün məqalələr →",
    howTitle: "Necə işləyir",
    steps: [
      { num: "01", label: "Başlanğıc", title: "Ritm seçimi", desc: "Maraqlar, temp və qrup — 60 saniyədə." },
      { num: "02", label: "Analiz", title: "AI hesablaması", desc: "Yalnız real Azərbaycan lokasiyaları." },
      { num: "03", label: "Nəticə", title: "Hazır marşrut", desc: "İnsaydlar və rezervasiya linkləri." },
    ],
    mapTitle: "Azərbaycan xəritədə",
  },
  tr: {
    badge: "AI Seyahat Planlayıcısı",
    headline: "Azerbaycan'ı\nPlanla",
    accent: "2 dakikada",
    sub: "Gerçek lokasyonlar. Otel ve tur için ortak linkler. Kayıt gerekmez.",
    cta: "Rota Oluştur",
    weatherLabel: "Bakü şimdi",
    rubLabel: "1 AZN",
    blogTitle: "Seyahat Rehberi",
    editorialLabel: "Editörün seçimi",
    allArticles: "Tüm makaleler →",
    howTitle: "Nasıl çalışır",
    steps: [
      { num: "01", label: "Başlangıç", title: "Ritim seçimi", desc: "İlgiler, tempo ve grup — 60 saniyede." },
      { num: "02", label: "Analiz", title: "AI işlemi", desc: "Sadece gerçek Azerbaycan lokasyonları." },
      { num: "03", label: "Sonuç", title: "Hazır rota", desc: "İpuçları ve doğrudan rezervasyon linkleri." },
    ],
    mapTitle: "Azerbaycan haritada",
  },
};

const blogPosts = [
  {
    slug: { ru: "marshrut-baku-3-dnya", en: "baku-3-days", az: "marshrut-baku-3-dnya", tr: "baku-3-days" },
    title: { ru: "Маршрут по Баку на 3 дня", en: "Baku 3-Day Itinerary", az: "Bakı 3 günlük marşrut", tr: "Bakü 3 Günlük Rota" },
    desc: { ru: "Старый город, Пламенные башни, набережная и лучшие рестораны.", en: "Old City, Flame Towers, boulevard and the best restaurants.", az: "Qala, Alov qüllələri, bulvar.", tr: "Eski Şehir, Alev Kuleleri, bulvar." },
    image: "/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg",
    tag: { ru: "Маршрут", en: "Itinerary", az: "Marşrut", tr: "Rota" },
  },
  {
    slug: { ru: "gobustan-kak-dobratsa", en: "gobustan-from-baku", az: "gobustan-kak-dobratsa", tr: "gobustan-from-baku" },
    title: { ru: "Гобустан из Баку", en: "Gobustan from Baku", az: "Bakıdan Qobustan", tr: "Bakü'den Gobustan" },
    desc: { ru: "Грязевые вулканы, наскальные рисунки — однодневная поездка.", en: "Mud volcanoes, petroglyphs — a day trip.", az: "Palçıq vulkanları, qaya rəsmləri.", tr: "Çamur volkanları, kaya resimleri." },
    image: "/images/pozziss-azerbaijan-4856054_1920-opt.jpg",
    tag: { ru: "Природа", en: "Nature", az: "Təbiət", tr: "Doğa" },
  },
  {
    slug: { ru: "baku-letom", en: "baku-summer", az: "baku-letom", tr: "baku-summer" },
    title: { ru: "Баку летом", en: "Baku in Summer", az: "Yay Bakısı", tr: "Yazın Bakü" },
    desc: { ru: "Жара, Каспий, ночная жизнь и фестивали.", en: "Heat, Caspian, nightlife and festivals.", az: "İsti, Xəzər, gecə həyatı.", tr: "Sıcak, Hazar, gece hayatı." },
    image: "/images/pexels-zulfugarkarimov-33085326-opt.jpg",
    tag: { ru: "Сезон", en: "Season", az: "Mövsüm", tr: "Sezon" },
  },
];

const T = {
  bg: "#06090f",
  accent: "#00d4aa",
  border: "rgba(255,255,255,0.06)",
  text: "#e8edf5",
  textSoft: "#94a3b8",
  textMuted: "#475569",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
  font: "'DM Sans', system-ui, sans-serif",
};

async function getWeather() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.caspian-routes.com"}/api/weather`, { next: { revalidate: 1800 } });
    return await res.json();
  } catch { return { temp: null }; }
}

async function getCurrency() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.caspian-routes.com"}/api/currency`, { cache: "no-store" });
    return await res.json();
  } catch { return { rub: null, usd: null, eur: null, try_: null, aed: null }; }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = (locale === "ru" || locale === "az" || locale === "tr") ? locale : "en";
  const t = content[lang];

  const [weather, currency] = await Promise.all([getWeather(), getCurrency()]);

  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d194304.64910730564!2d49.6570777!3d40.3947365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6605f2a7c9ba!2z0J_QkNCa0KMsINCQ0LfQtdGA0LHQsNC50LTQttCw0L0!5e0!3m2!1sru!2s!4v1620000000000!5m2!1sru!2s";

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Caspian Routes",
    "description": t.sub,
    "url": `https://www.caspian-routes.com/${locale}`,
    "logo": "https://www.caspian-routes.com/favicon.png",
    "image": "https://www.caspian-routes.com/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg",
    "address": { "@type": "PostalAddress", "addressLocality": "Baku", "addressCountry": "AZ" },
    "areaServed": { "@type": "Country", "name": "Azerbaijan" },
    "serviceType": "AI Travel Planning",
    "priceRange": "Free",
    "sameAs": ["https://www.caspian-routes.com"]
  };

  return (
    <main style={{ background: T.bg, minHeight: "100vh", color: T.text, fontFamily: T.font, position: "relative", overflow: "hidden" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />

     <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
  
  @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
  @keyframes gridPulse { 0%, 100% { opacity: 0.03; } 50% { opacity: 0.06; } }
  
  .nav-cta {
    display: inline-block; padding: 9px 20px;
    background: transparent; color: #00d4aa;
    border: 1px solid rgba(0,212,170,0.4); border-radius: 8px;
    font-size: 12px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none; cursor: pointer;
    letter-spacing: 0.05em; transition: all 0.2s ease;
  }
  .nav-cta:hover { background: rgba(0,212,170,0.08); border-color: #00d4aa; }
  
  .hero-cta {
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    padding: 18px 48px;
    background: #00d4aa; color: #06090f;
    border: none; border-radius: 10px;
    font-size: 16px; font-weight: 800;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none; cursor: pointer;
    letter-spacing: 0.02em; transition: all 0.2s ease;
    box-shadow: 0 0 40px rgba(0,212,170,0.3);
  }
  .hero-cta:hover { background: #00b894; transform: translateY(-2px); box-shadow: 0 8px 40px rgba(0,212,170,0.4); }
  
  .blog-card-new {
    display: block; text-decoration: none;
    border-radius: 10px; overflow: hidden;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    transition: border-color 0.25s ease;
  }
  .blog-card-new:hover { border-color: rgba(0,212,170,0.2); }
  .blog-card-new img { transition: transform 0.6s ease; display: block; width: 100%; }
  .blog-card-new:hover img { transform: scale(1.03); }
  
  .data-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(8px);
  }
  
  .mobile-cta-fixed { display: none; }
  
  .dest-card { border: 1px solid rgba(255,255,255,0.06); transition: border-color 0.3s ease, transform 0.3s ease; }
  .dest-card:hover { border-color: rgba(0,212,170,0.3); transform: translateY(-4px); }
  .dest-card:hover .dest-img { transform: scale(1.06); }

  @media (max-width: 1024px) and (min-width: 768px) { 
    .dest-grid { grid-template-columns: repeat(2, 1fr) !important; } 
  }

  @media (max-width: 767px) {
  .hero-section { padding: 0 20px !important; }
  .hero-content { padding-top: 72px !important; padding-bottom: 80px !important; }
  .hero-headline { font-size: clamp(2rem, 9vw, 3rem) !important; letter-spacing: -1px !important; line-height: 1.05 !important; }
  .hero-accent { font-size: clamp(2rem, 9vw, 3rem) !important; letter-spacing: -1px !important; }
  .hero-sub { font-size: 15px !important; line-height: 1.6 !important; max-width: 100% !important; }
  .hero-cta { display: inline-flex !important; padding: 14px 32px !important; font-size: 14px !important; }
  .nav-cta { display: inline-block !important; font-size: 11px !important; padding: 7px 14px !important; }
  .chips-row { flex-direction: row !important; gap: 8px !important; margin-bottom: 32px !important; flex-wrap: wrap !important; }
  .data-chip { width: auto !important; flex: 1 !important; min-width: 0 !important; }
  .blog-grid-new { grid-template-columns: 1fr !important; gap: 12px !important; }
  .how-grid-new { grid-template-columns: 1fr !important; }
  .how-step-new { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06) !important; padding-left: 0 !important; padding-right: 0 !important; padding-top: 32px !important; margin-top: 32px !important; }
  .how-step-new:first-child { border-top: none !important; margin-top: 0 !important; padding-top: 0 !important; }
  .map-section { padding: 40px 20px !important; }
  .how-section { padding: 0 20px 60px !important; }
  .blog-section { padding: 0 20px 60px !important; }
  .mobile-cta-fixed { display: none !important; }
  .nav-desktop-links { display: none !important; }
  .nav-logo-text { font-size: 13px !important; }
  .dest-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
}
`}</style>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-5%", left: "70%", width: 400, height: 400, borderRadius: "50%", background: "rgba(0,212,170,0.04)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "-10%", width: 350, height: 350, borderRadius: "50%", background: "rgba(0,100,200,0.03)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", animation: "gridPulse 8s ease infinite" }} />
      </div>

      {/* Navbar */}
<nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: `1px solid ${T.border}`, backdropFilter: "blur(12px)", background: "rgba(6,9,15,0.85)", gap: 8 }}>
  <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
    <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent, boxShadow: `0 0 8px ${T.accent}`, animation: "pulse 2s ease infinite" }} />
    <span className="nav-logo-text" style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 800, letterSpacing: -0.5, color: T.text, whiteSpace: "nowrap" }}>
      CASPIAN<span style={{ color: T.accent }}>.</span>ROUTES
    </span>
  </Link>
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
    <Link href={`/${locale}/blog`} className="nav-desktop-links" style={{ color: T.textSoft, fontSize: 13, textDecoration: "none" }}>
      {lang === "ru" ? "Путеводитель" : lang === "az" ? "Bələdçi" : lang === "tr" ? "Rehber" : "Travel Guide"}
    </Link>
    <Link href={`/${locale}/contact`} className="nav-desktop-links" style={{ color: T.textSoft, fontSize: 13, textDecoration: "none" }}>
      {lang === "ru" ? "Контакт" : "Contact"}
    </Link>
    <div className="nav-lang" style={{ display: "flex", gap: 4, padding: "4px 6px", borderRadius: 6, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}` }}>
      {["ru", "en", "az", "tr"].map(l => (
        <Link key={l} href={`/${l}`} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, color: locale === l ? T.accent : T.textMuted, background: locale === l ? "rgba(0,212,170,0.08)" : "transparent", textDecoration: "none", fontWeight: locale === l ? 600 : 400 }}>{l.toUpperCase()}</Link>
      ))}
    </div>
    <Link href={`/${locale}/planner`} className="nav-cta">{t.cta} →</Link>
  </div>
</nav>

      {/* Hero */}
      <section className="hero-section" style={{ position: "relative", zIndex: 5, minHeight: "100vh", display: "flex", alignItems: "center", padding: "0 48px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/baku-hero.jpg')", backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.45, zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(6,9,15,0.92) 0%, rgba(6,9,15,0.75) 50%, rgba(6,9,15,0.4) 100%)", zIndex: 1 }} />
        <div className="hero-content" style={{ position: "relative", zIndex: 2, maxWidth: 1280, margin: "0 auto", width: "100%", paddingTop: 80 }}>
          <FadeIn delay={0}>
            <div className="chips-row" style={{ display: "flex", gap: 10, marginBottom: 48 }}>
              {weather.temp !== null && (
                <div className="data-chip">
                  <span style={{ fontSize: 15 }}>🌤</span>
                  <div>
                    <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{t.weatherLabel}</div>
                    <div style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>{weather.temp}°C, {weather.description}</div>
                  </div>
                </div>
              )}
              {currency.rub && (
                <div className="data-chip">
                  <span style={{ fontSize: 15 }}>💱</span>
                  <div>
                    <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{t.rubLabel}</div>
                    <div style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>
                      {currency.rub} ₽ · ${currency.usd} · €{currency.eur} · ₺{currency.try_} · {currency.aed} د.إ
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 11, color: T.accent, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600 }}>{t.badge}</span>
            </div>
            <h1 className="hero-headline" style={{ fontFamily: T.fontDisplay, fontSize: "clamp(3.5rem, 7vw, 7rem)", fontWeight: 800, lineHeight: 0.95, margin: "0 0 8px", letterSpacing: -2, whiteSpace: "pre-line" }}>
              {t.headline}
            </h1>
            <h1 className="hero-headline hero-accent" style={{ fontFamily: T.fontDisplay, fontSize: "clamp(3.5rem, 7vw, 7rem)", fontWeight: 800, lineHeight: 0.95, margin: "0 0 32px", letterSpacing: -2, color: T.accent }}>
              {t.accent}
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="hero-sub" style={{ color: T.textSoft, fontSize: 18, lineHeight: 1.7, maxWidth: 480, margin: "0 0 40px" }}>{t.sub}</p>
            <Link href={`/${locale}/planner`} className="hero-cta">{t.cta} →</Link>
          </FadeIn>
        </div>
      </section>
{/* Popular Destinations */}
      <section style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "80px 48px 60px" }}>
        <FadeIn>
          <div style={{ marginBottom: 48 }}>
            <p style={{ color: T.textMuted, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>✦ {lang === "ru" ? "Популярные направления" : "Popular destinations"}</p>
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: T.text, fontWeight: 800, margin: "0 0 8px" }}>
              {lang === "ru" ? "Популярные направления" : "Popular destinations"}
            </h2>
            <p style={{ color: T.textMuted, fontSize: 14, margin: 0 }}>
              {lang === "ru" ? "Выберите регион — и ИИ построит для вас готовый маршрут" : "Choose a region and AI will build your itinerary"}
            </p>
          </div>
        </FadeIn>
        <div className="dest-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
{ name: lang === "ru" ? "Баку" : lang === "az" ? "Bakı" : lang === "tr" ? "Bakü" : "Baku", desc: lang === "ru" ? "Столица и сердце Азербайджана" : lang === "az" ? "Azərbaycanın paytaxtı" : lang === "tr" ? "Azerbaycan'ın başkenti" : "Capital of Azerbaijan", img: "/images/Baku city aerial view.jpeg" },
{ name: lang === "ru" ? "Габала" : lang === "az" ? "Qəbələ" : lang === "tr" ? "Gabala" : "Gabala", desc: lang === "ru" ? "Швейцария Азербайджана" : lang === "az" ? "Azərbaycanın İsveçrəsi" : lang === "tr" ? "Azerbaycan'ın İsviçresi" : "Switzerland of Azerbaijan", img: "/images/gabala azerbaijan nature forest.jpg" },
{ name: lang === "ru" ? "Шеки" : lang === "az" ? "Şəki" : lang === "tr" ? "Şeki" : "Sheki", desc: lang === "ru" ? "Древний город Шёлкового пути" : lang === "az" ? "Qədim İpək Yolu şəhəri" : lang === "tr" ? "Antik İpek Yolu şehri" : "Ancient Silk Road city", img: "/images/Sheki palace Azerbaijan.jpg" },
{ name: lang === "ru" ? "Гобустан" : lang === "az" ? "Qobustan" : lang === "tr" ? "Gobustan" : "Gobustan", desc: lang === "ru" ? "Петроглифы и грязевые вулканы" : lang === "az" ? "Qayaüstü rəsmlər" : lang === "tr" ? "Kaya resimleri" : "Petroglyphs and mud volcanoes", img: "/images/gobustan mud volcanoes petroglyphs.jpg" },
{ name: lang === "ru" ? "Хыналыг" : lang === "az" ? "Xınalıq" : lang === "tr" ? "Hınalıg" : "Khinalug", desc: lang === "ru" ? "Высокогорное село" : lang === "az" ? "Dağ kəndi" : lang === "tr" ? "Dağ köyü" : "High mountain village", img: "/images/khinalug village azerbaijan mountains.jpg" },
{ name: lang === "ru" ? "Лагич" : lang === "az" ? "Lahıc" : lang === "tr" ? "Lahıc" : "Lahij", desc: lang === "ru" ? "Деревня мастеров" : lang === "az" ? "Sənətkarlar kəndi" : lang === "tr" ? "Zanaatkârlar köyü" : "Village of craftsmen", img: "/images/lahij village craftsmen azerbaijan copper.jpg" },
{ name: lang === "ru" ? "Шахдаг" : lang === "az" ? "Şahdağ" : lang === "tr" ? "Şahdağ" : "Shahdag", desc: lang === "ru" ? "Горный курорт" : lang === "az" ? "Dağ kurort" : lang === "tr" ? "Dağ tatil köyü" : "Mountain resort", img: "/images/shahdag ski resort azerbaijan winter.jpg" },
{ name: lang === "ru" ? "Губа" : lang === "az" ? "Quba" : lang === "tr" ? "Kuba" : "Guba", desc: lang === "ru" ? "Яблочный край" : lang === "az" ? "Alma diyarı" : lang === "tr" ? "Elma diyarı" : "Apple region", img: "/images/Quba.jpg" },
].map((dest, i) => (
  <Link key={i} href={`/${locale}/planner`} className="dest-card" style={{ textDecoration: "none", borderRadius: 12, overflow: "hidden", position: "relative", display: "block", background: "#0a0f1a" }}>
    <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
      <img src={dest.img} alt={dest.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease", display: "block" }} className="dest-img" />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,9,15,0.95) 0%, rgba(6,9,15,0.3) 60%, transparent 100%)" }} />
    </div>
    <div style={{ padding: "14px 16px 16px", borderTop: `1px solid ${T.border}`, background: "rgba(255,255,255,0.02)" }}>
      <h3 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(0.85rem, 4vw, 1.1rem)", color: T.text, fontWeight: 800, margin: "0 0 4px", lineHeight: 1.2, wordBreak: "break-word" }}>{dest.name}</h3>
      <p style={{ color: T.textMuted, fontSize: 12, margin: "0 0 12px", lineHeight: 1.4 }}>{dest.desc}</p>
      <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>
        {lang === "ru" ? "Построить маршрут →" : lang === "az" ? "Marşrut yarat →" : lang === "tr" ? "Rota oluştur →" : "Build itinerary →"}
      </span>
    </div>
  </Link>
))}
        </div>
      </section>
     <AzerbaijanMap locale={locale} lang={lang} />
    
{/* What you get */}
<section style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "80px 48px 60px" }}>
  <style>{`
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .feature-card { padding: 28px 24px; border-radius: 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); transition: border-color 0.3s ease, transform 0.3s ease; }
    .feature-card:hover { border-color: rgba(0,212,170,0.2) !important; transform: translateY(-3px); }
    .feature-icon { width: 56px; height: 56px; border-radius: 12px; background: rgba(0,212,170,0.06); border: 1px solid rgba(0,212,170,0.12); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .dest-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; padding: 0 !important; }
.dest-card h3 { font-size: 0.95rem !important; }
.features-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
.feature-card { padding: 16px 14px !important; }
    @media(max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr) !important; } }
    @media(max-width: 767px) { .features-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; } .feature-card { padding: 20px 16px; } }
  @media (max-width: 767px) {
  .dest-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
  .features-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
  .feature-card { padding: 16px 14px !important; }
  .az-map-section { padding: 40px 20px 40px !important; }
@media (max-width: 767px) {
  section { padding-left: 20px !important; padding-right: 20px !important; padding-top: 48px !important; padding-bottom: 40px !important; }
}
  }
  `}</style>

  <FadeIn>
    <div style={{ marginBottom: 48 }}>
      <p style={{ color: T.textMuted, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>
        ✦ {lang === "ru" ? "Преимущества" : lang === "az" ? "Üstünlüklər" : lang === "tr" ? "Avantajlar" : "Features"}
      </p>
      <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: T.text, fontWeight: 800, margin: "0 0 8px" }}>
        {lang === "ru" ? "Что вы получите" : lang === "az" ? "Nə əldə edəcəksiniz" : lang === "tr" ? "Ne elde edeceksiniz" : "What you will get"}
      </h2>
      <p style={{ color: T.textMuted, fontSize: 14, margin: 0 }}>
        {lang === "ru" ? "Всё необходимое для идеальной поездки по Азербайджану" : lang === "az" ? "Azərbaycana mükəmməl səyahət üçün hər şey" : lang === "tr" ? "Azerbaycan'a mükemmel bir gezi için her şey" : "Everything you need for a perfect trip to Azerbaijan"}
      </p>
    </div>
  </FadeIn>

  <div className="features-grid">

    {/* 1 */}
    <div className="feature-card">
      <div className="feature-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3C14 3 7 8.5 7 15a7 7 0 0014 0c0-6.5-7-12-7-12z" stroke="#00d4aa" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="14" cy="15" r="2.5" fill="rgba(0,212,170,0.2)" stroke="#00d4aa" strokeWidth="1.4"/></svg>
      </div>
      <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1rem", color: T.text, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.3 }}>
        {lang === "ru" ? "Персональный маршрут за 2 минуты" : lang === "az" ? "2 dəqiqədə fərdi marşrut" : lang === "tr" ? "2 dakikada kişisel rota" : "Personal itinerary in 2 minutes"}
      </h3>
      <p style={{ color: T.textMuted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
        {lang === "ru" ? "ИИ учитывает ваши предпочтения, количество дней и стиль путешествия." : lang === "az" ? "AI sizin seçimlərinizi və səyahət üslubunu nəzərə alır." : lang === "tr" ? "AI tercihlerinizi ve seyahat tarzınızı dikkate alır." : "AI considers your preferences, trip duration and travel style."}
      </p>
    </div>

    {/* 2 */}
    <div className="feature-card">
      <div className="feature-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="6" width="20" height="16" rx="3" stroke="#00d4aa" strokeWidth="1.6"/><path d="M4 11h20" stroke="#00d4aa" strokeWidth="1.4"/><circle cx="10" cy="17" r="2" fill="rgba(0,212,170,0.2)" stroke="#00d4aa" strokeWidth="1.4"/><path d="M14 16.5h6M14 18.5h4" stroke="#00d4aa" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </div>
      <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1rem", color: T.text, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.3 }}>
        {lang === "ru" ? "Только реальные локации" : lang === "az" ? "Yalnız real lokasiyalar" : lang === "tr" ? "Sadece gerçek lokasyonlar" : "Only real locations"}
      </h3>
      <p style={{ color: T.textMuted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
        {lang === "ru" ? "Проверенные места Азербайджана с актуальной информацией." : lang === "az" ? "Azərbaycanın yoxlanılmış yerləri." : lang === "tr" ? "Azerbaycan'ın doğrulanmış yerleri." : "Verified places in Azerbaijan with up-to-date information."}
      </p>
    </div>

    {/* 3 */}
    <div className="feature-card">
      <div className="feature-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14h18M17 8l6 6-6 6" stroke="#00d4aa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 6v16" stroke="#00d4aa" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 3"/></svg>
      </div>
      <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1rem", color: T.text, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.3 }}>
        {lang === "ru" ? "Прямые ссылки на бронирование" : lang === "az" ? "Birbaşa rezervasiya linkləri" : lang === "tr" ? "Doğrudan rezervasyon bağlantıları" : "Direct booking links"}
      </h3>
      <p style={{ color: T.textMuted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
        {lang === "ru" ? "Отели, экскурсии и активности от партнёров." : lang === "az" ? "Tərəfdaşlardan otellər, ekskursiyalar." : lang === "tr" ? "Partnerlerden oteller, turlar ve aktiviteler." : "Hotels, tours and activities from our partners."}
      </p>
    </div>

    {/* 4 */}
    <div className="feature-card">
      <div className="feature-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke="#00d4aa" strokeWidth="1.6"/><path d="M14 9v5l3.5 2" stroke="#00d4aa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1rem", color: T.text, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.3 }}>
        {lang === "ru" ? "Умный учёт пожеланий" : lang === "az" ? "Ağıllı istək uçotu" : lang === "tr" ? "Akıllı tercih eşleştirme" : "Smart preference matching"}
      </h3>
      <p style={{ color: T.textMuted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
        {lang === "ru" ? "Природа, история, еда, отдых с детьми или активный отдых." : lang === "az" ? "Təbiət, tarix, qida, uşaqlarla istirahət." : lang === "tr" ? "Doğa, tarih, yemek, aile veya aktif seyahat." : "Nature, history, food, family or active travel."}
      </p>
    </div>

    {/* 5 */}
    <div className="feature-card">
      <div className="feature-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M9 3h10l6 6v16H3V3h6z" stroke="#00d4aa" strokeWidth="1.6" strokeLinejoin="round"/><path d="M19 3v6h6" stroke="#00d4aa" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 14h14M7 18h10M7 22h6" stroke="#00d4aa" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </div>
      <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1rem", color: T.text, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.3 }}>
        {lang === "ru" ? "Красивый PDF-экспорт" : lang === "az" ? "Gözəl PDF ixracı" : lang === "tr" ? "Güzel PDF dışa aktarma" : "Beautiful PDF export"}
      </h3>
      <p style={{ color: T.textMuted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
        {lang === "ru" ? "Полный маршрут с картой, рекомендациями и контактами." : lang === "az" ? "Xəritə və məsləhətlərlə tam marşrut." : lang === "tr" ? "Harita ve ipuçlarıyla tam rota." : "Full itinerary with map, tips and contacts."}
      </p>
    </div>

    {/* 6 */}
    <div className="feature-card">
      <div className="feature-icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3l2.2 4.5 5 .7-3.6 3.5.85 4.9L14 14.2l-4.45 2.4.85-4.9L6.8 8.2l5-.7L14 3z" stroke="#00d4aa" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 22h10M11 25h6" stroke="#00d4aa" strokeWidth="1.4" strokeLinecap="round"/></svg>
      </div>
      <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1rem", color: T.text, fontWeight: 800, margin: "0 0 8px", lineHeight: 1.3 }}>
        {lang === "ru" ? "Без регистрации" : lang === "az" ? "Qeydiyyat tələb olunmur" : lang === "tr" ? "Kayıt gerekmez" : "No registration needed"}
      </h3>
      <p style={{ color: T.textMuted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
        {lang === "ru" ? "Полностью бесплатно и без лишних шагов." : lang === "az" ? "Tamamilə pulsuz və əlavə addımlar yoxdur." : lang === "tr" ? "Tamamen ücretsiz ve ekstra adım yok." : "Completely free and no extra steps."}
      </p>
    </div>

  </div>
</section>

      {/* Blog */}
      <section className="blog-section" style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "0 48px 120px" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, borderBottom: `1px solid ${T.border}`, paddingBottom: 16 }}>
            <div>
              <p style={{ color: T.textMuted, fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 6 }}>✦ {t.editorialLabel}</p>
              <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.2rem, 2vw, 1.8rem)", color: T.textSoft, fontWeight: 700, margin: 0 }}>{t.blogTitle}</h2>
            </div>
            <Link href={`/${locale}/blog`} style={{ color: T.textMuted, fontSize: 11, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}`, paddingBottom: 2 }}>{t.allArticles}</Link>
          </div>
        </FadeIn>
        <BlogCards>
          <div className="blog-grid-new" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
            <Link href={`/${locale}/blog/${blogPosts[0].slug[lang]}`} className="blog-card-new" style={{ gridRow: "span 2" }}>
              <div style={{ overflow: "hidden", height: 260 }}>
                <img src={blogPosts[0].image} alt={blogPosts[0].title[lang]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "16px 20px 24px" }}>
                <span style={{ color: T.accent, fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase" }}>{blogPosts[0].tag[lang]}</span>
                <h3 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1rem, 1.8vw, 1.4rem)", color: T.text, fontWeight: 700, margin: "8px 0 10px", lineHeight: 1.2 }}>{blogPosts[0].title[lang]}</h3>
                <p style={{ color: T.textSoft, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{blogPosts[0].desc[lang]}</p>
              </div>
            </Link>
            {blogPosts.slice(1).map(post => (
              <Link key={post.slug[lang]} href={`/${locale}/blog/${post.slug[lang]}`} className="blog-card-new">
                <div style={{ overflow: "hidden", height: 140 }}>
                  <img src={post.image} alt={post.title[lang]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "12px 16px 16px" }}>
                  <span style={{ color: T.accent, fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase" }}>{post.tag[lang]}</span>
                  <h3 style={{ fontFamily: T.fontDisplay, fontSize: "0.9rem", color: T.textSoft, fontWeight: 600, margin: "6px 0 0", lineHeight: 1.3 }}>{post.title[lang]}</h3>
                </div>
              </Link>
            ))}
          </div>
        </BlogCards>
      </section>

      {/* Mobile fixed CTA */}
      <div className="mobile-cta-fixed" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99, padding: "12px 20px", background: "rgba(6,9,15,0.95)", borderTop: `1px solid ${T.border}`, backdropFilter: "blur(12px)", justifyContent: "center" }}>
        <Link href={`/${locale}/planner`} className="hero-cta" style={{ width: "100%", padding: "16px", fontSize: 15 }}>
          {t.cta} →
        </Link>
      </div>

      <Footer locale={locale} />
    </main>
  );
}