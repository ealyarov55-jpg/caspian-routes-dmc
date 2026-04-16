"use client";

import { useState, use, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Clock, Star, MapPin, Users, Check } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const ROUTES: Record<string, any> = {
  "baku-city-tour": {
    title: { en: "Baku City Tour", ru: "Тур по Баку", az: "Bakı Şəhər Turu" },
    subtitle: { en: "Baku, Azerbaijan", ru: "Баку, Азербайджан", az: "Bakı, Azərbaycan" },
    image: "/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg",
    duration: "3 days",
    difficulty: { en: "Easy", ru: "Лёгкий", az: "Asan" },
    price: 1000,
    tag: "Popular",
    description: {
      en: "Discover the stunning contrast of ancient and modern Baku. Walk through the UNESCO-listed Old City (Icherisheher), marvel at the iconic Flame Towers, and stroll along the beautiful Caspian Boulevard.",
      ru: "Откройте для себя удивительный контраст древнего и современного Баку. Прогуляйтесь по внесённому в список ЮНЕСКО Старому городу (Ичеришехер), полюбуйтесь знаменитыми Пламенными башнями и прогуляйтесь по красивой Каспийской набережной.",
      az: "Qədim və müasir Bakının heyrətamiz kontrastını kəşf edin. UNESCO-nun siyahısına daxil edilmiş İçərişəhəri gəzin, ikonik Alov Qüllələrinə heyran olun və gözəl Xəzər bulvarında gəzinti edin.",
    },
    highlights: {
      en: ["Flame Towers", "Old City (Icherisheher)", "Baku Boulevard", "Heydar Aliyev Center", "Carpet Museum", "Funicular Railway"],
      ru: ["Пламенные башни", "Старый город (Ичеришехер)", "Бакинский бульвар", "Центр Гейдара Алиева", "Музей ковра", "Фуникулёр"],
      az: ["Alov Qüllələri", "İçərişəhər", "Bakı Bulvarı", "Heydər Əliyev Mərkəzi", "Xalça Muzeyi", "Funikulyor"],
    },
    includes: {
      en: ["Private driver", "English-speaking guide", "Hotel pickup", "Entrance fees"],
      ru: ["Личный водитель", "Русскоязычный гид", "Трансфер из отеля", "Входные билеты"],
      az: ["Şəxsi sürücü", "Azərbaycanca bələdçi", "Otel transferi", "Giriş biletləri"],
    },
  },
  "absheron-peninsula": {
    title: { en: "Absheron Peninsula", ru: "Апшеронский полуостров", az: "Abşeron Yarımadası" },
    subtitle: { en: "Fire Temple & Mud Volcanoes", ru: "Храм огня и грязевые вулканы", az: "Od Məbədi və Palçıq Vulkanları" },
    image: "/images/pexels-dnrgs-33587121-opt.jpg",
    duration: "2 days",
    difficulty: { en: "Easy", ru: "Лёгкий", az: "Asan" },
    price: 450,
    tag: "New",
    description: {
      en: "Explore the ancient Zoroastrian Fire Temple (Ateshgah), witness the eternal flames of Yanar Dag, and see the unique mud volcanoes that dot the Absheron Peninsula.",
      ru: "Исследуйте древний зороастрийский Храм огня (Атешгях), станьте свидетелем вечных огней Янар Дага и посмотрите на уникальные грязевые вулканы на Апшеронском полуострове.",
      az: "Qədim Zərdüşt Od Məbədini (Atəşgah) kəşf edin, Yanar Dağın əbədi alovlarına şahid olun və Abşeron yarımadasındakı unikal palçıq vulkanlarını görün.",
    },
    highlights: {
      en: ["Ateshgah Fire Temple", "Yanar Dag (Burning Mountain)", "Mud Volcanoes", "Bibi-Heybat Mosque", "Oil Rocks"],
      ru: ["Храм огня Атешгях", "Янар Даг (Горящая гора)", "Грязевые вулканы", "Мечеть Биби-Эйбат", "Нефтяные камни"],
      az: ["Atəşgah Od Məbədi", "Yanar Dağ", "Palçıq Vulkanları", "Bibi-Heybət Məscidi", "Neft Daşları"],
    },
    includes: {
      en: ["Private driver", "Guided tour", "Hotel pickup", "Entrance fees"],
      ru: ["Личный водитель", "Экскурсионный тур", "Трансфер из отеля", "Входные билеты"],
      az: ["Şəxsi sürücü", "Bələdçili tur", "Otel transferi", "Giriş biletləri"],
    },
  },
  "sheki-silk-road": {
    title: { en: "Sheki & Silk Road", ru: "Шеки и Шёлковый путь", az: "Şəki və İpək Yolu" },
    subtitle: { en: "Ancient Caravanserais", ru: "Древние Карaван-сараи", az: "Qədim Karvansaralar" },
    image: "/images/pexels-arzu-ibaeva-479643718-16976814-opt.jpg",
    duration: "4 days",
    difficulty: { en: "Moderate", ru: "Средний", az: "Orta" },
    price: 700,
    description: {
      en: "Journey along the ancient Silk Road to the historic city of Sheki, home to stunning caravanserais, the beautiful Khan's Palace, and traditional Azerbaijani crafts.",
      ru: "Отправьтесь по древнему Шёлковому пути в исторический город Шеки — город великолепных карaван-сараев, прекрасного Ханского дворца и традиционных азербайджанских ремёсел.",
      az: "Qədim İpək yolu boyunca tarixi Şəki şəhərinə səyahət edin — möhtəşəm karvansaralar, gözəl Xan Sarayı və ənənəvi Azərbaycan sənətkarlığının məkanı.",
    },
    highlights: {
      en: ["Sheki Khan Palace", "Upper Caravanserai", "Sheki Bazaar", "Albanian Church", "Silk Factory", "Nukha Fortress"],
      ru: ["Шекинский Ханский дворец", "Верхний Карaван-сарай", "Шекинский базар", "Албанская церковь", "Шёлковая фабрика", "Нухинская крепость"],
      az: ["Şəki Xan Sarayı", "Yuxarı Karvansara", "Şəki Bazarı", "Alban Kilsəsi", "İpək Fabriki", "Nuxu Qalası"],
    },
    includes: {
      en: ["Private driver", "English-speaking guide", "Hotel (3 nights)", "Breakfast included"],
      ru: ["Личный водитель", "Русскоязычный гид", "Отель (3 ночи)", "Завтрак включён"],
      az: ["Şəxsi sürücü", "Bələdçi", "Otel (3 gecə)", "Səhər yeməyi daxildir"],
    },
  },
  "caucasus-nature": {
    title: { en: "Caucasus Nature Trek", ru: "Поход по Кавказу", az: "Qafqaz Təbiət Turu" },
    subtitle: { en: "Forests & Mountain Villages", ru: "Леса и горные сёла", az: "Meşələr və dağ kəndləri" },
    image: "/images/pexels-rahibyaqubov-17050728-opt.jpg",
    duration: "2 days",
    difficulty: { en: "Moderate", ru: "Средний", az: "Orta" },
    price: 450,
    tag: "New",
    description: {
      en: "Explore the stunning forests and mountain villages of the Caucasus. Hike through ancient trails and discover traditional Azerbaijani village life.",
      ru: "Исследуйте удивительные леса и горные сёла Кавказа. Пройдите по древним тропам и откройте традиционный уклад жизни азербайджанских сёл.",
      az: "Qafqazın möhtəşəm meşələrini və dağ kəndlərini kəşf edin. Qədim cığırlarla gəzin və ənənəvi Azərbaycan kənd həyatını tanıyın.",
    },
    highlights: {
      en: ["Mountain Forests", "Village Life", "Hiking Trails", "Local Cuisine", "Waterfalls"],
      ru: ["Горные леса", "Сельский быт", "Туристические тропы", "Местная кухня", "Водопады"],
      az: ["Dağ meşələri", "Kənd həyatı", "Gəzinti cığırları", "Yerli mətbəx", "Şəlalələr"],
    },
    includes: {
      en: ["Private driver", "Hiking guide", "Hotel (1 night)", "Lunch included"],
      ru: ["Личный водитель", "Гид по походу", "Отель (1 ночь)", "Обед включён"],
      az: ["Şəxsi sürücü", "Gəzinti bələdçisi", "Otel (1 gecə)", "Nahar daxildir"],
    },
  },
  "caspian-sea-cruise": {
    title: { en: "Caspian Sea Cruise", ru: "Круиз по Каспию", az: "Xəzər Dənizi Kruizi" },
    subtitle: { en: "Baku Bay & Caspian Coast", ru: "Бакинская бухта и Каспийское побережье", az: "Bakı Körfəzi və Xəzər Sahili" },
    image: "/images/pexels-zulfugarkarimov-34686330-opt.jpg",
    duration: "5 days",
    difficulty: { en: "Easy", ru: "Лёгкий", az: "Asan" },
    price: 1200,
    tag: "Premium",
    description: {
      en: "Experience the unique beauty of the Caspian Sea, the world's largest lake. Explore Baku's seafront boulevard, visit coastal villages, and enjoy sunset cruises on the Caspian.",
      ru: "Познайте уникальную красоту Каспийского моря — крупнейшего озера в мире. Прогуляйтесь по набережному бульвару Баку, посетите прибрежные сёла и насладитесь закатными круизами по Каспию.",
      az: "Dünyanın ən böyük gölü olan Xəzər dənizinin unikal gözəlliyini yaşayın. Bakının dəniz kənarı bulvarını gəzin, sahil kəndlərini ziyarət edin və Xəzərdə gün batımı kruizindən zövq alın.",
    },
    highlights: {
      en: ["Baku Boulevard", "Caspian Sunset Cruise", "Coastal Villages", "Nardaran Castle", "Sand Dunes", "Fishing Villages"],
      ru: ["Бакинский бульвар", "Закатный круиз по Каспию", "Прибрежные сёла", "Замок Нардаран", "Песчаные дюны", "Рыбацкие деревни"],
      az: ["Bakı Bulvarı", "Xəzər Gün Batımı Kruizi", "Sahil Kəndləri", "Nardaran Qalası", "Qum Təpələri", "Balıqçı Kəndləri"],
    },
    includes: {
      en: ["Private driver", "Boat cruise", "Hotel (4 nights)", "All meals"],
      ru: ["Личный водитель", "Круиз на катере", "Отель (4 ночи)", "Все блюда"],
      az: ["Şəxsi sürücü", "Qayıq kruizi", "Otel (4 gecə)", "Bütün yeməklər"],
    },
  },
};

interface Provider {
  uid: string;
  name: string;
  carModel: string;
  carYear: string;
  pricePerDay: string;
  languages: string[];
  bio: string;
  availableDates: string[];
}

export default function RouteDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = use(params);
  const route = ROUTES[id];
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  useEffect(() => {
    getDocs(collection(db, "providers")).then(snap => {
      const today = new Date().toISOString().split("T")[0];
      const data = snap.docs
        .map(d => d.data() as Provider)
        .filter(p => p.availableDates?.some(d => d >= today));
      setProviders(data);
      setLoading(false);
    });
  }, []);

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  if (!route) return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ textAlign: "center", padding: 24 }}>
        <p style={{ color: "#94a3a3", fontSize: 14, marginBottom: 16 }}>{tr("Route not found", "Маршрут не найден", "Marşrut tapılmadı")}</p>
        <Link href={`/${locale}/routes`}
          style={{ display: "inline-block", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
          {tr("Browse All Routes", "Все маршруты", "Bütün marşrutlar")}
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar locale={locale} />
      <style>{`
        @media (min-width: 768px) {
          .route-detail-grid { grid-template-columns: 1fr 380px !important; }
        }
      `}</style>

      {/* Hero */}
      <div style={{ position: "relative", height: 420, overflow: "hidden", marginTop: 72 }}>
        <img src={route.image} alt={route.title[lang]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(2,26,26,0.9) 0%, rgba(2,26,26,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, padding: "80px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Link href={`/${locale}/routes`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "8px 16px", color: "white", textDecoration: "none", fontSize: 13, fontFamily: "DM Sans, sans-serif", width: "fit-content" }}>
            <ArrowLeft size={14} /> {tr("All Routes", "Все маршруты", "Bütün marşrutlar")}
          </Link>
          <div>
            {route.tag && <span style={{ background: "#c9a84c", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, display: "inline-block" }}>{route.tag}</span>}
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, marginBottom: 12 }}>{route.title[lang]}</h1>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} color="#2dd4bf" /><span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{route.duration}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Star size={14} color="#2dd4bf" /><span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{route.difficulty[lang]}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} color="#2dd4bf" /><span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{route.subtitle[lang]}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 32, alignItems: "start" }} className="route-detail-grid">

          {/* Left */}
          <div>
            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 14 }}>
                {tr("About this Route", "О маршруте", "Marşrut haqqında")}
              </h2>
              <p style={{ color: "#4a6060", lineHeight: 1.7, fontSize: 15 }}>{route.description[lang]}</p>
            </div>

            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.08)", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16 }}>
                {tr("Highlights", "Основные места", "Əsas yerlər")}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {route.highlights[lang].map((h: string) => (
                  <div key={h} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(10,112,112,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={11} color="#0a7070" />
                    </div>
                    <span style={{ fontSize: 14, color: "#4a6060" }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 24, color: "#021a1a", marginBottom: 16 }}>
                {tr("What's Included", "Что включено", "Nə daxildir")}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {route.includes[lang].map((inc: string) => (
                  <div key={inc} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Check size={14} color="#2dd4bf" />
                    <span style={{ fontSize: 14, color: "#4a6060" }}>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Providers */}
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(4,46,46,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <Users size={18} color="#0a7070" />
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, color: "#021a1a", fontWeight: 600 }}>
                  {tr("Available Guides", "Доступные гиды", "Mövcud bələdçilər")} ({providers.length})
                </h3>
              </div>
              {loading ? (
                <p style={{ color: "#94a3a3", fontSize: 13 }}>Loading...</p>
              ) : providers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <Users size={32} color="#e2eded" style={{ marginBottom: 8 }} />
                  <p style={{ color: "#94a3a3", fontSize: 14 }}>{tr("No guides available yet", "Пока нет гидов", "Hələ bələdçi yoxdur")}</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {providers.map(p => (
                    <div key={p.uid} style={{ padding: 16, borderRadius: 14, border: "1.5px solid #e2eded" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
                          {p.name ? p.name[0].toUpperCase() : "?"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, color: "#021a1a", fontSize: 15 }}>{p.name}</p>
                          <p style={{ color: "#94a3a3", fontSize: 12 }}>{p.carModel} {p.carYear}</p>
                        </div>
                        {p.pricePerDay && (
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 20, fontWeight: 700, color: "#021a1a" }}>${p.pricePerDay}</p>
                            <p style={{ fontSize: 10, color: "#94a3a3" }}>{tr("per day", "в день", "gündə")}</p>
                          </div>
                        )}
                      </div>
                      {p.bio && <p style={{ fontSize: 13, color: "#4a6060", marginBottom: 10, lineHeight: 1.5 }}>{p.bio.slice(0, 80)}...</p>}
                      {p.languages?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                          {p.languages.map(l => (
                            <span key={l} style={{ fontSize: 10, background: "rgba(10,112,112,0.08)", color: "#0a7070", padding: "2px 8px", borderRadius: 999 }}>{l}</span>
                          ))}
                        </div>
                      )}
                      <Link href={`/${locale}/book/${p.uid}?route=${id}`}
                        style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg, #0a7070, #0d9090)", color: "white", padding: "10px", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                        {tr("Book This Guide", "Забронировать", "Rezerv et")}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}