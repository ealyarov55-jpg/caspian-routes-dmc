import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import Link from "next/link";

const content = {
  ru: {
    badge: "AI-планировщик путешествий",
    headline: "Спланируй путешествие\nв Азербайджан с ИИ",
    sub: "Персональный маршрут под твой бюджет и интересы — за 2 минуты. Бесплатно.",
    cta: "Создать маршрут",
    cta2: "Читать путеводитель",
    featuredTitle: "Популярные маршруты",
    routes: [
      { title: "Баку за 1 день", slug: "marshrut-baku-1-den", days: "1 день", tag: "Популярное" },
      { title: "Баку за 3 дня", slug: "marshrut-baku-3-dnya", days: "3 дня", tag: "Топ" },
      { title: "Шеки за 1 день", slug: "sheki-za-1-den", days: "1 день", tag: "Природа" },
      { title: "Гобустан из Баку", slug: "gobustan-kak-dobratsa", days: "День", tag: "Экскурсия" },
    ],
    whyTitle: "Почему Caspian Routes",
    why: [
      { icon: "🤖", title: "AI-маршрут за 2 минуты", desc: "Отвечаешь на 5 вопросов — получаешь готовый план по дням" },
      { icon: "💰", title: "Лучшие цены на отели", desc: "Партнёрские ссылки на Booking, Ostrovok и локальные варианты" },
      { icon: "🗺️", title: "Экскурсии с гидами", desc: "Проверенные туры через GetYourGuide с отзывами туристов" },
      { icon: "✈️", title: "Дешёвые билеты", desc: "Поиск авиабилетов через Aviasales — без наценок" },
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
    featuredTitle: "Popular Routes",
    routes: [
      { title: "Baku in 1 Day", slug: "marshrut-baku-1-den", days: "1 day", tag: "Popular" },
      { title: "Baku in 3 Days", slug: "marshrut-baku-3-dnya", days: "3 days", tag: "Top" },
      { title: "Sheki Day Trip", slug: "sheki-za-1-den", days: "1 day", tag: "Nature" },
      { title: "Gobustan from Baku", slug: "gobustan-kak-dobratsa", days: "Day trip", tag: "Tour" },
    ],
    whyTitle: "Why Caspian Routes",
    why: [
      { icon: "🤖", title: "AI itinerary in 2 min", desc: "Answer 5 questions — get a full day-by-day plan" },
      { icon: "💰", title: "Best hotel prices", desc: "Partner links to Booking, Ostrovok and local options" },
      { icon: "🗺️", title: "Guided tours", desc: "Verified tours via GetYourGuide with traveler reviews" },
      { icon: "✈️", title: "Cheap flights", desc: "Flight search via Aviasales — no markups" },
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
    featuredTitle: "Populyar Marşrutlar",
    routes: [
      { title: "Bakı 1 gündə", slug: "marshrut-baku-1-den", days: "1 gün", tag: "Populyar" },
      { title: "Bakı 3 gündə", slug: "marshrut-baku-3-dnya", days: "3 gün", tag: "Top" },
      { title: "Şəki 1 gündə", slug: "sheki-za-1-den", days: "1 gün", tag: "Təbiət" },
      { title: "Qobustan", slug: "gobustan-kak-dobratsa", days: "1 gün", tag: "Ekskursiya" },
    ],
    whyTitle: "Niyə Caspian Routes",
    why: [
      { icon: "🤖", title: "2 dəqiqədə AI marşrut", desc: "5 suala cavab ver — günlük plan al" },
      { icon: "💰", title: "Ən yaxşı otel qiymətləri", desc: "Booking, Ostrovok üzrə tərəfdaş linklər" },
      { icon: "🗺️", title: "Bələdçi turları", desc: "GetYourGuide vasitəsilə yoxlanmış turlar" },
      { icon: "✈️", title: "Ucuz aviabiletlər", desc: "Aviasales ilə uçuş axtarışı" },
    ],
    blogTitle: "Azərbaycan Bələdçisi",
    readMore: "Oxu",
    allArticles: "Bütün məqalələr →",
  },
};

const blogPosts = [
  { slug: "marshrut-baku-3-dnya", title: { ru: "Маршрут по Баку на 3 дня", en: "Baku 3-Day Itinerary", az: "Bakı 3 günlük marşrut" }, image: "/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg" },
  { slug: "gobustan-kak-dobratsa", title: { ru: "Гобустан из Баку", en: "Gobustan from Baku", az: "Bakıdan Qobustan" }, image: "/images/pozziss-azerbaijan-4856054_1920-opt.jpg" },
  { slug: "baku-letom", title: { ru: "Баку летом", en: "Baku in Summer", az: "Yay Bakısı" }, image: "/images/pexels-zulfugarkarimov-33085326-opt.jpg" },
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = (locale === "ru" || locale === "az") ? locale : "en";
  const t = content[lang];

  return (
    <main style={{ background: "#021a1a", minHeight: "100vh" }}>
      <Navbar locale={locale} />

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/maxxja-baku-1997163_1920-opt.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.4 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(2,26,26,0.95) 0%, rgba(4,46,46,0.75) 50%, rgba(2,26,26,0.3) 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "96px 24px 64px", width: "100%" }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.4)", borderRadius: 999, padding: "6px 16px", marginBottom: 24 }}>
              <span style={{ color: "#2DD4BF", fontSize: 13, fontWeight: 500 }}>{t.badge}</span>
            </div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "white", fontWeight: 300, lineHeight: 1.1, marginBottom: 24, whiteSpace: "pre-line" }}>
              {t.headline}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
              {t.sub}
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href={`/${locale}/planner`} style={{ background: "#0a7070", color: "white", padding: "14px 32px", borderRadius: 8, fontWeight: 500, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                {t.cta} →
              </Link>
              <Link href={`/${locale}/blog`} style={{ background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.5)", padding: "14px 32px", borderRadius: 8, fontWeight: 500, fontSize: 15, textDecoration: "none" }}>
                {t.cta2}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 48, textAlign: "center" }}>
          {t.whyTitle}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {t.why.map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "28px 24px" }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ color: "white", fontSize: 17, fontWeight: 500, marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", color: "white", fontWeight: 300 }}>
            {t.blogTitle}
          </h2>
          <Link href={`/${locale}/blog`} style={{ color: "#2DD4BF", fontSize: 14, textDecoration: "none" }}>
            {t.allArticles}
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <article style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" }}>
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
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}