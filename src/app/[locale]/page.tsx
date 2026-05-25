import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import Link from "next/link";
import { FadeIn, BlogCards } from "@/components/sections/HomeAnimations";

const content = {
  ru: {
    eyebrow: "Азербайджан · Кавказ · Каспий",
    headline: "Спланируй\nпутешествие\nс ИИ",
    sub: "Персональный маршрут под твой бюджет и интересы — за 2 минуты.",
    cta: "Создать маршрут",
    cta2: "Путеводитель",
    free: "Бесплатно · Без регистрации",
    stat1val: "60+", stat1label: "Статей о маршрутах",
    stat2val: "4", stat2label: "Языка",
    stat3val: "2 мин", stat3label: "На персональный маршрут",
    editorialLabel: "Редакция советует",
    blogTitle: "Путеводитель",
    allArticles: "Все статьи →",
    readMore: "Читать",
  },
  en: {
    eyebrow: "Azerbaijan · Caucasus · Caspian",
    headline: "Plan Your\nTrip to\nAzerbaijan",
    sub: "A personalized itinerary for your budget and interests — in 2 minutes.",
    cta: "Create Itinerary",
    cta2: "Travel Guide",
    free: "Free · No signup",
    stat1val: "60+", stat1label: "Travel articles",
    stat2val: "4", stat2label: "Languages",
    stat3val: "2 min", stat3label: "To your itinerary",
    editorialLabel: "Editor's picks",
    blogTitle: "Travel Guide",
    allArticles: "All articles →",
    readMore: "Read",
  },
  az: {
    eyebrow: "Azərbaycan · Qafqaz · Xəzər",
    headline: "Səyahətini\nAI ilə\nPlanlaşdır",
    sub: "Büdcənə və maraqlarına uyğun fərdi marşrut — 2 dəqiqədə.",
    cta: "Marşrut Yarat",
    cta2: "Bələdçi",
    free: "Pulsuz · Qeydiyyatsız",
    stat1val: "60+", stat1label: "Məqalə",
    stat2val: "4", stat2label: "Dil",
    stat3val: "2 dəq", stat3label: "Marşruta",
    editorialLabel: "Redaksiya tövsiyə edir",
    blogTitle: "Bələdçi",
    allArticles: "Bütün məqalələr →",
    readMore: "Oxu",
  },
  tr: {
    eyebrow: "Azerbaycan · Kafkasya · Hazar",
    headline: "Seyahatini\nYapay Zeka\nile Planla",
    sub: "Bütçene ve ilgi alanlarına göre kişisel rota — 2 dakikada.",
    cta: "Rota Oluştur",
    cta2: "Seyahat Rehberi",
    free: "Ücretsiz · Kayıt yok",
    stat1val: "60+", stat1label: "Seyahat makalesi",
    stat2val: "4", stat2label: "Dil",
    stat3val: "2 dk", stat3label: "Rotanıza",
    editorialLabel: "Editörün seçimi",
    blogTitle: "Seyahat Rehberi",
    allArticles: "Tüm makaleler →",
    readMore: "Oku",
  },
};

const blogPosts = [
  {
    slug: { ru: "marshrut-baku-3-dnya", en: "baku-3-days", az: "marshrut-baku-3-dnya", tr: "baku-3-days" },
    title: { ru: "Маршрут по Баку на 3 дня", en: "Baku 3-Day Itinerary", az: "Bakı 3 günlük marşrut", tr: "Bakü 3 Günlük Rota" },
    desc: { ru: "Старый город, Пламенные башни, набережная и лучшие рестораны.", en: "Old City, Flame Towers, boulevard and the best restaurants.", az: "Qala, Alov qüllələri, bulvar və ən yaxşı restoranlar.", tr: "Eski Şehir, Alev Kuleleri, bulvar ve en iyi restoranlar." },
    image: "/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg",
    tag: { ru: "Маршрут", en: "Itinerary", az: "Marşrut", tr: "Rota" },
  },
  {
    slug: { ru: "gobustan-kak-dobratsa", en: "gobustan-from-baku", az: "gobustan-kak-dobratsa", tr: "gobustan-from-baku" },
    title: { ru: "Гобустан из Баку", en: "Gobustan from Baku", az: "Bakıdan Qobustan", tr: "Bakü'den Gobustan" },
    desc: { ru: "Грязевые вулканы, наскальные рисунки и лунный пейзаж — однодневная поездка.", en: "Mud volcanoes, petroglyphs and lunar landscape — a day trip.", az: "Palçıq vulkanları, qaya rəsmləri — günlük gəzinti.", tr: "Çamur volkanları, kaya resimleri — günübirlik gezi." },
    image: "/images/pozziss-azerbaijan-4856054_1920-opt.jpg",
    tag: { ru: "Природа", en: "Nature", az: "Təbiət", tr: "Doğa" },
  },
  {
    slug: { ru: "baku-letom", en: "baku-summer", az: "baku-letom", tr: "baku-summer" },
    title: { ru: "Баку летом", en: "Baku in Summer", az: "Yay Bakısı", tr: "Yazın Bakü" },
    desc: { ru: "Жара, Каспий, ночная жизнь и фестивали — что делать в Баку летом.", en: "Heat, Caspian, nightlife and festivals — what to do in Baku in summer.", az: "İsti, Xəzər, gecə həyatı — yay Bakısında nə etməli.", tr: "Sıcak, Hazar, gece hayatı — Bakü'de yazın ne yapmalı." },
    image: "/images/pexels-zulfugarkarimov-33085326-opt.jpg",
    tag: { ru: "Сезон", en: "Season", az: "Mövsüm", tr: "Sezon" },
  },
];

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
    <main style={{ background: "#041315", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <Navbar locale={locale} />

      <style>{`
        .hero-cta-primary {
          display: inline-block;
          padding: 14px 40px;
          background: transparent;
          color: white;
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 2px;
          font-size: 11px;
          font-weight: 500;
          font-family: DM Sans, sans-serif;
          cursor: pointer;
          text-decoration: none;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }
        .hero-cta-primary:hover { background: rgba(255,255,255,0.08); border-color: white; }
        .hero-cta-secondary {
          display: inline-block;
          padding: 14px 40px;
          background: transparent;
          color: rgba(255,255,255,0.4);
          border: 0.5px solid rgba(255,255,255,0.15);
          border-radius: 2px;
          font-size: 11px;
          font-weight: 400;
          font-family: DM Sans, sans-serif;
          cursor: pointer;
          text-decoration: none;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.2s ease;
        }
        .hero-cta-secondary:hover { border-color: rgba(255,255,255,0.35); color: rgba(255,255,255,0.7); }
        .blog-card-editorial {
          display: block;
          text-decoration: none;
          border-radius: 2px;
          overflow: hidden;
          background: #0a1f1f;
          border: 0.5px solid rgba(255,255,255,0.08);
          transition: border-color 0.25s ease;
        }
        .blog-card-editorial:hover { border-color: rgba(45,212,191,0.3); }
        .blog-card-editorial img { transition: transform 0.6s ease; display: block; width: 100%; }
        .blog-card-editorial:hover img { transform: scale(1.04); }
        @media (max-width: 767px) {
          .hero-headline { font-size: clamp(2.5rem, 10vw, 4rem) !important; }
          .hero-cols { grid-template-columns: 1fr !important; gap: 24px !important; }
          .stat-row { grid-template-columns: 1fr 1fr !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end", overflow: "hidden", paddingBottom: 0 }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/baku-hero.jpg')", backgroundSize: "cover", backgroundPosition: "center 30%", opacity: 0.35 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(4,19,21,0.3) 0%, rgba(4,19,21,0.6) 50%, rgba(4,19,21,0.98) 100%)" }} />

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 48px 80px" }}>
          <FadeIn delay={0}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "DM Sans, sans-serif", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 32, marginTop: "30vh" }}>
              {t.eyebrow}
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="hero-headline" style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(3rem, 5.5vw, 5.5rem)", color: "white", fontWeight: 300, lineHeight: 1.05, marginBottom: 40, whiteSpace: "pre-line", letterSpacing: "-0.01em" }}>
              {t.headline}
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="hero-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "flex-end" }}>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 20, lineHeight: 1.7, fontFamily: "DM Sans, sans-serif", maxWidth: 440, margin: 0, fontWeight: 300 }}>
                {t.sub}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <Link href={`/${locale}/planner`} className="hero-cta-primary">{t.cta} →</Link>
                <Link href={`/${locale}/blog`} className="hero-cta-secondary">{t.cta2}</Link>
              </div>
            </div>
          </FadeIn>

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginTop: 48 }} />

          {/* Stats row */}
          <FadeIn delay={300}>
            <div className="stat-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, marginTop: 0 }}>
              {[
                { val: t.stat1val, label: t.stat1label },
                { val: t.stat2val, label: t.stat2label },
                { val: t.stat3val, label: t.stat3label },
              ].map((s, i) => (
                <div key={i} style={{ padding: "28px 0", borderRight: i < 2 ? "0.5px solid rgba(255,255,255,0.08)" : "none", paddingLeft: i > 0 ? 40 : 0 }}>
                  <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#2DD4BF", fontWeight: 300, margin: 0, lineHeight: 1 }}>{s.val}</p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "DM Sans, sans-serif", letterSpacing: "0.3em", textTransform: "uppercase", margin: "8px 0 0" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Editorial Blog Section */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 48px 120px" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, borderBottom: "0.5px solid rgba(255,255,255,0.08)", paddingBottom: 32 }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "DM Sans, sans-serif", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 12 }}>✦ {t.editorialLabel}</p>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "white", fontWeight: 300, margin: 0, lineHeight: 1 }}>{t.blogTitle}</h2>
            </div>
            <Link href={`/${locale}/blog`} style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "DM Sans, sans-serif", textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "0.5px solid rgba(255,255,255,0.2)", paddingBottom: 2 }}>{t.allArticles}</Link>
          </div>
        </FadeIn>

        {/* Featured large + 2 small */}
        <BlogCards>
  <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 32 }}>
    <Link href={`/${locale}/blog/${blogPosts[0].slug[lang]}`} className="blog-card-editorial" style={{ gridRow: "span 2" }}>
      <div style={{ overflow: "hidden", height: 320 }}>
        <img src={blogPosts[0].image} alt={blogPosts[0].title[lang]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: "24px 28px 32px" }}>
        <span style={{ color: "#2DD4BF", fontSize: 9, fontFamily: "DM Sans, sans-serif", letterSpacing: "0.4em", textTransform: "uppercase" as const }}>{blogPosts[0].tag[lang]}</span>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", color: "white", fontWeight: 300, margin: "12px 0 16px", lineHeight: 1.2 }}>{blogPosts[0].title[lang]}</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "DM Sans, sans-serif", lineHeight: 1.8, margin: 0 }}>{blogPosts[0].desc[lang]}</p>
      </div>
    </Link>
    {blogPosts.slice(1).map((post) => (
      <Link key={post.slug[lang]} href={`/${locale}/blog/${post.slug[lang]}`} className="blog-card-editorial">
        <div style={{ overflow: "hidden", height: 200 }}>
          <img src={post.image} alt={post.title[lang]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ padding: "18px 20px 24px" }}>
          <span style={{ color: "#2DD4BF", fontSize: 9, fontFamily: "DM Sans, sans-serif", letterSpacing: "0.4em", textTransform: "uppercase" as const }}>{post.tag[lang]}</span>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", color: "white", fontWeight: 300, margin: "8px 0 0", lineHeight: 1.3 }}>{post.title[lang]}</h3>
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