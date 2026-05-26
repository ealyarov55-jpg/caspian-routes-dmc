import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import { FadeIn, BlogCards } from "@/components/sections/HomeAnimations";

const content = {
  ru: {
    badge: "AI Travel Planner",
    headline: "Спланируй\nАзербайджан",
    accent: "за 2 минуты",
    sub: "Реальные локации. Партнёрские ссылки на отели и экскурсии. Без регистрации.",
    cta: "Создать маршрут",
    cta2: "Путеводитель",
    stat1val: "60+", stat1label: "Статей о маршрутах",
    stat2val: "4", stat2label: "Языка",
    stat3val: "2 мин", stat3label: "На маршрут",
    howTitle: "Как это работает",
    steps: [
      { num: "01", label: "Инициация", title: "Выбор ритма", desc: "Интересы, темп и группа — за 60 секунд." },
      { num: "02", label: "Анализ", title: "AI-просчёт", desc: "Только реальные живые локации Азербайджана." },
      { num: "03", label: "Результат", title: "Готовый маршрут", desc: "Инсайды и прямые ссылки на бронирование." },
    ],
    blogTitle: "Путеводитель",
    editorialLabel: "Редакция советует",
    allArticles: "Все статьи →",
  },
  en: {
    badge: "AI Travel Planner",
    headline: "Plan\nAzerbaijan",
    accent: "in 2 minutes",
    sub: "Real locations. Partner links for hotels and tours. No signup required.",
    cta: "Create Itinerary",
    cta2: "Travel Guide",
    stat1val: "60+", stat1label: "Travel articles",
    stat2val: "4", stat2label: "Languages",
    stat3val: "2 min", stat3label: "To itinerary",
    howTitle: "How it works",
    steps: [
      { num: "01", label: "Init", title: "Set the rhythm", desc: "Interests, pace and group — in 60 seconds." },
      { num: "02", label: "Analysis", title: "AI processing", desc: "Only real, living locations in Azerbaijan." },
      { num: "03", label: "Result", title: "Ready itinerary", desc: "Insider tips and direct booking links." },
    ],
    blogTitle: "Travel Guide",
    editorialLabel: "Editor's picks",
    allArticles: "All articles →",
  },
  az: {
    badge: "AI Səyahət Planlayıcısı",
    headline: "Azərbaycanı\nPlanlaşdır",
    accent: "2 dəqiqədə",
    sub: "Real lokasiyalar. Otel və tur üçün tərəfdaş linklər. Qeydiyyatsız.",
    cta: "Marşrut Yarat",
    cta2: "Bələdçi",
    stat1val: "60+", stat1label: "Məqalə",
    stat2val: "4", stat2label: "Dil",
    stat3val: "2 dəq", stat3label: "Marşruta",
    howTitle: "Necə işləyir",
    steps: [
      { num: "01", label: "Başlanğıc", title: "Ritm seçimi", desc: "Maraqlar, temp və qrup — 60 saniyədə." },
      { num: "02", label: "Analiz", title: "AI hesablaması", desc: "Yalnız real Azərbaycan lokasiyaları." },
      { num: "03", label: "Nəticə", title: "Hazır marşrut", desc: "İnsaydlar və rezervasiya linkləri." },
    ],
    blogTitle: "Bələdçi",
    editorialLabel: "Redaksiya tövsiyə edir",
    allArticles: "Bütün məqalələr →",
  },
  tr: {
    badge: "AI Seyahat Planlayıcısı",
    headline: "Azerbaycan'ı\nPlanla",
    accent: "2 dakikada",
    sub: "Gerçek lokasyonlar. Otel ve tur için ortak linkler. Kayıt gerekmez.",
    cta: "Rota Oluştur",
    cta2: "Seyahat Rehberi",
    stat1val: "60+", stat1label: "Seyahat makalesi",
    stat2val: "4", stat2label: "Dil",
    stat3val: "2 dk", stat3label: "Rotanıza",
    howTitle: "Nasıl çalışır",
    steps: [
      { num: "01", label: "Başlangıç", title: "Ritim seçimi", desc: "İlgiler, tempo ve grup — 60 saniyede." },
      { num: "02", label: "Analiz", title: "AI işlemi", desc: "Sadece gerçek Azerbaycan lokasyonları." },
      { num: "03", label: "Sonuç", title: "Hazır rota", desc: "İpuçları ve doğrudan rezervasyon linkleri." },
    ],
    blogTitle: "Seyahat Rehberi",
    editorialLabel: "Editörün seçimi",
    allArticles: "Tüm makaleler →",
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
  accentGlow: "rgba(0, 212, 170, 0.08)",
  border: "rgba(255,255,255,0.06)",
  text: "#e8edf5",
  textSoft: "#94a3b8",
  textMuted: "#475569",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
  font: "'DM Sans', system-ui, sans-serif",
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = (locale === "ru" || locale === "az" || locale === "tr") ? locale : "en";
  const t = content[lang];

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
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .home-cta-primary {
          display: inline-block; padding: 13px 32px;
          background: #00d4aa; color: #06090f;
          border: none; border-radius: 8px;
          font-size: 13px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none; cursor: pointer;
          letter-spacing: 0.05em; transition: all 0.2s ease;
        }
        .home-cta-primary:hover { background: #00b894; transform: translateY(-2px); }
        .home-cta-secondary {
          display: inline-block; padding: 13px 32px;
          background: transparent; color: ${T.textSoft};
          border: 1px solid ${T.border}; border-radius: 8px;
          font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none; cursor: pointer;
          transition: all 0.2s ease;
        }
        .home-cta-secondary:hover { border-color: rgba(255,255,255,0.2); color: ${T.text}; }
        .blog-card-new {
          display: block; text-decoration: none;
          border-radius: 12px; overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid ${T.border};
          transition: border-color 0.25s ease;
        }
        .blog-card-new:hover { border-color: rgba(0,212,170,0.3); }
        .blog-card-new img { transition: transform 0.6s ease; display: block; width: 100%; }
        .blog-card-new:hover img { transform: scale(1.04); }
        @media (max-width: 767px) {
          .hero-cols { grid-template-columns: 1fr !important; gap: 24px !important; }
          .stat-row { grid-template-columns: 1fr 1fr !important; }
          .blog-grid-new { grid-template-columns: 1fr !important; }
          .how-grid-new { grid-template-columns: 1fr !important; }
          .how-step-new { border-left: none !important; border-top: 1px solid ${T.border} !important; padding-left: 0 !important; padding-top: 32px !important; }
        }
      `}</style>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-5%", left: "70%", width: 400, height: 400, borderRadius: "50%", background: "rgba(0,212,170,0.04)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "-10%", width: 350, height: 350, borderRadius: "50%", background: "rgba(0,100,200,0.03)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px", animation: "gridPulse 8s ease infinite" }} />
      </div>

      {/* Navbar */}
      <Navbar locale={locale} />

      {/* Hero */}
      <section style={{ position: "relative", zIndex: 5, minHeight: "100vh", display: "flex", alignItems: "center", padding: "0 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", paddingTop: 80 }}>
          <FadeIn delay={0}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 11, color: T.accent, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600 }}>{t.badge}</span>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(2.5rem, 5vw, 5rem)", fontWeight: 700, lineHeight: 0.95, margin: "0 0 16px", letterSpacing: -2, whiteSpace: "pre-line" }}>
              {t.headline}<br />
              <span style={{ color: "white", borderBottom: `3px solid ${T.accent}`, paddingBottom: 2 }}>{t.accent}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="hero-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "flex-end", marginTop: 40 }}>
              <p style={{ color: T.textSoft, fontSize: 16, lineHeight: 1.7, maxWidth: 420, margin: 0 }}>{t.sub}</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <Link href={`/${locale}/planner`} className="home-cta-primary">{t.cta} →</Link>
                <Link href={`/${locale}/blog`} className="home-cta-secondary">{t.cta2}</Link>
              </div>
            </div>
          </FadeIn>

          <div style={{ height: 1, background: T.border, marginTop: 48 }} />

          <FadeIn delay={300}>
            <div className="stat-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
              {[
                { val: t.stat1val, label: t.stat1label },
                { val: t.stat2val, label: t.stat2label },
                { val: t.stat3val, label: t.stat3label },
              ].map((s, i) => (
                <div key={i} style={{ padding: "24px 0", borderRight: i < 2 ? `1px solid ${T.border}` : "none", paddingLeft: i > 0 ? 40 : 0 }}>
                  <p style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: T.accent, fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.val}</p>
                  <p style={{ color: T.textMuted, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", margin: "8px 0 0" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "80px 48px" }}>
        <FadeIn>
          <p style={{ color: T.textMuted, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 48 }}>✦ {t.howTitle}</p>
        </FadeIn>
        <div className="how-grid-new" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {t.steps.map((step, i) => (
            <div key={i} className="how-step-new" style={{ position: "relative", padding: "0 40px 0 0", borderLeft: i > 0 ? `1px solid ${T.border}` : "none", paddingLeft: i > 0 ? 40 : 0 }}>
              <p style={{ position: "absolute", top: -20, right: i === 2 ? 0 : 40, fontFamily: T.fontDisplay, fontSize: "clamp(5rem, 8vw, 8rem)", color: "rgba(255,255,255,0.03)", fontWeight: 800, lineHeight: 1, margin: 0, userSelect: "none", pointerEvents: "none" }}>{step.num}</p>
              <p style={{ color: T.accent, fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>{step.label}</p>
              <h3 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.4rem, 2vw, 1.8rem)", color: T.text, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>{step.title}</h3>
              <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0, maxWidth: 260 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section style={{ position: "relative", zIndex: 5, maxWidth: 1280, margin: "0 auto", padding: "0 48px 120px" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, borderBottom: `1px solid ${T.border}`, paddingBottom: 24 }}>
            <div>
              <p style={{ color: T.textMuted, fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 8 }}>✦ {t.editorialLabel}</p>
              <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.8rem, 4vw, 3rem)", color: T.text, fontWeight: 800, margin: 0 }}>{t.blogTitle}</h2>
            </div>
            <Link href={`/${locale}/blog`} style={{ color: T.textMuted, fontSize: 11, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}`, paddingBottom: 2 }}>{t.allArticles}</Link>
          </div>
        </FadeIn>

        <BlogCards>
          <div className="blog-grid-new" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
            <Link href={`/${locale}/blog/${blogPosts[0].slug[lang]}`} className="blog-card-new" style={{ gridRow: "span 2" }}>
              <div style={{ overflow: "hidden", height: 320 }}>
                <img src={blogPosts[0].image} alt={blogPosts[0].title[lang]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "20px 24px 28px" }}>
                <span style={{ color: T.accent, fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase" }}>{blogPosts[0].tag[lang]}</span>
                <h3 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(1.3rem, 2vw, 1.8rem)", color: T.text, fontWeight: 700, margin: "10px 0 12px", lineHeight: 1.2 }}>{blogPosts[0].title[lang]}</h3>
                <p style={{ color: T.textSoft, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{blogPosts[0].desc[lang]}</p>
              </div>
            </Link>
            {blogPosts.slice(1).map(post => (
              <Link key={post.slug[lang]} href={`/${locale}/blog/${post.slug[lang]}`} className="blog-card-new">
                <div style={{ overflow: "hidden", height: 180 }}>
                  <img src={post.image} alt={post.title[lang]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "16px 20px 20px" }}>
                  <span style={{ color: T.accent, fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase" }}>{post.tag[lang]}</span>
                  <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1rem", color: T.text, fontWeight: 700, margin: "8px 0 0", lineHeight: 1.3 }}>{post.title[lang]}</h3>
                </div>
              </Link>
            ))}
          </div>
        </BlogCards>
      </section>

      <Footer locale={locale} />
    </main>
  );
}