"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const values = [
    {
      icon: "🤝",
      title: tr("Local First", "Местные прежде всего", "Yerli birinci"),
      desc: tr("We connect travelers directly with local guides — no middlemen, no hidden fees.", "Мы соединяем туристов напрямую с местными гидами — без посредников и скрытых комиссий.", "Biz səyahətçiləri birbaşa yerli bələdçilərlə birləşdiririk — vasitəçisiz, gizli ödənişsiz."),
    },
    {
      icon: "🌍",
      title: tr("Authentic Experiences", "Аутентичные впечатления", "Authentic Təcrübələr"),
      desc: tr("Every route is curated by people who know Azerbaijan inside out.", "Каждый маршрут подбирается людьми, которые знают Азербайджан вдоль и поперёк.", "Hər marşrut Azərbaycanı yaxından tanıyan insanlar tərəfindən hazırlanır."),
    },
    {
      icon: "⭐",
      title: tr("Quality Assured", "Гарантия качества", "Keyfiyyət Təminatı"),
      desc: tr("All guides are verified and rated by real travelers.", "Все гиды проверены и оценены реальными туристами.", "Bütün bələdçilər real səyahətçilər tərəfindən yoxlanılıb və qiymətləndirilib."),
    },
    {
      icon: "💚",
      title: tr("Sustainable Tourism", "Устойчивый туризм", "Davamlı Turizm"),
      desc: tr("We support local communities and responsible travel practices.", "Мы поддерживаем местные сообщества и ответственный туризм.", "Biz yerli icmaları və məsuliyyətli səyahət təcrübələrini dəstəkləyirik."),
    },
  ];

  const team = [
    {
      name: "Elnur Alyarov",
      role: tr("Founder & CEO", "Основатель и CEO", "Qurucu və CEO"),
      desc: tr("10+ years in Azerbaijan tourism. Expert in DMC operations across the Caspian region.", "10+ лет в туризме Азербайджана. Эксперт по DMC-операциям в Каспийском регионе.", "Azərbaycan turizmində 10+ il təcrübə. Xəzər bölgəsində DMC əməliyyatları üzrə ekspert."),
    },
    {
      name: tr("Operations Team", "Операционная команда", "Əməliyyat Komandası"),
      role: tr("Route Specialists", "Специалисты по маршрутам", "Marşrut Mütəxəssisləri"),
      desc: tr("Local experts who curate and verify every route and guide on our platform.", "Местные эксперты, которые отбирают и проверяют каждый маршрут и гида на нашей платформе.", "Platformamızdakı hər marşrutu və bələdçini seçən və yoxlayan yerli ekspertlər."),
    },
    {
      name: tr("Guide Network", "Сеть гидов", "Bələdçi Şəbəkəsi"),
      role: tr("Local Guides & Drivers", "Местные гиды и водители", "Yerli Bələdçilər və Sürücülər"),
      desc: tr("Verified professionals who bring Azerbaijan's culture and history to life.", "Проверенные профессионалы, которые оживляют культуру и историю Азербайджана.", "Azərbaycanın mədəniyyətini və tarixini canlandıran yoxlanılmış mütəxəssislər."),
    },
  ];

  return (
  <div style={{ minHeight: "100vh", fontFamily: "DM Sans, sans-serif" }}>
    <Navbar locale={locale} />
      <style>{`
        .about-story-grid { grid-template-columns: 1fr !important; }
        .about-photos { display: none !important; }
        @media (min-width: 768px) {
          .about-story-grid { grid-template-columns: 1fr 1fr !important; }
          .about-photos { display: grid !important; }
        }
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #021a1a 0%, #042e2e 60%, #065050 100%)", padding: "160px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, #2dd4bf 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
          <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>
            {tr("About Us", "О нас", "Haqqımızda")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 24 }}>
            {tr("Connecting Travelers with", "Соединяем туристов с", "Səyahətçiləri birləşdiririk")}<br />
            <span style={{ color: "#2dd4bf" }}>{tr("Azerbaijan's Best Guides", "лучшими гидами Азербайджана", "Azərbaycanın Ən Yaxşı Bələdçiləri ilə")}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.8, marginBottom: 40 }}>
            {tr(
              "Caspian Routes DMC is Azerbaijan's premier platform for connecting international travelers with verified local drivers, guides and tour operators.",
              "Caspian Routes DMC — ведущая платформа Азербайджана для соединения международных туристов с проверенными местными водителями, гидами и туроператорами.",
              "Caspian Routes DMC — Azərbaycanın beynəlxalq səyahətçiləri yoxlanılmış yerli sürücülər, bələdçilər və tur operatorları ilə birləşdirən aparıcı platformasıdır."
            )}
          </p>
          <Link href={`/${locale}/routes`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", textDecoration: "none", padding: "14px 32px", borderRadius: 14, fontSize: 15, fontWeight: 600 }}>
            {tr("Explore Routes", "Смотреть маршруты", "Marşrutlara bax")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Story */}
      <div style={{ background: "#f0f7f7", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 64, alignItems: "center" }} className="about-story-grid">
          <div>
            <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>
              {tr("Our Story", "Наша история", "Bizim hekayəmiz")}
            </p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#021a1a", fontWeight: 400, marginBottom: 24, lineHeight: 1.2 }}>
              {tr("Born from a Passion for Azerbaijan", "Рождённые из любви к Азербайджану", "Azərbaycana Sevgidən Doğuldu")}
            </h2>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
              {tr(
                "Caspian Routes DMC was founded with a simple mission: to make Azerbaijan's incredible destinations accessible to the world, while ensuring local guides and drivers get the recognition and business they deserve.",
                "Caspian Routes DMC была основана с простой миссией: сделать удивительные направления Азербайджана доступными для всего мира, обеспечивая местным гидам и водителям заслуженное признание.",
                "Caspian Routes DMC sadə bir missiya ilə yaradıldı: Azərbaycanın inanılmaz məkanlarını dünyaya açmaq, yerli bələdçi və sürücülərə layiq olduqları tanınmanı təmin etmək."
              )}
            </p>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
              {tr(
                "We started as a traditional DMC, organizing tours for corporate clients and travel agencies. Over time, we realized that individual travelers needed a better way to connect with trusted local experts.",
                "Мы начинали как традиционный DMC, организуя туры для корпоративных клиентов и турагентств. Со временем мы поняли, что индивидуальным путешественникам нужен лучший способ связаться с местными экспертами.",
                "Korporativ müştərilər və səyahət agentlikləri üçün turlar təşkil edən ənənəvi DMC kimi başladıq. Zamanla fərdi səyahətçilərin yerli ekspertlərlə daha yaxşı əlaqə qurmağa ehtiyacı olduğunu anladıq."
              )}
            </p>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.9 }}>
              {tr(
                "Today, Caspian Routes connects travelers with hand-picked guides across Azerbaijan, from the flame towers of Baku to the ancient caravanserais of Sheki.",
                "Сегодня Caspian Routes соединяет туристов с отборными гидами по всему Азербайджану — от Пламенных башен Баку до древних карaван-сараев Шеки.",
                "Bu gün Caspian Routes səyahətçiləri Bakının Alov Qüllələrindən Şəkinin qədim karvansaralarına qədər bütün Azərbaycan üzrə seçilmiş bələdçilərlə birləşdirir."
              )}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="about-photos">
            <img src="/images/maxxja-baku-1997163_1920-opt.jpg" alt="Baku" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 16 }} />
            <img src="/images/pexels-zulfugarkarimov-33085326-opt.jpg" alt="Azerbaijan" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 16, marginTop: 24 }} />
            <img src="/images/pexels-arzu-ibaeva-479643718-16976814-opt.jpg" alt="Nature" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 16, marginTop: -24 }} />
            <img src="/images/pozziss-azerbaijan-4856054_1920-opt.jpg" alt="Caspian" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 16 }} />
          </div>
        </div>
      </div>

      {/* Values */}
      <div style={{ background: "white", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>
              {tr("What We Stand For", "Наши принципы", "Dəyərlərimiz")}
            </p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#021a1a", fontWeight: 400 }}>
              {tr("Our Values", "Наши ценности", "Bizim Dəyərlərimiz")}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {values.map(v => (
              <div key={v.title} style={{ background: "#f8fafa", borderRadius: 20, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 10 }}>{v.title}</h3>
                <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div style={{ background: "#f0f7f7", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>
              {tr("The People", "Люди", "İnsanlar")}
            </p>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", color: "#021a1a", fontWeight: 400 }}>
              {tr("Behind Caspian Routes", "За Caspian Routes", "Caspian Routes-un Arxasında")}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {team.map(member => (
              <div key={member.name} style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>{member.name[0]}</span>
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 4 }}>{member.name}</h3>
                <p style={{ color: "#0a7070", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>{member.role}</p>
                <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.7 }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg, #021a1a, #042e2e)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, marginBottom: 16 }}>
            {tr("Ready to Explore Azerbaijan?", "Готовы открыть Азербайджан?", "Azərbaycanı kəşf etməyə hazırsınız?")}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            {tr("Browse our curated routes and connect with a local guide today.", "Просмотрите наши маршруты и свяжитесь с местным гидом сегодня.", "Kurasiya edilmiş marşrutlarımıza baxın və bu gün yerli bələdçi ilə əlaqə saxlayın.")}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/${locale}/routes`}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", textDecoration: "none", padding: "14px 32px", borderRadius: 14, fontSize: 15, fontWeight: 600 }}>
              {tr("Explore Routes", "Смотреть маршруты", "Marşrutlara bax")} <ArrowRight size={16} />
            </Link>
            <Link href={`/${locale}/auth`}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: "white", textDecoration: "none", padding: "14px 32px", borderRadius: 14, fontSize: 15, fontWeight: 600, border: "1.5px solid rgba(255,255,255,0.3)" }}>
              {tr("Become a Guide", "Стать гидом", "Bələdçi ol")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}