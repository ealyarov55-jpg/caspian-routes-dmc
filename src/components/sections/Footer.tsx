"use client";

import Link from "next/link";

const content = {
  ru: {
    description: "AI-планировщик путешествий по Азербайджану и Кавказу.",
    guide: "Путеводитель",
    links: [
      { label: "Маршрут по Баку на 1 день", href: "/ru/blog/marshrut-baku-1-den" },
      { label: "Маршрут по Баку на 3 дня", href: "/ru/blog/marshrut-baku-3-dnya" },
      { label: "Гобустан из Баку", href: "/ru/blog/gobustan-kak-dobratsa" },
      { label: "Шеки за 1 день", href: "/ru/blog/sheki-za-1-den" },
    ],
    planner: "Планировщик",
    plannerLinks: [
      { label: "Создать маршрут", href: "/ru/planner" },
      { label: "Все статьи", href: "/ru/blog" },
      { label: "Контакт", href: "/ru/contact" },
    ],
    copyright: "© 2026 Caspian Routes. Все права защищены.",
    privacy: "Политика конфиденциальности",
    terms: "Условия использования",
  },
  en: {
    description: "AI travel planner for Azerbaijan and the Caucasus.",
    guide: "Travel Guide",
    links: [
      { label: "Baku in 1 Day", href: "/en/blog/marshrut-baku-1-den" },
      { label: "Baku in 3 Days", href: "/en/blog/marshrut-baku-3-dnya" },
      { label: "Gobustan from Baku", href: "/en/blog/gobustan-kak-dobratsa" },
      { label: "Sheki Day Trip", href: "/en/blog/sheki-za-1-den" },
    ],
    planner: "Planner",
    plannerLinks: [
      { label: "Create Itinerary", href: "/en/planner" },
      { label: "All Articles", href: "/en/blog" },
      { label: "Contact", href: "/en/contact" },
    ],
    copyright: "© 2026 Caspian Routes. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },
  az: {
    description: "Azərbaycan və Qafqaz üçün AI səyahət planlayıcısı.",
    guide: "Bələdçi",
    links: [
      { label: "Bakı 1 gündə", href: "/az/blog/marshrut-baku-1-den" },
      { label: "Bakı 3 gündə", href: "/az/blog/marshrut-baku-3-dnya" },
      { label: "Qobustan", href: "/az/blog/gobustan-kak-dobratsa" },
      { label: "Şəki 1 gündə", href: "/az/blog/sheki-za-1-den" },
    ],
    planner: "Planlayıcı",
    plannerLinks: [
      { label: "Marşrut Yarat", href: "/az/planner" },
      { label: "Bütün məqalələr", href: "/az/blog" },
      { label: "Əlaqə", href: "/az/contact" },
    ],
    copyright: "© 2026 Caspian Routes. Bütün hüquqlar qorunur.",
    privacy: "Məxfilik Siyasəti",
    terms: "İstifadə Şərtləri",
  },
};

export default function Footer({ locale = "en" }: { locale?: string }) {
  const lang = (locale === "ru" || locale === "az") ? locale : "en";
  const t = content[lang];

  return (
    <footer style={{ background: "#021a1a", borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 24px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>

          <div>
            <Link href={`/${locale}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
              <img src="/favicon.png" alt="Caspian Routes" style={{ width: 40, height: 40, objectFit: "contain" }} />
              <div>
                <p style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}>Caspian Routes</p>
                <p style={{ color: "#2dd4bf", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em" }}>AI Travel Planner</p>
              </div>
            </Link>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7, maxWidth: 240 }}>
              {t.description}
            </p>
          </div>

          <div>
            <h4 style={{ color: "white", fontSize: 13, fontWeight: 500, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.guide}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {t.links.map(link => (
                <Link key={link.href} href={link.href} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: "white", fontSize: 13, fontWeight: 500, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.planner}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {t.plannerLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{t.copyright}</p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href={`/${locale}/privacy`} style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none" }}>{t.privacy}</Link>
            <Link href={`/${locale}/terms`} style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none" }}>{t.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}