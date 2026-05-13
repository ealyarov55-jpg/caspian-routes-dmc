import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import Link from "next/link";
import { FadeIn, StatsSection, WhyCards, BlogCards } from "@/components/sections/HomeAnimations";

const content = {
  ru: {
    badge: "AI-планировщик путешествий",
    headline: "Спланируй путешествие\nв Азербайджан с ИИ",
    sub: "Персональный маршрут под твой бюджет и интересы — за 2 минуты. Бесплатно.",
    cta: "Создать маршрут",
    cta2: "Читать путеводитель",
    cardTitle: "Куда хочешь\nотправиться?",
    cardSub: "Начни прямо сейчас",
    free: "Бесплатно · Без регистрации · За 2 минуты",
    whyTitle: "Почему Caspian Routes",
    why: [
      { icon: "🤖", title: "AI-маршрут за 2 минуты", desc: "Отвечаешь на 5 вопросов — получаешь готовый план по дням" },
      { icon: "💰", title: "Лучшие цены на отели", desc: "Партнёрские ссылки на Booking, Ostrovok и локальные варианты" },
      { icon: "🗺️", title: "Экскурсии с гидами", desc: "Проверенные туры через GetYourGuide с отзывами туристов" },
      { icon: "✈️", title: "Дешёвые билеты", desc: "Поиск авиабилетов через Aviasales — без наценок" },
    ],
    stats: [
      { value: 34, suffix: "", label: "статьи о маршрутах" },
      { value: 3, suffix: "", label: "языка" },
      { value: 4, suffix: "", label: "партнёра" },
      { value: 2, suffix: " мин", label: "на маршрут" },
    ],
    blogTitle: "Путеводитель по Азербайджану",
    readMore: "Читать",
    allArticles: "Все статьи →",
  },
  en: {
    badge: "AI Travel Planner",
    headline: "Plan Your Trip to\nAzerbaijan with AI",
    sub: "Get a personalized itinerary in 2 minutes. Free.",
    cta: "Create Itinerary",
    cta2: "Read Travel Guide",
    cardTitle: "Where do you\nwant to go?",
    cardSub: "Start right now",
    free: "Free · No signup · 2 minutes",
    whyTitle: "Why Caspian Routes",
    why: [
      { icon: "🤖", title: "AI itinerary in 2 min", desc: "Answer 5 questions — get a full day-by-day plan" },
      { icon: "💰", title: "Best hotel prices", desc: "Partner links to Booking, Ostrovok and local options" },
      { icon: "🗺️", title: "Guided tours", desc: "Verified tours via GetYourGuide with traveler reviews" },
      { icon: "✈️", title: "Cheap flights", desc: "Flight search via Aviasales — no markups" },
    ],
    stats: [
      { value: 34, suffix: "", label: "travel articles" },
      { value: 3, suffix: "", label: "languages" },
      { value: 4, suffix: "", label: "partners" },
      { value: 2, suffix: " min", label: "to your itinerary" },
    ],
    blogTitle: "Azerbaijan Travel Guide",
    readMore: "Read",
    allArticles: "All articles →",
  },
  az: {
    badge: "AI Səyahət Planlayıcısı",
    headline: "Azərbaycana Səyahətini\nAI ilə Planlaşdır",
    sub: "2 dəqiqədə fərdi marşrut. Pulsuz.",
    cta: "Marşrut Yarat",
    cta2: "Bələdçini Oxu",
    cardTitle: "Hara getmək\nistəyirsən?",
    cardSub: "İndi başla",
    free: "Pulsuz · Qeydiyyatsız · 2 dəqiqədə",
    whyTitle: "Niyə Caspian Routes",
    why: [
      { icon: "🤖", title: "2 dəqiqədə AI marşrut", desc: "5 suala cavab ver — günlük plan al" },
      { icon: "💰", title: "Ən yaxşı otel qiymətləri", desc: "Booking, Ostrovok üzrə tərəfdaş linklər" },
      { icon: "🗺️", title: "Bələdçi turları", desc: "GetYourGuide vasitəsilə yoxlanmış turlar" },
      { icon: "✈️", title: "Ucuz aviabiletlər", desc: "Aviasales ilə uçuş axtarışı" },
    ],
    stats: [
      { value: 34, suffix: "", label: "məqalə" },
      { value: 3, suffix: "", label: "dil" },
      { value: 4, suffix: "", label: "tərəfdaş" },
      { value: 2, suffix: " dəq", label: "marşruta" },
    ],
    blogTitle: "Azərbaycan Bələdçisi",
    readMore: "Oxu",
    allArticles: "Bütün məqalələr →",
  },
};

const blogPosts = [
  {
    slug: { ru: "marshrut-baku-3-dnya", en: "baku-3-days", az: "marshrut-baku-3-dnya" },
    title: { ru: "Маршрут по Баку на 3 дня", en: "Baku 3-Day Itinerary", az: "Bakı 3 günlük marşrut" },
    image: "/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg"
  },
  {
    slug: { ru: "gobustan-kak-dobratsa", en: "gobustan-from-baku", az: "gobustan-kak-dobratsa" },
    title: { ru: "Гобустан из Баку", en: "Gobustan from Baku", az: "Bakıdan Qobustan" },
    image: "/images/pozziss-azerbaijan-4856054_1920-opt.jpg"
  },
  {
    slug: { ru: "baku-letom", en: "baku-summer", az: "baku-letom" },
    title: { ru: "Баку летом", en: "Baku in Summer", az: "Yay Bakısı" },
    image: "/images/pexels-zulfugarkarimov-33085326-opt.jpg"
  },
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = (locale === "ru" || locale === "az") ? locale : "en";
  const t = content[lang];

  return (
    <main style={{ background: "#021a1a", minHeight: "100vh" }}>
      <Navbar locale={locale} />

      <style>{`
        .hero-btn-primary {
          padding: 16px 28px;
          background: linear-gradient(135deg, #0a7070, #0d9090);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          font-family: DM Sans, sans-serif;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(10,112,112,0.5);
          background: linear-gradient(135deg, #0d9090, #10b0b0);
        }
        .hero-btn-secondary {
          padding: 16px 28px;
          background: transparent;
          color: white;
          border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          font-family: DM Sans, sans-serif;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }
        .hero-btn-secondary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.08);
        }
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .hero-card { display: block; }
        .hero-mobile-btns { display: none; }
        .blog-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .blog-card:hover {
          transform: translateY(-4px);
          border-color: rgba(45,212,191,0.3);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
        }
        @media (max-width: 767px) {
          .hero-grid { grid-template-columns: 1fr; gap: 32px; }
          .hero-card { display: none; }
          .hero-mobile-btns { display: flex; flex-direction: column; gap: 12px; margin-top: 32px; }
        }
      `}</style>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/baku-hero.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.5 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(2,26,26,0.97) 0%, rgba(2,26,26,0.85) 40%, rgba(2,26,26,0.3) 100%)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "96px 24px 64px", width: "100%" }}>
          <div className="hero-grid">
            <div>
              <FadeIn delay={0}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.4)", borderRadius: 999, padding: "6px 16px", marginBottom: 24 }}>
                  <span style={{ color: "#2DD4BF", fontSize: 13, fontWeight: 500 }}>{t.badge}</span>
                </div>
              </FadeIn>
              <FadeIn delay={150}>
                <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "white", fontWeight: 300, lineHeight: 1.1, marginBottom: 24, whiteSpace: "pre-line" }}>
                  {t.headline}
                </h1>
              </FadeIn>
              <FadeIn delay={300}>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, lineHeight: 1.7, maxWidth: 480 }}>
                  {t.sub}
                </p>
              </FadeIn>
              <div className="hero-mobile-btns">
                <Link href={`/${locale}/planner`} className="hero-btn-primary">✨ {t.cta}</Link>
                <Link href={`/${locale}/blog`} className="hero-btn-secondary">📖 {t.cta2}</Link>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center", margin: 0 }}>{t.free}</p>
              </div>
            </div>

            <FadeIn delay={400}>
              <div className="hero-card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "40px 36px", backdropFilter: "blur(12px)" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{t.cardSub}</p>
                <p style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "1.6rem", fontWeight: 300, lineHeight: 1.3, marginBottom: 32, whiteSpace: "pre-line" }}>{t.cardTitle}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Link href={`/${locale}/planner`} className="hero-btn-primary">✨ {t.cta}</Link>
                  <Link href={`/${locale}/blog`} className="hero-btn-secondary">📖 {t.cta2}</Link>
                </div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center", marginTop: 20 }}>{t.free}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px 0" }}>
        <StatsSection stats={t.stats} />
      </section>

      {/* Why us */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
        <FadeIn>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 48, textAlign: "center" }}>
            {t.whyTitle}
          </h2>
        </FadeIn>
        <WhyCards items={t.why} />
      </section>

      {/* Blog */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "white", fontWeight: 300 }}>
              {t.blogTitle}
            </h2>
            <Link href={`/${locale}/blog`} style={{ color: "#2DD4BF", fontSize: 14, textDecoration: "none" }}>{t.allArticles}</Link>
          </div>
        </FadeIn>
        <BlogCards>
          {blogPosts.map((post) => (
            <Link key={post.slug[lang]} href={`/${locale}/blog/${post.slug[lang]}`} style={{ textDecoration: "none" }}>
              <article className="blog-card">
                <div style={{ height: 200, overflow: "hidden" }}>
                  <img src={post.image} alt={post.title[lang]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", color: "white", fontWeight: 400, marginBottom: 12 }}>
                    {post.title[lang]}
                  </h3>
                  <span style={{ color: "#2DD4BF", fontSize: 13 }}>{t.readMore} →</span>
                </div>
              </article>
            </Link>
          ))}
        </BlogCards>
      </section>

      <Footer locale={locale} />
    </main>
  );
}