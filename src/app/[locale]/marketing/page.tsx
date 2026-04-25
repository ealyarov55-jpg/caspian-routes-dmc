"use client";

import { use } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Download, Image, FileText, Globe, Lock, Briefcase } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function MarketingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { profile, loading } = useAuth();
  const router = useRouter();
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const isPartnerOrAdmin = profile?.role === "partner" || profile?.role === "admin";

  const photos = [
    { id: 1, title: "Baku Old City", file: "/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg", tag: "Baku" },
    { id: 2, title: "Sheki Mountains", file: "/images/pexels-arzu-ibaeva-479643718-16976814-opt.jpg", tag: "Sheki" },
    { id: 3, title: "Caspian Sea", file: "/images/pexels-zulfugarkarimov-34686330-opt.jpg", tag: "Caspian" },
    { id: 4, title: "Azerbaijan Nature", file: "/images/pexels-rahibyaqubov-17050728-opt.jpg", tag: "Nature" },
    { id: 5, title: "Baku Boulevard", file: "/images/pexels-zulfugarkarimov-33085326-opt.jpg", tag: "Baku" },
    { id: 6, title: "Azerbaijan Landscape", file: "/images/pozziss-azerbaijan-4856054_1920-opt.jpg", tag: "Landscape" },
  ];

  const descriptions = [
    {
      id: "baku-city-tour",
      title: tr("Baku City Tour", "Тур по Баку", "Bakı Şəhər Turu"),
      en: "Explore the vibrant capital of Azerbaijan — from the ancient walled Old City (UNESCO World Heritage Site) to the futuristic Flame Towers. Walk along the Caspian Promenade, visit the Palace of the Shirvanshahs, and discover the unique blend of Eastern tradition and modern architecture.",
      ru: "Откройте для себя столицу Азербайджана — от древнего Ичери-Шехер (объект ЮНЕСКО) до футуристических Пламенных башен. Прогуляйтесь по Приморскому бульвару, посетите Дворец Ширваншахов и откройте уникальное сочетание восточных традиций и современной архитектуры.",
      az: "Azərbaycanın paytaxtını kəşf edin — qədim İçərişəhərdən (UNESCO irsi) müasir Alov Qüllələrinə qədər. Xəzər bulvarında gəzin, Şirvanşahlar sarayını ziyarət edin.",
    },
    {
      id: "sheki-silk-road",
      title: tr("Sheki & Silk Road", "Шеки и Шёлковый путь", "Şəki və İpək Yolu"),
      en: "Journey through history along the ancient Silk Road. Visit the magnificent Khan's Palace with its stunning stained glass, stay in a restored caravanserai, and explore the traditional craft workshops of Sheki — Azerbaijan's cultural gem in the Caucasus mountains.",
      ru: "Путешествие сквозь историю по древнему Шёлковому пути. Посетите великолепный Ханский дворец с витражами, остановитесь в восстановленном каравансарае, исследуйте традиционные мастерские Шеки — культурной жемчужины Азербайджана.",
      az: "Qədim İpək Yolu boyunca tarix içindən səyahət. Möhtəşəm Xan sarayını, bərpa edilmiş karvansaranı və Şəkinin ənənəvi sənətkarlıq emalatxanalarını ziyarət edin.",
    },
  ];

  if (loading || !profile) return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7" }}>
      <Navbar locale={locale} />
    </div>
  );

  if (!isPartnerOrAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
        <Navbar locale={locale} />
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 32px rgba(10,112,112,0.3)" }}>
              <Lock size={36} color="#2dd4bf" />
            </div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, color: "#021a1a", marginBottom: 12 }}>
              {tr("Partner Access Only", "Только для партнёров", "Yalnız tərəfdaşlar üçün")}
            </h1>
            <p style={{ color: "#4a6060", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              {tr(
                "Marketing materials are available for verified travel agency partners only.",
                "Маркетинговые материалы доступны только для проверенных партнёров-турагентств.",
                "Marketinq materialları yalnız yoxlanılmış tərəfdaşlar üçün mövcuddur."
              )}
            </p>
            <Link href={`/${locale}/partners`}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #c9a84c, #d4a843)", color: "white", padding: "14px 28px", borderRadius: 14, textDecoration: "none", fontSize: 15, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
              <Briefcase size={16} />
              {tr("Apply for Partnership", "Подать заявку", "Tərəfdaşlıq üçün müraciət")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar locale={locale} />

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #021a1a 0%, #042e2e 100%)", padding: "120px 24px 60px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 999, padding: "6px 16px", marginBottom: 20 }}>
            <Briefcase size={13} color="#c9a84c" />
            <span style={{ color: "#c9a84c", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em" }}>
              {tr("Partner Marketing Kit", "Маркетинг-кит партнёра", "Tərəfdaş marketinq dəsti")}
            </span>
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, marginBottom: 16 }}>
            {tr("Marketing Materials", "Маркетинговые материалы", "Marketinq materialları")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 600 }}>
            {tr(
              "Use these photos, descriptions and texts to promote Azerbaijan tours to your clients. All materials are free to use for verified partners.",
              "Используйте эти фотографии, описания и тексты для продвижения туров по Азербайджану вашим клиентам. Все материалы бесплатны для верифицированных партнёров.",
              "Müştərilərinizə Azərbaycan turlarını təqdim etmək üçün bu foto, təsvir və mətnlərdən istifadə edin."
            )}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>

        {/* Photos section */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Image size={18} color="#2dd4bf" />
            </div>
            <div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, color: "#021a1a", fontWeight: 500 }}>
                {tr("HD Photos", "HD Фотографии", "HD Fotoşəkillər")}
              </h2>
              <p style={{ color: "#94a3a3", fontSize: 13 }}>{tr("Free to use for promotion", "Бесплатно для продвижения", "Təşviq üçün pulsuz istifadə")}</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {photos.map(photo => (
              <div key={photo.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <div style={{ position: "relative", height: 180 }}>
                  <img src={photo.file} alt={photo.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(2,26,26,0.7)", color: "white", fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase" }}>{photo.tag}</span>
                </div>
                <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ color: "#021a1a", fontSize: 14, fontWeight: 500 }}>{photo.title}</p>
                  <a href={photo.file} download={`CaspianRoutes_${photo.title.replace(/ /g, "_")}.jpg`}
                    style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "7px 12px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: 600 }}>
                    <Download size={13} />
                    {tr("Download", "Скачать", "Yüklə")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tour descriptions */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={18} color="#2dd4bf" />
            </div>
            <div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, color: "#021a1a", fontWeight: 500 }}>
                {tr("Tour Descriptions", "Описания туров", "Tur təsvirləri")}
              </h2>
              <p style={{ color: "#94a3a3", fontSize: 13 }}>{tr("Copy and use on your website or brochures", "Копируйте и используйте на своём сайте или в брошюрах", "Veb saytınızda və ya broşürlərdə kopyalayın")}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {descriptions.map(desc => (
              <div key={desc.id} style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", marginBottom: 16 }}>{desc.title}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {[
                    { lang: "EN 🇬🇧", text: desc.en },
                    { lang: "RU 🇷🇺", text: desc.ru },
                    { lang: "AZ 🇦🇿", text: desc.az },
                  ].map(item => (
                    <div key={item.lang} style={{ background: "#f8fafa", borderRadius: 12, padding: 16 }}>
                      <p style={{ color: "#0a7070", fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>{item.lang}</p>
                      <p style={{ color: "#4a6060", fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{item.text}</p>
                      <button onClick={() => navigator.clipboard.writeText(item.text)}
                        style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                        <FileText size={12} />
                        {tr("Copy Text", "Копировать", "Kopyala")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Website texts */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={18} color="#2dd4bf" />
            </div>
            <div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 26, color: "#021a1a", fontWeight: 500 }}>
                {tr("About Azerbaijan", "Об Азербайджане", "Azərbaycan haqqında")}
              </h2>
              <p style={{ color: "#94a3a3", fontSize: 13 }}>{tr("General texts for your website", "Общие тексты для вашего сайта", "Saytınız üçün ümumi mətnlər")}</p>
            </div>
          </div>
          <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {[
                {
                  lang: "EN 🇬🇧",
                  text: "Azerbaijan — the Land of Fire — is a fascinating destination at the crossroads of Europe and Asia. From the ancient Old City of Baku to the stunning Caucasus mountains, from the shores of the Caspian Sea to the Silk Road towns of Sheki and Ganja, Azerbaijan offers an unforgettable mix of history, culture and natural beauty."
                },
                {
                  lang: "RU 🇷🇺",
                  text: "Азербайджан — Страна Огней — удивительное направление на перекрёстке Европы и Азии. От древнего Ичери-Шехер в Баку до величественных гор Кавказа, от берегов Каспийского моря до городов Шёлкового пути — Шеки и Гянджи — Азербайджан предлагает незабываемое сочетание истории, культуры и природы."
                },
                {
                  lang: "AZ 🇦🇿",
                  text: "Azərbaycan — Odlar Yurdu — Avropa və Asiyanın kəsişməsindəki füsunkar bir ölkədir. Bakının qədim İçərişəhərindən Qafqaz dağlarına, Xəzər sahillərindən İpək Yolu şəhərləri Şəki və Gəncəyə qədər Azərbaycan tarix, mədəniyyət və təbiətin unudulmaz birləşməsini təqdim edir."
                },
              ].map(item => (
                <div key={item.lang} style={{ background: "#f8fafa", borderRadius: 12, padding: 16 }}>
                  <p style={{ color: "#0a7070", fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>{item.lang}</p>
                  <p style={{ color: "#4a6060", fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{item.text}</p>
                  <button onClick={() => navigator.clipboard.writeText(item.text)}
                    style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                    <FileText size={12} />
                    {tr("Copy Text", "Копировать", "Kopyala")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}