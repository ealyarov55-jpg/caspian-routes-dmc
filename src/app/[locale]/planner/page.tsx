"use client";

import { useState, use, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

const content = {
  ru: {
    title: "AI-планировщик маршрутов",
    subtitle: "Ответь на 7 вопросов — получи готовый маршрут по Азербайджану",
    step1: "Сколько дней?",
    step2: "Состав группы",
    step3: "Бюджет на человека",
    step4: "Интересы",
    step5: "Питание и аллергии",
    step6: "Темп поездки",
    step7: "Откуда летишь?",
    generate: "Создать маршрут →",
    generating: "Создаём маршрут...",
    days: ["3 дня", "5 дней", "7 дней", "10+ дней"],
    groups: ["Один", "Пара", "Семья с детьми", "Друзья"],
    budgets: ["1", "2", "3", "4"],
    interests: ["История и культура", "Природа", "Гастрономия", "Фото", "Активный отдых", "Шопинг"],
    diets: ["Нет ограничений", "Вегетарианец", "Веган", "Халяль", "Без глютена", "Без лактозы", "Аллергия на морепродукты", "Аллергия на орехи"],
    paces: [
      { id: "relaxed", label: "🌿 Расслабленный", desc: "2-3 активности в день, много отдыха" },
      { id: "medium", label: "⚡ Средний", desc: "Баланс активностей и отдыха" },
      { id: "intensive", label: "🔥 Насыщенный", desc: "Максимум впечатлений, ранние подъёмы" },
    ],
    morning: "Утро",
    afternoon: "День",
    evening: "Вечер",
    bookHotel: "Найти отель →",
    bookExcursion: "Забронировать →",
    flights: "Авиабилеты",
    bookFlight: "Найти билеты →",
    carRental: "Аренда авто",
    bookCar: "Найти авто →",
    restart: "Создать новый маршрут",
    downloadPdf: "Скачать маршрут PDF",
    selectRegion: "Выбери регион:",
    selectCountry: "Выбери страну:",
    selectCity: "Выбери город:",
    back: "← Назад",
    change: "Изменить",
    next: "Далее →",
    skip: "Пропустить →",
    loadingSteps: [
      "🗺️ Анализируем твои интересы...",
      "🏨 Подбираем лучшие отели...",
      "✈️ Проверяем рейсы и маршруты...",
      "🎯 Составляем план по дням...",
      "💡 Добавляем советы и лайфхаки...",
      "✅ Финальная проверка маршрута...",
    ],
  },
  en: {
    title: "AI Trip Planner",
    subtitle: "Answer 7 questions — get a personalized Azerbaijan itinerary",
    step1: "How many days?",
    step2: "Group type",
    step3: "Budget per person",
    step4: "Interests",
    step5: "Diet & Allergies",
    step6: "Travel pace",
    step7: "Flying from?",
    generate: "Create Itinerary →",
    generating: "Creating itinerary...",
    days: ["3 days", "5 days", "7 days", "10+ days"],
    groups: ["Solo", "Couple", "Family with kids", "Friends"],
    budgets: ["1", "2", "3", "4"],
    interests: ["History & Culture", "Nature", "Food", "Photography", "Adventure", "Shopping"],
    diets: ["No restrictions", "Vegetarian", "Vegan", "Halal", "Gluten-free", "Lactose-free", "Seafood allergy", "Nut allergy"],
    paces: [
      { id: "relaxed", label: "🌿 Relaxed", desc: "2-3 activities per day, lots of rest" },
      { id: "medium", label: "⚡ Moderate", desc: "Balance of activities and rest" },
      { id: "intensive", label: "🔥 Intensive", desc: "Maximum experiences, early starts" },
    ],
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    bookHotel: "Find hotel →",
    bookExcursion: "Book now →",
    flights: "Flights",
    bookFlight: "Find flights →",
    carRental: "Car rental",
    bookCar: "Find car →",
    restart: "Create new itinerary",
    downloadPdf: "Download PDF itinerary",
    selectRegion: "Select region:",
    selectCountry: "Select country:",
    selectCity: "Select city:",
    back: "← Back",
    change: "Change",
    next: "Next →",
    skip: "Skip →",
    loadingSteps: [
      "🗺️ Analyzing your interests...",
      "🏨 Finding the best hotels...",
      "✈️ Checking flights and routes...",
      "🎯 Building your day-by-day plan...",
      "💡 Adding tips and insider advice...",
      "✅ Final itinerary review...",
    ],
  },
  az: {
    title: "AI Marşrut Planlayıcısı",
    subtitle: "7 suala cavab ver — Azərbaycana fərdi marşrut al",
    step1: "Neçə gün?",
    step2: "Qrup növü",
    step3: "Adam başına büdcə",
    step4: "Maraqlar",
    step5: "Qida və allergiyalar",
    step6: "Səyahət tempi",
    step7: "Haradan uçursunuz?",
    generate: "Marşrut Yarat →",
    generating: "Marşrut yaradılır...",
    days: ["3 gün", "5 gün", "7 gün", "10+ gün"],
    groups: ["Tək", "Cütlük", "Uşaqlı ailə", "Dostlar"],
    budgets: ["1", "2", "3", "4"],
    interests: ["Tarix və mədəniyyət", "Təbiət", "Qastronomiya", "Foto", "Aktiv istirahət", "Alış-veriş"],
    diets: ["Məhdudiyyət yoxdur", "Vegetarian", "Vegan", "Halal", "Qlütensiz", "Laktosasız", "Dəniz məhsulları allergiyası", "Qoz allergiyası"],
    paces: [
      { id: "relaxed", label: "🌿 Rahat", desc: "Gündə 2-3 fəaliyyət, çox istirahət" },
      { id: "medium", label: "⚡ Orta", desc: "Fəaliyyət və istirahət balansı" },
      { id: "intensive", label: "🔥 Intensiv", desc: "Maksimum təəssürat, erkən oyanış" },
    ],
    morning: "Səhər",
    afternoon: "Gündüz",
    evening: "Axşam",
    bookHotel: "Otel tap →",
    bookExcursion: "Rezerv et →",
    flights: "Aviabiletlər",
    bookFlight: "Bilet tap →",
    carRental: "Avtomobil icarəsi",
    bookCar: "Avtomobil tap →",
    restart: "Yeni marşrut yarat",
    downloadPdf: "PDF marşrut yüklə",
    selectRegion: "Region seç:",
    selectCountry: "Ölkə seç:",
    selectCity: "Şəhər seç:",
    back: "← Geri",
    change: "Dəyiş",
    next: "Növbəti →",
    skip: "Keç →",
    loadingSteps: [
      "🗺️ Maraqlarınız analiz edilir...",
      "🏨 Ən yaxşı otellər axtarılır...",
      "✈️ Uçuşlar yoxlanılır...",
      "🎯 Gündəlik plan hazırlanır...",
      "💡 Məsləhətlər əlavə edilir...",
      "✅ Yekun yoxlama...",
    ],
  },
  tr: {
  title: "AI Rota Planlayıcısı",
  subtitle: "7 soruyu yanıtla — Azerbaycan için kişisel rota al",
  step1: "Kaç gün?",
  step2: "Grup türü",
  step3: "Kişi başı bütçe",
  step4: "İlgi alanları",
  step5: "Diyet ve alerjiler",
  step6: "Seyahat temposu",
  step7: "Nereden uçuyorsunuz?",
  generate: "Rota Oluştur →",
  generating: "Rota oluşturuluyor...",
  days: ["3 gün", "5 gün", "7 gün", "10+ gün"],
  groups: ["Yalnız", "Çift", "Çocuklu aile", "Arkadaşlar"],
  budgets: ["1", "2", "3", "4"],
  interests: ["Tarih ve kültür", "Doğa", "Gastronomi", "Fotoğraf", "Macera", "Alışveriş"],
  diets: ["Kısıtlama yok", "Vejetaryen", "Vegan", "Helal", "Glutensiz", "Laktozsuz", "Deniz ürünleri alerjisi", "Fındık alerjisi"],
  paces: [
    { id: "relaxed", label: "🌿 Rahat", desc: "Günde 2-3 aktivite, çok dinlenme" },
    { id: "medium", label: "⚡ Orta", desc: "Aktivite ve dinlenme dengesi" },
    { id: "intensive", label: "🔥 Yoğun", desc: "Maksimum deneyim, erken başlangıç" },
  ],
  morning: "Sabah",
  afternoon: "Öğleden sonra",
  evening: "Akşam",
  bookHotel: "Otel bul →",
  bookExcursion: "Rezervasyon yap →",
  flights: "Uçuşlar",
  bookFlight: "Uçuş bul →",
  carRental: "Araba kiralama",
  bookCar: "Araba bul →",
  restart: "Yeni rota oluştur",
  downloadPdf: "PDF rotayı indir",
  selectRegion: "Bölge seç:",
  selectCountry: "Ülke seç:",
  selectCity: "Şehir seç:",
  back: "← Geri",
  change: "Değiştir",
  next: "İleri →",
  skip: "Atla →",
  loadingSteps: [
    "🗺️ İlgi alanlarınız analiz ediliyor...",
    "🏨 En iyi oteller aranıyor...",
    "✈️ Uçuşlar ve rotalar kontrol ediliyor...",
    "🎯 Günlük plan hazırlanıyor...",
    "💡 İpuçları ekleniyor...",
    "✅ Son rota kontrolü...",
  ],
},
};
const CURRENCY_BUDGETS: Record<string, { symbol: string; ranges: string[] }> = {
  ru: { symbol: "₽", ranges: ["₽25 000–45 000", "₽45 000–90 000", "₽90 000–180 000", "₽180 000+"] },
  kz: { symbol: "₸", ranges: ["₸150 000–250 000", "₸250 000–500 000", "₸500 000–1 000 000", "₸1 000 000+"] },
  uz: { symbol: "сум", ranges: ["3 500 000–6 000 000 сум", "6 000 000–12 000 000 сум", "12 000 000–24 000 000 сум", "24 000 000+ сум"] },
  tr: { symbol: "₺", ranges: ["₺10 000–18 000", "₺18 000–35 000", "₺35 000–70 000", "₺70 000+"] },
  ae: { symbol: "د.إ", ranges: ["د.إ1 100–1 800", "د.إ1 800–3 700", "د.إ3 700–7 300", "د.إ7 300+"] },
  cn: { symbol: "¥", ranges: ["¥2 200–3 600", "¥3 600–7 300", "¥7 300–14 500", "¥14 500+"] },
  pk: { symbol: "₨", ranges: ["₨85 000–140 000", "₨140 000–280 000", "₨280 000–560 000", "₨560 000+"] },
  by: { symbol: "Br", ranges: ["Br1 000–1 600", "Br1 600–3 200", "Br3 200–6 500", "Br6 500+"] },
  ua: { symbol: "₴", ranges: ["₴12 000–20 000", "₴20 000–40 000", "₴40 000–80 000", "₴80 000+"] },
  de: { symbol: "€", ranges: ["€280–450", "€450–900", "€900–1 800", "€1 800+"] },
  fr: { symbol: "€", ranges: ["€280–450", "€450–900", "€900–1 800", "€1 800+"] },
  gb: { symbol: "€", ranges: ["€280–450", "€450–900", "€900–1 800", "€1 800+"] },
  eu_other: { symbol: "€", ranges: ["€280–450", "€450–900", "€900–1 800", "€1 800+"] },
  us: { symbol: "$", ranges: ["$300–500", "$500–1 000", "$1 000–2 000", "$2 000+"] },
  ca: { symbol: "CA$", ranges: ["CA$400–650", "CA$650–1 300", "CA$1 300–2 600", "CA$2 600+"] },
  az: { symbol: "₼", ranges: ["₼500–850", "₼850–1 700", "₼1 700–3 400", "₼3 400+"] },
  default: { symbol: "$", ranges: ["$300–500", "$500–1 000", "$1 000–2 000", "$2 000+"] },
};
const GEO_DATA = {
 continents: [
  { id: "asia", label: { ru: "🌏 Азия", en: "🌏 Asia", az: "🌏 Asiya", tr: "🌏 Asya" } },
  { id: "europe", label: { ru: "🌍 Европа", en: "🌍 Europe", az: "🌍 Avropa", tr: "🌍 Avrupa" } },
  { id: "america", label: { ru: "🌎 Америка", en: "🌎 America", az: "🌎 Amerika", tr: "🌎 Amerika" } },
  { id: "other", label: { ru: "🌐 Другой регион", en: "🌐 Other region", az: "🌐 Digər region", tr: "🌐 Diğer bölge" } },
],
  countries: {
   asia: [
  { id: "ru", flag: "🇷🇺", label: { ru: "Россия", en: "Russia", az: "Rusiya", tr: "Rusya" } },
  { id: "kz", flag: "🇰🇿", label: { ru: "Казахстан", en: "Kazakhstan", az: "Qazaxıstan", tr: "Kazakistan" } },
  { id: "uz", flag: "🇺🇿", label: { ru: "Узбекистан", en: "Uzbekistan", az: "Özbəkistan", tr: "Özbekistan" } },
  { id: "tr", flag: "🇹🇷", label: { ru: "Турция", en: "Turkey", az: "Türkiyə", tr: "Türkiye" } },
  { id: "ae", flag: "🇦🇪", label: { ru: "ОАЭ", en: "UAE", az: "BƏƏ", tr: "BAE" } },
  { id: "cn", flag: "🇨🇳", label: { ru: "Китай", en: "China", az: "Çin", tr: "Çin" } },
  { id: "pk", flag: "🇵🇰", label: { ru: "Пакистан", en: "Pakistan", az: "Pakistan", tr: "Pakistan" } },
  { id: "asia_other", flag: "🌏", label: { ru: "Другая страна Азии", en: "Other Asian country", az: "Asiyada başqa ölkə", tr: "Diğer Asya ülkesi" } },
],
europe: [
  { id: "by", flag: "🇧🇾", label: { ru: "Беларусь", en: "Belarus", az: "Belarus", tr: "Belarus" } },
  { id: "ua", flag: "🇺🇦", label: { ru: "Украина", en: "Ukraine", az: "Ukrayna", tr: "Ukrayna" } },
  { id: "de", flag: "🇩🇪", label: { ru: "Германия", en: "Germany", az: "Almaniya", tr: "Almanya" } },
  { id: "fr", flag: "🇫🇷", label: { ru: "Франция", en: "France", az: "Fransa", tr: "Fransa" } },
  { id: "gb", flag: "🇬🇧", label: { ru: "Великобритания", en: "United Kingdom", az: "Böyük Britaniya", tr: "Birleşik Krallık" } },
  { id: "eu_other", flag: "🌍", label: { ru: "Другая страна Европы", en: "Other European country", az: "Avropada başqa ölkə", tr: "Diğer Avrupa ülkesi" } },
],
america: [
  { id: "us", flag: "🇺🇸", label: { ru: "США", en: "USA", az: "ABŞ", tr: "ABD" } },
  { id: "ca", flag: "🇨🇦", label: { ru: "Канада", en: "Canada", az: "Kanada", tr: "Kanada" } },
  { id: "am_other", flag: "🌎", label: { ru: "Другая страна Америки", en: "Other American country", az: "Amerikada başqa ölkə", tr: "Diğer Amerika ülkesi" } },
],
other: [
  { id: "other", flag: "🌐", label: { ru: "Другой регион", en: "Other region", az: "Digər region", tr: "Diğer bölge" } },
],
  } as Record<string, { id: string; flag: string; label: { ru: string; en: string; az: string; tr: string } }[]>,
  cities: {
    ru: {
      en: ["Moscow", "Saint Petersburg", "Kazan", "Yekaterinburg", "Other city"],
      ru: ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Другой город"],
      az: ["Moskva", "Sankt-Peterburq", "Kazan", "Yekaterinburq", "Digər şəhər"],
      tr: ["Moskova", "Sankt-Petersburg", "Kazan", "Yekaterinburg", "Diğer şehir"],
    },
    kz: {
      en: ["Almaty", "Astana", "Other city"],
      ru: ["Алматы", "Астана", "Другой город"],
      az: ["Almatı", "Astana", "Digər şəhər"],
      tr: ["Almatı", "Astana", "Diğer şehir"],
    },
    uz: {
      en: ["Tashkent", "Samarkand", "Other city"],
      ru: ["Ташкент", "Самарканд", "Другой город"],
      az: ["Daşkənd", "Səmərqənd", "Digər şəhər"],
      tr: ["Taşkent", "Semerkand", "Diğer şehir"],
    },
    tr: {
      en: ["Istanbul", "Ankara", "Other city"],
      ru: ["Стамбул", "Анкара", "Другой город"],
      az: ["İstanbul", "Ankara", "Digər şəhər"],
      tr: ["İstanbul", "Ankara", "Diğer şehir"],
    },
    ae: {
      en: ["Dubai", "Abu Dhabi", "Other city"],
      ru: ["Дубай", "Абу-Даби", "Другой город"],
      az: ["Dubai", "Əbu-Dabi", "Digər şəhər"],
      tr: ["Dubai", "Abu Dabi", "Diğer şehir"],
    },
    cn: {
      en: ["Beijing", "Shanghai", "Other city"],
      ru: ["Пекин", "Шанхай", "Другой город"],
      az: ["Pekin", "Şanxay", "Digər şəhər"],
      tr: ["Pekin", "Şanghay", "Diğer şehir"],
    },
    pk: {
      en: ["Karachi", "Lahore", "Other city"],
      ru: ["Карачи", "Лахор", "Другой город"],
      az: ["Karaçi", "Lahor", "Digər şəhər"],
      tr: ["Karaçi", "Lahor", "Diğer şehir"],
    },
    by: {
      en: ["Minsk", "Other city"],
      ru: ["Минск", "Другой город"],
      az: ["Minsk", "Digər şəhər"],
      tr: ["Minsk", "Diğer şehir"],
    },
    ua: {
      en: ["Kyiv", "Other city"],
      ru: ["Киев", "Другой город"],
      az: ["Kiyev", "Digər şəhər"],
      tr: ["Kiev", "Diğer şehir"],
    },
    de: {
      en: ["Berlin", "Munich", "Other city"],
      ru: ["Берлин", "Мюнхен", "Другой город"],
      az: ["Berlin", "Münhen", "Digər şəhər"],
      tr: ["Berlin", "Münih", "Diğer şehir"],
    },
    fr: {
      en: ["Paris", "Other city"],
      ru: ["Париж", "Другой город"],
      az: ["Paris", "Digər şəhər"],
      tr: ["Paris", "Diğer şehir"],
    },
    gb: {
      en: ["London", "Other city"],
      ru: ["Лондон", "Другой город"],
      az: ["London", "Digər şəhər"],
      tr: ["Londra", "Diğer şehir"],
    },
    us: {
      en: ["New York", "Los Angeles", "Other city"],
      ru: ["Нью-Йорк", "Лос-Анджелес", "Другой город"],
      az: ["Nyu-York", "Los-Anceles", "Digər şəhər"],
      tr: ["New York", "Los Angeles", "Diğer şehir"],
    },
    ca: {
      en: ["Toronto", "Vancouver", "Other city"],
      ru: ["Торонто", "Ванкувер", "Другой город"],
      az: ["Toronto", "Vankuver", "Digər şəhər"],
      tr: ["Toronto", "Vancouver", "Diğer şehir"],
    },
    asia_other: {
      en: ["Other city"], ru: ["Другой город"], az: ["Digər şəhər"], tr: ["Diğer şehir"],
    },
    eu_other: {
      en: ["Other city"], ru: ["Другой город"], az: ["Digər şəhər"], tr: ["Diğer şehir"],
    },
    am_other: {
      en: ["Other city"], ru: ["Другой город"], az: ["Digər şəhər"], tr: ["Diğer şehir"],
    },
    other: {
      en: ["Other city"], ru: ["Другой город"], az: ["Digər şəhər"], tr: ["Diğer şehir"],
    },
  } as Record<string, Record<string, string[]>>,
};
type PhotoData = {
  url: string | null;
  photographer?: string;
  photographerUrl?: string;
};

function useUnsplashPhoto(query: string, enabled: boolean) {
  const [photo, setPhoto] = useState<PhotoData>({ url: null });
  useEffect(() => {
    if (!enabled || !query) return;
    fetch(`/api/unsplash?query=${encodeURIComponent(query + " azerbaijan")}`)
      .then(r => r.json())
      .then(data => setPhoto(data))
      .catch(() => setPhoto({ url: null }));
  }, [query, enabled]);
  return photo;
}
type Plan = {
  plan_title: string;
  total_budget_estimate: string;
  days: Array<{
    day: number;
    title: string;
    morning: { activity: string; description: string; tip: string; curator_note?: string };
    afternoon: { activity: string; description: string; tip: string; curator_note?: string };
    evening: { activity: string; description: string; tip: string; curator_note?: string };
    hotel: { name: string; booking_url: string };
    excursion: { name: string; url: string };
  }>;
  flights: { tip: string; url: string };
  car_rental: { tip: string; url: string };
};

function LoadingScreen({ steps }: { steps: string[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2200);
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 95 ? prev + 1 : prev));
    }, 140);
    return () => { clearInterval(stepInterval); clearInterval(progressInterval); };
  }, [steps.length]);

  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(45,212,191,0.1)", border: "2px solid rgba(45,212,191,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "pulse 2s ease-in-out infinite" }}>
          <span style={{ fontSize: 36 }}>🗺️</span>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(45,212,191,0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(45,212,191,0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
      <div style={{ minHeight: 32, marginBottom: 40 }}>
        <p key={currentStep} style={{ color: "white", fontSize: 18, fontWeight: 500, fontFamily: "DM Sans, sans-serif", animation: "fadeIn 0.4s ease" }}>
          {steps[currentStep]}
        </p>
      </div>
      <div style={{ maxWidth: 400, margin: "0 auto 32px" }}>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, borderRadius: 99, background: "linear-gradient(90deg, #0a7070, #2DD4BF)", transition: "width 0.14s linear" }} />
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 10 }}>{progress}%</p>
      </div>
      <div style={{ maxWidth: 360, margin: "0 auto", textAlign: "left" }}>
        {steps.slice(0, currentStep + 1).map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", opacity: i === currentStep ? 1 : 0.45, transition: "opacity 0.3s" }}>
            <span style={{ color: i < currentStep ? "#2DD4BF" : "rgba(255,255,255,0.3)", fontSize: 14 }}>{i < currentStep ? "✓" : "›"}</span>
            <span style={{ color: i === currentStep ? "white" : "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "DM Sans, sans-serif" }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function SmallActivityCard({ label, data, icon, photoUrl, photographer, photographerUrl }: {
  label: string;
  data: { activity: string; description: string; tip: string; curator_note?: string };
  icon: "morning" | "afternoon" | "evening";
  photoUrl: string | null;
  photographer?: string;
  photographerUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#18181b", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
      {photoUrl ? (
        <div style={{ position: "relative", height: 140, overflow: "hidden", flexShrink: 0 }}>
          <img src={photoUrl} alt={data.activity} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
          {photographer && photographerUrl && (
            <a href={`${photographerUrl}?utm_source=caspian_routes&utm_medium=referral`} target="_blank" rel="noopener noreferrer"
              style={{ position: "absolute", bottom: 6, right: 8, color: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: "DM Sans, sans-serif", textDecoration: "none" }}>
              Photo: {photographer}
            </a>
          )}
        </div>
      ) : (
        <div style={{ height: 140, background: "linear-gradient(135deg, rgba(45,212,191,0.08), rgba(10,112,112,0.15))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 32, opacity: 0.4 }}>{icon === "morning" ? "🌅" : icon === "afternoon" ? "☀️" : "🌙"}</span>
        </div>
      )}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <span style={{ color: "#4DB6AC", fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.4em", fontFamily: "DM Sans, sans-serif" }}>{label}</span>
        <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 15, fontWeight: 500, color: "white", lineHeight: 1.4, margin: 0 }}>{data.activity}</h3>
        <p style={{ color: "#9f9fa9", fontSize: 12, lineHeight: 1.7, margin: 0, fontFamily: "DM Sans, sans-serif", flex: 1 }}>{data.description}</p>
        {data.curator_note && (
          <div style={{ borderLeft: "2px solid rgba(45,212,191,0.4)", paddingLeft: 12, marginTop: 8 }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontStyle: "italic", fontFamily: "Cormorant Garamond, serif", lineHeight: 1.7, margin: 0 }}>{data.curator_note}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedActivityCard({ label, data, photoUrl, photographer, photographerUrl, bookLabel, bookUrl }: {
  label: string;
  data: { activity: string; description: string; tip: string; curator_note?: string };
  photoUrl: string | null;
  photographer?: string;
  photographerUrl?: string;
  bookLabel?: string;
  bookUrl?: string;
}) {
  return (
    <div style={{ background: "#18181b", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
        {photoUrl ? (
          <img src={photoUrl} alt={data.activity} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0a2a2a, #0d3d3d)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ fontSize: 48, opacity: 0.5 }}>🏛️</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "DM Sans, sans-serif" }}>{data.activity}</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", top: 16, left: 16, background: "rgba(45,212,191,0.9)", borderRadius: 99, padding: "4px 12px" }}>
          <span style={{ color: "#0D1116", fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.15em", fontFamily: "DM Sans, sans-serif" }}>{label}</span>
        </div>
        {photographer && photographerUrl && (
          <a href={`${photographerUrl}?utm_source=caspian_routes&utm_medium=referral`} target="_blank" rel="noopener noreferrer"
            style={{ position: "absolute", bottom: 130, right: 12, color: "rgba(255,255,255,0.45)", fontSize: 9, fontFamily: "DM Sans, sans-serif", textDecoration: "none" }}>
            Photo: {photographer}
          </a>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 400, color: "white", lineHeight: 1.3, margin: "0 0 10px" }}>{data.activity}</h3>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.7, margin: 0, fontFamily: "DM Sans, sans-serif" }}>{data.description}</p>
        </div>
      </div>
      {data.curator_note && (
        <div style={{ padding: "12px 24px 0", borderLeft: "2px solid rgba(45,212,191,0.4)", margin: "12px 24px 0" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontStyle: "italic", fontFamily: "Cormorant Garamond, serif", lineHeight: 1.7, margin: 0 }}>{data.curator_note}</p>
        </div>
      )}
      {bookLabel && bookUrl && (
        <div style={{ padding: "16px 24px 20px" }}>
          <a href={bookUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 8, color: "#2DD4BF", fontSize: 12, fontFamily: "DM Sans, sans-serif", textDecoration: "none" }}>
            {bookLabel}
          </a>
        </div>
      )}
    </div>
  );
}

function DaySection({ day, t, lang, planEnabled }: {
  day: Plan["days"][0];
  t: typeof content["en"];
  lang: string;
  planEnabled: boolean;
}) {
  const afternoonPhoto = useUnsplashPhoto(day.afternoon.activity, planEnabled);
  const morningPhoto = useUnsplashPhoto(day.morning.activity, planEnabled);
  const eveningPhoto = useUnsplashPhoto(day.evening.activity, planEnabled);
  const dayLabel = lang === "ru" ? `День ${day.day}` : lang === "az" ? `Gün ${day.day}` : lang === "tr" ? `Gün ${day.day}` : `Day ${day.day}`;

  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#2DD4BF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#0D1116", fontFamily: "DM Sans, sans-serif", flexShrink: 0 }}>{day.day}</div>
        <div>
          <p style={{ color: "#2DD4BF", fontSize: 10, fontFamily: "DM Sans, sans-serif", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.4em", marginBottom: 3 }}>{dayLabel}</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "white", fontWeight: 300, margin: 0 }}>{day.title}</h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="day-cards-grid">
        <FeaturedActivityCard
          label={`Featured · ${t.afternoon}`}
          data={day.afternoon}
          photoUrl={afternoonPhoto.url}
          photographer={afternoonPhoto.photographer}
          photographerUrl={afternoonPhoto.photographerUrl}
          bookLabel={day.excursion?.name ? t.bookExcursion : undefined}
          bookUrl={day.excursion?.url}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SmallActivityCard label={t.morning} data={day.morning} icon="morning" photoUrl={morningPhoto.url} photographer={morningPhoto.photographer} photographerUrl={morningPhoto.photographerUrl} />
          <SmallActivityCard label={t.evening} data={day.evening} icon="evening" photoUrl={eveningPhoto.url} photographer={eveningPhoto.photographer} photographerUrl={eveningPhoto.photographerUrl} />
        </div>
      </div>

      {day.hotel?.name && (
  <a href={day.hotel.booking_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", marginBottom: 16 }}>
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(45,212,191,0.15)", borderRadius: 16, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, transition: "all 0.25s ease" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(45,212,191,0.4)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(45,212,191,0.15)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </div>
        <div>
          <p style={{ color: "rgba(45,212,191,0.6)", fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.4em", fontFamily: "DM Sans, sans-serif", marginBottom: 3 }}>
            {lang === "ru" ? "Рекомендация ИИ" : "AI Recommendation"}
          </p>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, fontWeight: 500, color: "white", margin: 0 }}>{day.hotel.name}</h3>
        </div>
      </div>
      <div style={{ border: "1px solid rgba(45,212,191,0.3)", borderRadius: 8, padding: "7px 14px", whiteSpace: "nowrap" as const, transition: "all 0.2s" }}>
        <span style={{ color: "#2DD4BF", fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: 400 }}>{t.bookHotel}</span>
      </div>
    </div>
  </a>
)}
<div style={{ height: 1, background: "rgba(45,212,191,0.1)", marginTop: 32 }} />
    </section>
  );
}
 export default function PlannerPage({ params }: { params: Promise<{ locale: string }> }) {
const { locale } = use(params);
  const lang = (locale === "ru" || locale === "az" || locale === "tr") ? locale : "en";
  const t = content[lang];

 const [step, setStep] = useState(0);
const [days, setDays] = useState("");
const [group, setGroup] = useState("");
const [budget, setBudget] = useState("");
const [interests, setInterests] = useState<string[]>([]);
const [diet, setDiet] = useState<string[]>([]);
const [pace, setPace] = useState("");
const [continent, setContinent] = useState("");
const [country, setCountry] = useState("");
const [city, setCity] = useState("");
const [loading, setLoading] = useState(false);
const [plan, setPlan] = useState<Plan | null>(null);
const [planEnabled, setPlanEnabled] = useState(false);
const [error, setError] = useState("");
const planRef = useRef<HTMLDivElement>(null);
const bgPhotos = [
  "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/18313670/pexels-photo-18313670.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/3889827/pexels-photo-3889827.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1200",
];
const [bgIndex, setBgIndex] = useState(0);
useEffect(() => {
  if (step >= TOTAL_STEPS && !loading) return;
  const interval = setInterval(() => {
    setBgIndex(prev => (prev + 1) % bgPhotos.length);
  }, 4000);
  return () => clearInterval(interval);
}, [step]);
const currentBudgets = typeof window !== "undefined" ? (CURRENCY_BUDGETS[country] ?? CURRENCY_BUDGETS["default"]) : CURRENCY_BUDGETS["default"];

  const toggleInterest = (i: string) => setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const toggleDiet = (d: string) => {
    if (d === t.diets[0]) { setDiet([d]); return; }
    setDiet(prev => {
      const without = prev.filter(x => x !== t.diets[0]);
      return without.includes(d) ? without.filter(x => x !== d) : [...without, d];
    });
  };

  const getFromString = () => {
    const countryData = GEO_DATA.countries[continent]?.find(c => c.id === country);
    return `${countryData?.label[lang] || country} — ${city}`;
  };

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, group, budget, interests, from: getFromString(), locale, diet, pace }),
      });
      const data = await res.json();
      if (data.plan) { setPlan(data.plan); setStep(7); setTimeout(() => setPlanEnabled(true), 100); }
      else { setError(lang === "ru" ? "Ошибка генерации. Попробуй ещё раз." : lang === "tr" ? "Oluşturma hatası. Tekrar deneyin." : "Generation error. Please try again."); }
    } catch {
      setError(lang === "ru" ? "Ошибка сети. Попробуй ещё раз." : lang === "tr" ? "Ağ hatası. Tekrar deneyin." : "Network error. Please try again.");
    }
    setLoading(false);
  };

  const resetAll = () => {
    setStep(0); setPlan(null); setPlanEnabled(false); setDays(""); setGroup(""); setBudget("");
    setInterests([]); setDiet([]); setPace(""); setContinent(""); setCountry(""); setCity("");
  };

  const downloadPdf = () => {
    if (!plan) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const dayRows = plan.days.map(day => `
      <div class="day">
        <div class="day-header">День ${day.day}: ${day.title}</div>
        <div class="time-block">
          <div class="time-label">🌅 ${t.morning}</div>
          <div class="activity">${day.morning.activity}</div>
          <div class="desc">${day.morning.description}</div>
          ${day.morning.tip ? `<div class="tip">💡 ${day.morning.tip}</div>` : ""}
        </div>
        <div class="time-block">
          <div class="time-label">☀️ ${t.afternoon}</div>
          <div class="activity">${day.afternoon.activity}</div>
          <div class="desc">${day.afternoon.description}</div>
          ${day.afternoon.tip ? `<div class="tip">💡 ${day.afternoon.tip}</div>` : ""}
        </div>
        <div class="time-block">
          <div class="time-label">🌙 ${t.evening}</div>
          <div class="activity">${day.evening.activity}</div>
          <div class="desc">${day.evening.description}</div>
          ${day.evening.tip ? `<div class="tip">💡 ${day.evening.tip}</div>` : ""}
        </div>
        ${day.hotel?.name ? `<div class="hotel">🏨 ${day.hotel.name}</div>` : ""}
      </div>
    `).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${plan.plan_title}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Georgia, serif; color: #1a1a1a; background: white; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #0a7070; padding-bottom: 24px; margin-bottom: 32px; }
          .logo { font-size: 13px; color: #0a7070; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
          h1 { font-size: 28px; font-weight: 400; color: #1a1a1a; margin-bottom: 8px; }
          .budget { font-size: 16px; color: #0a7070; font-family: sans-serif; }
          .day { margin-bottom: 32px; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; }
          .day-header { background: #0a7070; color: white; padding: 12px 20px; font-size: 16px; font-weight: 500; font-family: sans-serif; }
          .time-block { padding: 14px 20px; border-bottom: 1px solid #f0f0f0; }
          .time-block:last-of-type { border-bottom: none; }
          .time-label { font-size: 11px; color: #0a7070; font-family: sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
          .activity { font-size: 15px; font-weight: 600; color: #1a1a1a; font-family: sans-serif; margin-bottom: 4px; }
          .desc { font-size: 13px; color: #555; line-height: 1.6; margin-bottom: 4px; font-family: sans-serif; }
          .tip { font-size: 12px; color: #888; font-style: italic; font-family: sans-serif; }
          .hotel { padding: 10px 20px; background: #f8fffe; border-top: 1px solid #e5f7f5; font-size: 13px; color: #0a7070; font-family: sans-serif; }
          .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999; font-family: sans-serif; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Caspian Routes · AI Travel Planner</div>
          <h1>${plan.plan_title}</h1>
          <div class="budget">${plan.total_budget_estimate}</div>
        </div>
        ${dayRows}
        <div class="footer">
          Создано на caspian-routes.com · ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const cardStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "24px 28px", marginBottom: 24 };
  const backBtnStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif", padding: "6px 12px", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 6 };
  const labelStyle = { color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 16, fontFamily: "DM Sans, sans-serif", display: "block" };

  const TOTAL_STEPS = 7;

  return (
    <main style={{ background: "#0D1116", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
  {(step < TOTAL_STEPS || loading) && (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {bgPhotos.map((photo, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
         opacity: i === bgIndex ? 0.18 : 0,
transition: "opacity 2s ease",
filter: "blur(1px) saturate(1.3)",
        }} />
      ))}
    </div>
  )}
      <Navbar locale={locale} />
      <style>{`
        .planner-btn { padding: 12px 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.8); cursor: pointer; font-family: DM Sans, sans-serif; font-size: 14px; font-weight: 400; transition: all 0.2s ease; }
        .planner-btn:hover { border-color: rgba(45,212,191,0.5); background: rgba(45,212,191,0.08); color: white; transform: translateY(-1px); }
        .planner-btn.selected { border: 2px solid #2DD4BF; background: rgba(45,212,191,0.15); color: #2DD4BF; font-weight: 500; }
        .pace-btn { padding: 16px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.8); cursor: pointer; font-family: DM Sans, sans-serif; text-align: left; width: 100%; transition: all 0.2s ease; margin-bottom: 10px; }
        .pace-btn:hover { border-color: rgba(45,212,191,0.5); background: rgba(45,212,191,0.06); }
        .pace-btn.selected { border: 2px solid #2DD4BF; background: rgba(45,212,191,0.12); }
        .generate-btn { padding: 14px 32px; border-radius: 10px; background: linear-gradient(135deg, #0a7070, #0d9090); color: white; border: none; cursor: pointer; font-family: DM Sans, sans-serif; font-size: 15px; font-weight: 600; transition: all 0.25s ease; box-shadow: 0 4px 16px rgba(10,112,112,0.3); }
        .generate-btn:hover:not(:disabled) { background: linear-gradient(135deg, #0d9090, #2DD4BF); box-shadow: 0 8px 28px rgba(10,112,112,0.5); transform: translateY(-2px); }
        .generate-btn:disabled { background: rgba(255,255,255,0.1); box-shadow: none; cursor: not-allowed; }
        .next-btn { padding: 12px 28px; border-radius: 10px; background: #0a7070; color: white; border: none; cursor: pointer; font-family: DM Sans, sans-serif; font-size: 15px; font-weight: 500; transition: all 0.2s ease; margin-right: 10px; }
        .next-btn:hover:not(:disabled) { background: #0d9090; transform: translateY(-1px); }
        .next-btn:disabled { background: rgba(255,255,255,0.1); cursor: not-allowed; }
        .skip-btn { padding: 12px 20px; border-radius: 10px; background: transparent; color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-family: DM Sans, sans-serif; font-size: 14px; transition: all 0.2s ease; }
        .skip-btn:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.2); }
        .partner-btn-teal { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; background: rgba(45,212,191,0.1); border: 1px solid rgba(45,212,191,0.3); border-radius: 8px; color: #2DD4BF; text-decoration: none; font-size: 13px; font-family: DM Sans, sans-serif; transition: all 0.2s ease; }
        .partner-btn-teal:hover { background: rgba(45,212,191,0.2); border-color: rgba(45,212,191,0.6); transform: translateY(-1px); }
        .partner-btn-gold { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); border-radius: 8px; color: #c9a84c; text-decoration: none; font-size: 13px; font-family: DM Sans, sans-serif; transition: all 0.2s ease; }
        .partner-btn-gold:hover { background: rgba(201,168,76,0.2); border-color: rgba(201,168,76,0.6); transform: translateY(-1px); }
        .restart-btn { padding: 12px 28px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: white; cursor: pointer; font-family: DM Sans, sans-serif; font-size: 14px; transition: all 0.2s ease; margin-right: 12px; }
        .restart-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }
        .pdf-btn { padding: 12px 28px; border-radius: 10px; background: linear-gradient(135deg, #0a7070, #0d9090); border: none; color: white; cursor: pointer; font-family: DM Sans, sans-serif; font-size: 14px; font-weight: 500; transition: all 0.25s ease; box-shadow: 0 4px 16px rgba(10,112,112,0.3); }
        .pdf-btn:hover { background: linear-gradient(135deg, #0d9090, #2DD4BF); box-shadow: 0 8px 28px rgba(10,112,112,0.5); transform: translateY(-2px); }
        @media (max-width: 767px) { .planner-btn { padding: 10px 16px; font-size: 13px; } .generate-btn { width: 100%; } .next-btn { width: 100%; margin-right: 0; margin-bottom: 10px; } .skip-btn { width: 100%; } }
      @media (max-width: 640px) { .day-cards-grid { grid-template-columns: 1fr !important; } }`}</style>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "100px 24px 80px" }}>

        {loading && <LoadingScreen steps={t.loadingSteps} />}

        {!loading && step < TOTAL_STEPS && (
          <>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 12, textAlign: "center" }}>{t.title}</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, textAlign: "center", marginBottom: 48 }}>{t.subtitle}</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= step ? "#2DD4BF" : "rgba(255,255,255,0.1)", transition: "background 0.3s ease" }} />
              ))}
            </div>

            {/* Step 0: Days */}
            {step === 0 && (
              <div style={cardStyle}>
                
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step1}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {t.days.map(d => (
                    <button key={d} className={`planner-btn${days === d ? " selected" : ""}`} onClick={() => { setDays(d); setStep(1); }}>{d}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Group */}
            {step === 1 && (
              <div style={cardStyle}>
                <button style={backBtnStyle} onClick={() => setStep(0)}>{t.back}</button>
                <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step2}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {t.groups.map(g => (
                    <button key={g} className={`planner-btn${group === g ? " selected" : ""}`} onClick={() => { setGroup(g); setStep(2); }}>{g}</button>
                  ))}
                </div>
              </div>
            )}

           {/* Step 2: Location */}
{step === 2 && (
  <div style={cardStyle}>
    <button style={backBtnStyle} onClick={() => setStep(0)}>{t.back}</button>
    <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step7}</h2>

    {!continent && (
      <>
        <span style={labelStyle}>{t.selectRegion}</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {GEO_DATA.continents.map(c => (
            <button key={c.id} className="planner-btn" onClick={() => setContinent(c.id)}>{c.label[lang]}</button>
          ))}
        </div>
      </>
    )}

   {continent && !country && (
  <>
    <button style={backBtnStyle} onClick={() => setContinent("")}>{t.back}</button>
    <span style={labelStyle}>{t.selectCountry}</span>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {GEO_DATA.countries[continent].map(c => (
        <button key={c.id} className="planner-btn" onClick={() => setCountry(c.id)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!["asia_other", "eu_other", "am_other", "other"].includes(c.id)
            ? <img src={`https://flagcdn.com/w20/${c.id}.png`} width={20} height={15} alt={c.id} style={{ borderRadius: 2 }} />
            : <span>{c.flag}</span>
          }
          {c.label[lang]}
        </button>
      ))}
    </div>
    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
      <input
        type="text"
        placeholder={lang === "ru" ? "Или введи свою страну..." : lang === "az" ? "Və ya öz ölkənizi yazın..." : lang === "tr" ? "Ya da ülkenizi yazın..." : "Or type your country..."}
        onKeyDown={(e) => { if (e.key === "Enter" && e.currentTarget.value.trim()) setCountry(e.currentTarget.value.trim()); }}
        style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none" }}
      />
      <button
        onClick={(e) => { const input = (e.currentTarget as HTMLButtonElement).previousSibling as HTMLInputElement; if (input.value.trim()) setCountry(input.value.trim()); }}
        className="next-btn" style={{ padding: "10px 16px" }}>→</button>
    </div>
  </>
)}

    {continent && country && !city && (
  <>
    <button style={backBtnStyle} onClick={() => setCountry("")}>{t.back}</button>
    <span style={labelStyle}>{t.selectCity}</span>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {(GEO_DATA.cities[country] ? (GEO_DATA.cities[country][lang] || GEO_DATA.cities[country]["en"]) : []).map(c => (
        <button key={c} className={`planner-btn${city === c ? " selected" : ""}`} onClick={() => setCity(c)}>{c}</button>
      ))}
    </div>
    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
      <input
        type="text"
        placeholder={lang === "ru" ? "Или введи свой город..." : lang === "az" ? "Və ya şəhərinizi yazın..." : lang === "tr" ? "Ya da şehrinizi yazın..." : "Or type your city..."}
        onKeyDown={(e) => { if (e.key === "Enter" && e.currentTarget.value.trim()) setCity(e.currentTarget.value.trim()); }}
        style={{ flex: 1, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif", outline: "none" }}
      />
      <button
        onClick={(e) => { const input = (e.currentTarget as HTMLButtonElement).previousSibling as HTMLInputElement; if (input.value.trim()) setCity(input.value.trim()); }}
        className="next-btn" style={{ padding: "10px 16px" }}>→</button>
    </div>
  </>
)}

    {continent && country && city && (
      <>
        <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif" }}>{getFromString()}</span>
          <button onClick={() => setCity("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>{t.change}</button>
        </div>
        <button className="next-btn" onClick={() => setStep(3)}>{t.next}</button>
      </>
    )}
  </div>
)}

{/* Step 3: Budget */}
{step === 3 && (
  <div style={cardStyle}>
    <button style={backBtnStyle} onClick={() => setStep(0)}>{t.back}</button>
    <button style={backBtnStyle} onClick={() => setStep(0)}>{t.back}</button>
    <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step3}</h2>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {currentBudgets.ranges.map(b => (
        <button key={b} className={`planner-btn${budget === b ? " selected" : ""}`} onClick={() => { setBudget(b); setStep(4); }}>{b}</button>
      ))}
    </div>
  </div>
)}

{/* Step 4: Interests */}
{step === 4 && (
  <div style={cardStyle}>
    <button style={backBtnStyle} onClick={() => setStep(0)}>{t.back}</button>
    <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step4}</h2>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
      {t.interests.map(i => (
        <button key={i} className={`planner-btn${interests.includes(i) ? " selected" : ""}`} onClick={() => toggleInterest(i)}>{i}</button>
      ))}
    </div>
    <button className="next-btn" onClick={() => setStep(5)} disabled={interests.length === 0}>{t.next}</button>
  </div>
)}

{/* Step 5: Diet */}
{step === 5 && (
  <div style={cardStyle}>
    <button style={backBtnStyle} onClick={() => setStep(0)}>{t.back}</button>
    <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 8, fontFamily: "DM Sans, sans-serif" }}>{t.step5}</h2>
    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>
      {lang === "ru" ? "Можно выбрать несколько" : lang === "az" ? "Bir neçə seçə bilərsiniz" : lang === "tr" ? "Birden fazla seçebilirsiniz" : "You can select multiple"}
    </p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
      {t.diets.map(d => (
        <button key={d} className={`planner-btn${diet.includes(d) ? " selected" : ""}`} onClick={() => toggleDiet(d)}>{d}</button>
      ))}
    </div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <button className="next-btn" onClick={() => setStep(6)} disabled={diet.length === 0}>{t.next}</button>
      <button className="skip-btn" onClick={() => { setDiet([t.diets[0]]); setStep(6); }}>{t.skip}</button>
    </div>
  </div>
)}

{/* Step 6: Pace */}
{step === 6 && (
  <div style={cardStyle}>
    <button style={backBtnStyle} onClick={() => setStep(0)}>{t.back}</button>
    <h2 style={{ color: "white", fontSize: 20, fontWeight: 500, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>{t.step6}</h2>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
      {t.paces.map(p => (
  <button key={p.id} className={`pace-btn${pace === p.label ? " selected" : ""}`} onClick={() => setPace(p.label)}>
    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{p.label}</div>
    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{p.desc}</div>
  </button>
))}
    </div>
   {pace && (
  <button className="generate-btn" onClick={async () => {
    setLoading(true);
setError("");
;
    setPlanEnabled(false);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, group, budget, interests, from: getFromString(), locale, diet, pace }),
      });
      const data = await res.json();
      if (data.plan) { setPlan(data.plan); setStep(7); setTimeout(() => setPlanEnabled(true), 100); }
      else { setError(lang === "ru" ? "Ошибка генерации. Попробуй ещё раз." : "Generation error. Please try again."); }
    } catch {
      setError(lang === "ru" ? "Ошибка сети. Попробуй ещё раз." : "Network error. Please try again.");
    }
    setLoading(false);
  }} style={{ marginTop: 16 }}>{t.generate}</button>
)}
  </div>
)}
          </>
        )}
        {/* Результат */}
{!loading && step === TOTAL_STEPS && plan && (
  <div ref={planRef}>

   {/* Hero */}
<div style={{ textAlign: "center", marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid rgba(45,212,191,0.15)", position: "relative", overflow: "hidden", borderRadius: 24, padding: "60px 32px 40px" }}>
  {/* Ambient glow */}
  <div style={{ position: "absolute", top: -60, left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
  <div style={{ position: "absolute", top: -40, right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(10,112,112,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
  <div style={{ position: "absolute", bottom: -60, left: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

  {/* BG photo */}
  <div style={{ position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden", zIndex: 0 }}>
    <img
      src="https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=1200"
      alt="Baku"
      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.12, filter: "blur(2px) saturate(1.5)", transform: "scale(1.05)" }}
    />
  </div>

  <div style={{ position: "relative", zIndex: 1 }}>
    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(45,212,191,0.15)", border: "1px solid rgba(45,212,191,0.3)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: 24 }}>🗺️</div>
    <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>{plan.plan_title}</h1>
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 99, padding: "8px 20px", backdropFilter: "blur(8px)" }}>
      <span style={{ fontSize: 14 }}>💰</span>
      <span style={{ color: "white", fontSize: 14, fontFamily: "DM Sans, sans-serif" }}>{plan.total_budget_estimate}</span>
    </div>
  </div>
</div>

    {plan.days.map((day) => (
      <DaySection key={day.day} day={day} t={t} lang={lang} planEnabled={planEnabled} />
    ))}

    {/* Авиа и авто */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
      {plan.flights && (
        <div style={{ background: "#18181b", borderRadius: 16, padding: "24px" }}>
          <p style={{ color: "#2DD4BF", fontSize: 10, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.4em", marginBottom: 12, fontFamily: "DM Sans, sans-serif" }}>✈️ {t.flights}</p>
          <p style={{ color: "#9f9fa9", fontSize: 14, lineHeight: 1.7, marginBottom: 16, fontFamily: "DM Sans, sans-serif" }}>{plan.flights.tip}</p>
          <a href={plan.flights.url} target="_blank" rel="noopener noreferrer" className="partner-btn-teal">{t.bookFlight}</a>
        </div>
      )}
      {plan.car_rental && (
        <div style={{ background: "#18181b", borderRadius: 16, padding: "24px" }}>
          <p style={{ color: "#c9a84c", fontSize: 10, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.4em", marginBottom: 12, fontFamily: "DM Sans, sans-serif" }}>🚗 {t.carRental}</p>
          <p style={{ color: "#9f9fa9", fontSize: 14, lineHeight: 1.7, marginBottom: 16, fontFamily: "DM Sans, sans-serif" }}>{plan.car_rental.tip}</p>
          <a href={plan.car_rental.url} target="_blank" rel="noopener noreferrer" className="partner-btn-gold">{t.bookCar}</a>
        </div>
      )}
    </div>

            {/* Кнопки */}
            <div style={{ textAlign: "center", paddingTop: 16 }}>
              <button className="restart-btn" onClick={resetAll}>{t.restart}</button>
              <button className="pdf-btn" onClick={downloadPdf}>📄 {t.downloadPdf}</button>
            </div>
          </div>
        )}
      </div>
      <Footer locale={locale} />
    </main>
  );
}