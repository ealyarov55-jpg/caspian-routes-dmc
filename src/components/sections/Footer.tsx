"use client";

import Link from "next/link";

const T = {
  accent: "#00d4aa",
  border: "rgba(255,255,255,0.06)",
  text: "#e8edf5",
  textSoft: "#94a3b8",
  textMuted: "#475569",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
  font: "'DM Sans', system-ui, sans-serif",
};

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
    tagline: "Исследуйте Азербайджан с умом",
  },
  en: {
    description: "AI travel planner for Azerbaijan and the Caucasus.",
    guide: "Travel Guide",
    links: [
      { label: "Baku in 1 Day", href: "/en/blog/marshrut-baku-1-den" },
      { label: "Baku in 3 Days", href: "/en/blog/baku-3-days" },
      { label: "Gobustan from Baku", href: "/en/blog/gobustan-from-baku" },
      { label: "Sheki Day Trip", href: "/en/blog/sheki-day-trip" },
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
    tagline: "Explore Azerbaijan intelligently",
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
    tagline: "Azərbaycanı ağıllı kəşf edin",
  },
  tr: {
    description: "Azerbaycan ve Kafkasya için AI seyahat planlayıcısı.",
    guide: "Seyahat Rehberi",
    links: [
      { label: "Bakü'de 1 Gün", href: "/tr/blog/baku-1-day" },
      { label: "Bakü'de 3 Gün", href: "/tr/blog/baku-3-days" },
      { label: "Bakü'den Gobustan", href: "/tr/blog/gobustan-from-baku" },
      { label: "Şeki Gezi Turu", href: "/tr/blog/sheki-day-trip" },
    ],
    planner: "Planlayıcı",
    plannerLinks: [
      { label: "Rota Oluştur", href: "/tr/planner" },
      { label: "Tüm Makaleler", href: "/tr/blog" },
      { label: "İletişim", href: "/tr/contact" },
    ],
    copyright: "© 2026 Caspian Routes. Tüm hakları saklıdır.",
    privacy: "Gizlilik Politikası",
    terms: "Kullanım Koşulları",
    tagline: "Azerbaycan'ı akıllıca keşfedin",
  },
};

export default function Footer({ locale = "en" }: { locale?: string }) {
  const lang = (locale === "ru" || locale === "az" || locale === "tr") ? locale : "en";
  const t = content[lang as keyof typeof content];

  return (
    <footer style={{ background: "#06090f", borderTop: `1px solid ${T.border}`, fontFamily: T.font }}>
      <style>{`
        .footer-link { color: ${T.textMuted}; font-size: 13px; text-decoration: none; transition: color 0.2s; line-height: 1; }
        .footer-link:hover { color: ${T.accent}; }
        .footer-col-title { color: ${T.textSoft}; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 20px; }
        @media(max-width: 767px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } .footer-brand { grid-column: 1 / -1; } }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 48px 48px" }}>

        {/* Top divider with glow */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,170,0.3), transparent)", marginBottom: 48 }} />

        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48 }}>

          {/* Brand */}
          <div className="footer-brand">
            <Link href={`/${locale}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 16 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent, boxShadow: `0 0 8px ${T.accent}` }} />
              <span style={{ fontFamily: T.fontDisplay, fontSize: 18, fontWeight: 800, letterSpacing: -0.5, color: T.text }}>
                CASPIAN<span style={{ color: T.accent }}>.</span>ROUTES
              </span>
            </Link>
            <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.7, maxWidth: 280, margin: "0 0 20px" }}>
              {t.description}
            </p>
            <p style={{ color: "rgba(0,212,170,0.4)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
              {t.tagline}
            </p>
          </div>

          {/* Guide links */}
          <div>
            <p className="footer-col-title">{t.guide}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {t.links.map(link => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Planner links */}
          <div>
            <p className="footer-col-title">{t.planner}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {t.plannerLinks.map(link => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: T.textMuted, fontSize: 12, margin: 0 }}>{t.copyright}</p>
          <div style={{ display: "flex", gap: 24 }}>
            <Link href={`/${locale}/privacy`} className="footer-link" style={{ fontSize: 12 }}>{t.privacy}</Link>
            <Link href={`/${locale}/terms`} className="footer-link" style={{ fontSize: 12 }}>{t.terms}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}