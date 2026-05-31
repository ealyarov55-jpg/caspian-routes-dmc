"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const T = {
  bg: "#06090f",
  bgCard: "rgba(255,255,255,0.03)",
  bgCardHover: "rgba(255,255,255,0.06)",
  sidebar: "#080e18",
  accent: "#00d4aa",
  accentDim: "rgba(0,212,170,0.5)",
  accentGlow: "rgba(0,212,170,0.08)",
  accentBorder: "rgba(0,212,170,0.15)",
  text: "#e8edf5",
  textSoft: "#94a3b8",
  textMuted: "#475569",
  border: "rgba(255,255,255,0.06)",
  font: "'DM Sans', system-ui, sans-serif",
  fontDisplay: "'Syne', 'DM Sans', system-ui, sans-serif",
};

const DAY_COLORS = ["#00d4aa", "#a78bfa", "#f59e0b", "#3b82f6", "#ec4899", "#10b981", "#f97316"];

type Prefs = {
  duration: string | null;
  group: string | null;
  budget: string | null;
  interests: string[];
  pace: string | null;
};

type Message = { role: "ai" | "user"; text: string };
type ActiveOptions = "duration" | "group" | "budget" | "interests" | "pace" | "post" | null;

type Stop = {
  activity: string;
  description: string;
  tip: string;
  curator_note?: string;
};

type PlanDay = {
  day: number;
  title: string;
  morning: Stop;
  afternoon: Stop;
  evening: Stop;
  excursion?: { name: string; url: string };
};

type Plan = {
  plan_title: string;
  total_budget_estimate: string;
  days: PlanDay[];
  curated_stays?: Array<{ name: string; description: string; booking_url: string }>;
  logistics?: { title: string; content: string };
  flights?: { tip: string; url: string };
  car_rental?: { tip: string; url: string };
};

type GeoStop = {
  time: string;
  label: string;
  activity: string;
  description: string;
  tip: string;
  lat: number;
  lng: number;
};

type GeoDay = {
  day: number;
  title: string;
  color: string;
  stops: GeoStop[];
};

const OPTIONS = {
  duration: [
    { icon: "🌸", label: "1–3 дня", value: "3" },
    { icon: "🏖", label: "4–5 дней", value: "5" },
    { icon: "✈️", label: "6–7 дней", value: "7" },
    { icon: "🌍", label: "8+ дней", value: "10+" },
  ],
  group: [
    { icon: "🙋", label: "Один / одна", value: "Один" },
    { icon: "💑", label: "Пара", value: "Пара" },
    { icon: "👨‍👩‍👧‍👦", label: "С детьми", value: "С детьми" },
    { icon: "👫", label: "Друзья", value: "Друзья" },
  ],
  budget: [
    { icon: "💚", label: "Эконом", value: "$300-500" },
    { icon: "💛", label: "Комфорт", value: "$500-1000" },
    { icon: "🧡", label: "Бизнес", value: "$1000-2000" },
    { icon: "❤️", label: "Люкс", value: "$2000+" },
  ],
  pace: [
    { icon: "🧘", label: "Расслабленный", value: "Расслабленный" },
    { icon: "⚡", label: "Насыщенный", value: "Насыщенный" },
    { icon: "⚖️", label: "Сбалансированный", value: "Сбалансированный" },
  ],
  post: [
    { icon: "✏️", label: "Изменить маршрут", value: "Изменить маршрут" },
    { icon: "💰", label: "Сделать дешевле", value: "Сделать дешевле" },
    { icon: "🏨", label: "Посоветуй отели", value: "Посоветуй отели" },
    { icon: "🍽", label: "Рестораны на маршруте", value: "Рестораны на маршруте" },
    { icon: "🚕", label: "Как добраться", value: "Как добраться" },
    { icon: "📋", label: "Новый маршрут", value: "Новый маршрут" },
  ],
};

const INTERESTS_OPTIONS = [
  { icon: "🏛", label: "История и архитектура" },
  { icon: "🌿", label: "Природа и горы" },
  { icon: "🍽", label: "Гастрономия" },
  { icon: "🏖", label: "Пляж и море" },
  { icon: "🎨", label: "Искусство и культура" },
  { icon: "🧘", label: "Спа и отдых" },
  { icon: "🏄", label: "Активный отдых" },
  { icon: "🛍", label: "Шопинг" },
];
const getTexts = (locale: string) => {
  const isRu = locale === "ru";
  const isAz = locale === "az";
  const isTr = locale === "tr";
  return {
    greeting: isRu ? "Привет! Я помогу составить маршрут по Азербайджану специально под вас.\n\nПодготовлю персональный итинерарий за 5 вопросов — займёт меньше минуты. 🗺" : isAz ? "Salam! Azərbaycan üçün xüsusi marşrut hazırlamağa kömək edəcəyəm.\n\n5 sual ərzində fərdi itinerariy hazırlayacağam — bir dəqiqədən az çəkəcək. 🗺" : isTr ? "Merhaba! Azerbaycan için size özel bir rota oluşturmama yardımcı olacağım.\n\n5 soruda kişisel bir güzergah hazırlayacağım — bir dakikadan az sürer. 🗺" : "Hello! I'll help you plan a trip to Azerbaijan tailored just for you.\n\nI'll prepare a personal itinerary in 5 questions — takes less than a minute. 🗺",
    q_duration: isRu ? "Когда планируете поехать и на сколько дней?" : isAz ? "Nə vaxt getməyi planlaşdırırsınız və neçə gün?" : isTr ? "Ne zaman gitmeyi planlıyorsunuz ve kaç gün?" : "When are you planning to go and for how many days?",
    q_group: isRu ? "С кем едете?" : isAz ? "Kiminlə gedirsiniz?" : isTr ? "Kiminle gidiyorsunuz?" : "Who are you traveling with?",
    q_budget: isRu ? "Какой примерный бюджет на человека?" : isAz ? "Bir nəfər üçün təxmini büdcə nə qədərdir?" : isTr ? "Kişi başına tahmini bütçeniz nedir?" : "What is your approximate budget per person?",
    q_interests: isRu ? "Что вас привлекает в Азербайджане? Выберите всё что нравится:" : isAz ? "Azərbaycanda sizi nə cəlb edir? Bütün bəyəndiklərinizi seçin:" : isTr ? "Azerbaycan'da sizi ne çekiyor? Beğendiklerinizi seçin:" : "What interests you in Azerbaijan? Select all that apply:",
    q_pace: isRu ? "Последний вопрос — какой темп вам ближе?" : isAz ? "Son sual — hansı temp sizə daha yaxındır?" : isTr ? "Son soru — hangi tempo size daha yakın?" : "Last question — what pace suits you best?",
    generating: isRu ? "Отлично! У меня всё есть. Составляю персональный маршрут... ✨" : isAz ? "Əla! Hər şeyim var. Fərdi marşrut hazırlayıram... ✨" : isTr ? "Harika! Her şeyim var. Kişisel rota hazırlıyorum... ✨" : "Great! I have everything. Building your personal itinerary... ✨",
    ready: isRu ? "Маршрут готов! 🎉 Открываю интерактивный вид с картой..." : isAz ? "Marşrut hazırdır! 🎉 Xəritə ilə interaktiv görünüş açıram..." : isTr ? "Rota hazır! 🎉 Haritayla interaktif görünümü açıyorum..." : "Itinerary ready! 🎉 Opening interactive view with map...",
    error: isRu ? "Ошибка генерации. Попробуйте ещё раз." : isAz ? "Xəta baş verdi. Yenidən cəhd edin." : isTr ? "Oluşturma hatası. Lütfen tekrar deneyin." : "Generation error. Please try again.",
    network_error: isRu ? "Ошибка сети. Проверьте подключение." : isAz ? "Şəbəkə xətası. Bağlantını yoxlayın." : isTr ? "Ağ hatası. Bağlantınızı kontrol edin." : "Network error. Please check your connection.",
    done_btn: isRu ? "✓ Готово" : isAz ? "✓ Hazır" : isTr ? "✓ Tamam" : "✓ Done",
    placeholder: isRu ? "Напишите или выберите вариант выше..." : isAz ? "Yazın və ya yuxarıdan variant seçin..." : isTr ? "Yazın veya yukarıdan seçin..." : "Type or choose an option above...",
    ai_active: isRu ? "ИИ активен" : isAz ? "AI aktivdir" : isTr ? "AI aktif" : "AI active",
    planner_title: isRu ? "планер" : isAz ? "planlayıcı" : isTr ? "planlayıcı" : "planner",
    your_route: isRu ? "✦ Ваш маршрут" : isAz ? "✦ Marşrutunuz" : isTr ? "✦ Rotanız" : "✦ Your itinerary",
    hotels: isRu ? "🏨 Рекомендуемые отели" : isAz ? "🏨 Tövsiyə olunan otellər" : isTr ? "🏨 Önerilen oteller" : "🏨 Recommended hotels",
    find_room: isRu ? "Найти номер →" : isAz ? "Otaq tap →" : isTr ? "Oda bul →" : "Find room →",
    tickets: isRu ? "✈️ Билеты" : isAz ? "✈️ Biletlər" : isTr ? "✈️ Biletler" : "✈️ Tickets",
    find: isRu ? "Найти →" : isAz ? "Tap →" : isTr ? "Bul →" : "Find →",
    car: isRu ? "🚗 Авто" : isAz ? "🚗 Avtomobil" : isTr ? "🚗 Araba" : "🚗 Car",
    book_excursion: isRu ? "Забронировать экскурсию →" : isAz ? "Ekskursiya rezerv et →" : isTr ? "Tur rezerv et →" : "Book excursion →",
    morning: isRu ? "🌅 Утро" : isAz ? "🌅 Səhər" : isTr ? "🌅 Sabah" : "🌅 Morning",
    afternoon: isRu ? "☀️ День" : isAz ? "☀️ Gündüz" : isTr ? "☀️ Öğle" : "☀️ Afternoon",
    evening: isRu ? "🌙 Вечер" : isAz ? "🌙 Axşam" : isTr ? "🌙 Akşam" : "🌙 Evening",
    day: isRu ? "День" : isAz ? "Gün" : isTr ? "Gün" : "Day",
    chat_btn: isRu ? "💬 Чат" : isAz ? "💬 Söhbət" : isTr ? "💬 Sohbet" : "💬 Chat",
    open_route: isRu ? "🗺 Открыть маршрут" : isAz ? "🗺 Marşrutu aç" : isTr ? "🗺 Rotayı aç" : "🗺 Open itinerary",
    route_btn: isRu ? "🗺 Маршрут" : isAz ? "🗺 Marşrut" : isTr ? "🗺 Rota" : "🗺 Itinerary",
    loading_map: isRu ? "Загружаем..." : isAz ? "Yüklənir..." : isTr ? "Yükleniyor..." : "Loading...",
    map_unavailable: isRu ? "Карта недоступна" : isAz ? "Xəritə əlçatmazdır" : isTr ? "Harita mevcut değil" : "Map unavailable",
    profile: isRu ? "Профиль поездки" : isAz ? "Səyahət profili" : isTr ? "Seyahat profili" : "Trip profile",
    duration_label: isRu ? "Длительность" : isAz ? "Müddət" : isTr ? "Süre" : "Duration",
    group_label: isRu ? "Состав" : isAz ? "Tərkib" : isTr ? "Grup" : "Group",
    budget_label: isRu ? "Бюджет" : isAz ? "Büdcə" : isTr ? "Bütçe" : "Budget",
    interests_label: isRu ? "Интересы" : isAz ? "Maraqlar" : isTr ? "İlgi alanları" : "Interests",
    pace_label: isRu ? "Темп" : isAz ? "Temp" : isTr ? "Tempo" : "Pace",
    not_specified: isRu ? "Не указано" : isAz ? "Göstərilməyib" : isTr ? "Belirtilmemiş" : "Not specified",
    days_suffix: isRu ? " дней" : isAz ? " gün" : isTr ? " gün" : " days",
    ai_route: isRu ? "AI маршрут" : isAz ? "AI marşrut" : isTr ? "AI rota" : "AI itinerary",
    select_above: isRu ? "Выберите вариант выше." : isAz ? "Yuxarıdan variant seçin." : isTr ? "Yukarıdan seçin." : "Please select an option above.",
  };
};

const getOptions = (locale: string) => {
  const isRu = locale === "ru";
  const isAz = locale === "az";
  const isTr = locale === "tr";
  return {
    duration: [
      { icon: "🌸", label: isRu ? "1–3 дня" : isAz ? "1–3 gün" : isTr ? "1–3 gün" : "1–3 days", value: "3" },
      { icon: "🏖", label: isRu ? "4–5 дней" : isAz ? "4–5 gün" : isTr ? "4–5 gün" : "4–5 days", value: "5" },
      { icon: "✈️", label: isRu ? "6–7 дней" : isAz ? "6–7 gün" : isTr ? "6–7 gün" : "6–7 days", value: "7" },
      { icon: "🌍", label: isRu ? "8+ дней" : isAz ? "8+ gün" : isTr ? "8+ gün" : "8+ days", value: "10+" },
    ],
    group: [
      { icon: "🙋", label: isRu ? "Один / одна" : isAz ? "Tək" : isTr ? "Yalnız" : "Solo", value: isRu ? "Один" : isAz ? "Tək" : isTr ? "Yalnız" : "Solo" },
      { icon: "💑", label: isRu ? "Пара" : isAz ? "Cütlük" : isTr ? "Çift" : "Couple", value: isRu ? "Пара" : isAz ? "Cütlük" : isTr ? "Çift" : "Couple" },
      { icon: "👨‍👩‍👧‍👦", label: isRu ? "С детьми" : isAz ? "Uşaqlarla" : isTr ? "Çocuklarla" : "Family", value: isRu ? "С детьми" : isAz ? "Uşaqlarla" : isTr ? "Çocuklarla" : "Family" },
      { icon: "👫", label: isRu ? "Друзья" : isAz ? "Dostlar" : isTr ? "Arkadaşlar" : "Friends", value: isRu ? "Друзья" : isAz ? "Dostlar" : isTr ? "Arkadaşlar" : "Friends" },
    ],
    budget: [
      { icon: "💚", label: isRu ? "Эконом" : isAz ? "Ekonom" : isTr ? "Ekonomi" : "Economy", value: "$300-500" },
      { icon: "💛", label: isRu ? "Комфорт" : isAz ? "Komfort" : isTr ? "Konfor" : "Comfort", value: "$500-1000" },
      { icon: "🧡", label: isRu ? "Бизнес" : isAz ? "Biznes" : isTr ? "Business" : "Business", value: "$1000-2000" },
      { icon: "❤️", label: isRu ? "Люкс" : isAz ? "Lüks" : isTr ? "Lüks" : "Luxury", value: "$2000+" },
    ],
    pace: [
      { icon: "🧘", label: isRu ? "Расслабленный" : isAz ? "Rahat" : isTr ? "Rahat" : "Relaxed", value: isRu ? "Расслабленный" : isAz ? "Rahat" : isTr ? "Rahat" : "Relaxed" },
      { icon: "⚡", label: isRu ? "Насыщенный" : isAz ? "Sıx" : isTr ? "Yoğun" : "Intensive", value: isRu ? "Насыщенный" : isAz ? "Sıx" : isTr ? "Yoğun" : "Intensive" },
      { icon: "⚖️", label: isRu ? "Сбалансированный" : isAz ? "Balanslaşdırılmış" : isTr ? "Dengeli" : "Balanced", value: isRu ? "Сбалансированный" : isAz ? "Balanslaşdırılmış" : isTr ? "Dengeli" : "Balanced" },
    ],
    post: [
      { icon: "✏️", label: isRu ? "Изменить маршрут" : isAz ? "Marşrutu dəyiş" : isTr ? "Rotayı değiştir" : "Edit itinerary", value: isRu ? "Изменить маршрут" : isAz ? "Marşrutu dəyiş" : isTr ? "Rotayı değiştir" : "Edit itinerary" },
      { icon: "💰", label: isRu ? "Сделать дешевле" : isAz ? "Daha ucuz et" : isTr ? "Daha ucuz yap" : "Make cheaper", value: isRu ? "Сделать дешевле" : isAz ? "Daha ucuz et" : isTr ? "Daha ucuz yap" : "Make cheaper" },
      { icon: "🏨", label: isRu ? "Посоветуй отели" : isAz ? "Otel tövsiyə et" : isTr ? "Otel öner" : "Recommend hotels", value: isRu ? "Посоветуй отели" : isAz ? "Otel tövsiyə et" : isTr ? "Otel öner" : "Recommend hotels" },
      { icon: "🍽", label: isRu ? "Рестораны на маршруте" : isAz ? "Marşrutdakı restoranlar" : isTr ? "Güzergahtaki restoranlar" : "Restaurants on route", value: isRu ? "Рестораны на маршруте" : isAz ? "Marşrutdakı restoranlar" : isTr ? "Güzergahtaki restoranlar" : "Restaurants on route" },
      { icon: "🚕", label: isRu ? "Как добраться" : isAz ? "Necə çatmaq olar" : isTr ? "Nasıl ulaşılır" : "How to get there", value: isRu ? "Как добраться" : isAz ? "Necə çatmaq olar" : isTr ? "Nasıl ulaşılır" : "How to get there" },
      { icon: "📋", label: isRu ? "Новый маршрут" : isAz ? "Yeni marşrut" : isTr ? "Yeni rota" : "New itinerary", value: "NEW_ROUTE" },
    ],
    interests: [
      { icon: "🏛", label: isRu ? "История и архитектура" : isAz ? "Tarix və memarlıq" : isTr ? "Tarih ve mimari" : "History & Architecture" },
      { icon: "🌿", label: isRu ? "Природа и горы" : isAz ? "Təbiət və dağlar" : isTr ? "Doğa ve dağlar" : "Nature & Mountains" },
      { icon: "🍽", label: isRu ? "Гастрономия" : isAz ? "Qastronomiya" : isTr ? "Gastronomi" : "Gastronomy" },
      { icon: "🏖", label: isRu ? "Пляж и море" : isAz ? "Çimərlik və dəniz" : isTr ? "Plaj ve deniz" : "Beach & Sea" },
      { icon: "🎨", label: isRu ? "Искусство и культура" : isAz ? "İncəsənət və mədəniyyət" : isTr ? "Sanat ve kültür" : "Art & Culture" },
      { icon: "🧘", label: isRu ? "Спа и отдых" : isAz ? "Spa və istirahət" : isTr ? "Spa ve dinlenme" : "Spa & Relaxation" },
      { icon: "🏄", label: isRu ? "Активный отдых" : isAz ? "Aktiv istirahət" : isTr ? "Aktif tatil" : "Active Recreation" },
      { icon: "🛍", label: isRu ? "Шопинг" : isAz ? "Alış-veriş" : isTr ? "Alışveriş" : "Shopping" },
    ],
  };
};

declare global {
  interface Window { google: any; initGoogleMap?: () => void; }
}
declare global {
  interface Window { google: any; initGoogleMap?: () => void; }
}

// ── MAP COMPONENT ──────────────────────────────────────────────────────
function ItineraryMap({ geoDays, activeDay, onMarkerClick }: {
  geoDays: GeoDay[];
  activeDay: number;
  onMarkerClick: (day: number, stopIdx: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!apiKey) return;

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
  center: { lat: 40.4, lng: 47.5 },
  zoom: 7,
  mapTypeId: "roadmap",
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: "greedy",
  styles: [
    { elementType: "geometry", stylers: [{ color: "#07111e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#07111e" }] },
    { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#334155" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0d1f2d" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e3a4a" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1e4060" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#051525" }] },
  ],
});

      mapInstanceRef.current = map;
      drawMarkersAndRoutes(map);
    };

    if (window.google?.maps) { initMap(); return; }
    window.initGoogleMap = initMap;
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) drawMarkersAndRoutes(mapInstanceRef.current);
  }, [geoDays, activeDay]);

  const drawMarkersAndRoutes = (map: any) => {
    markersRef.current.forEach(m => m.setMap(null));
    polylinesRef.current.forEach(p => p.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    const activeBounds = new window.google.maps.LatLngBounds();

    geoDays.forEach(gday => {
      const isActive = gday.day === activeDay;
      const opacity = isActive ? 1 : 0.25;

      // Route line
      if (gday.stops.length > 1) {
        const path = gday.stops.map(s => ({ lat: s.lat, lng: s.lng }));
        const poly = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: gday.color,
          strokeOpacity: isActive ? 0.8 : 0.2,
          strokeWeight: isActive ? 2.5 : 1,
          map,
        });
        polylinesRef.current.push(poly);
      }

      // Markers
      gday.stops.forEach((stop, i) => {
        const svg = `
          <svg width="${isActive ? 36 : 26}" height="${isActive ? 36 : 26}" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="14" fill="${gday.color}" opacity="${opacity}" stroke="white" stroke-width="2"/>
            <text x="18" y="22" text-anchor="middle" font-size="11" font-weight="700" fill="white" font-family="DM Sans">${i + 1}</text>
          </svg>`;

        const marker = new window.google.maps.Marker({
          position: { lat: stop.lat, lng: stop.lng },
          map,
          title: stop.activity,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
            scaledSize: new window.google.maps.Size(isActive ? 36 : 26, isActive ? 36 : 26),
            anchor: new window.google.maps.Point(isActive ? 18 : 13, isActive ? 18 : 13),
          },
        });

        marker.addListener("click", () => onMarkerClick(gday.day, i));
        markersRef.current.push(marker);

        if (isActive) activeBounds.extend({ lat: stop.lat, lng: stop.lng });
      });
    });

    if (activeDay && !activeBounds.isEmpty()) {
      map.fitBounds(activeBounds, { top: 60, right: 60, bottom: 60, left: 60 });
    }
  };

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
function GeneratingOverlay({ locale }: { locale: string }) {
  const [factIdx, setFactIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const facts = locale === "ru" ? [
    "🏛 Баку — один из немногих городов мира, где средневековая крепость соседствует с небоскрёбами",
    "🌋 В Азербайджане находится более 400 грязевых вулканов — треть всех в мире",
    "🔥 Азербайджан означает «Страна огня» — здесь тысячи лет горит вечный огонь",
    "🍷 Азербайджан — одна из древнейших винодельческих стран мира",
    "🏔 Шахдаг — горнолыжный курорт на высоте 4243 метра над уровнем моря",
    "🌊 Каспийское море — самое большое озеро в мире по площади",
    "🕌 Ичэришехер (Старый город Баку) включён в список ЮНЕСКО",
    "🌿 Ленкорань — субтропический регион с уникальной флорой и чайными плантациями",
  ] : locale === "az" ? [
    "🏛 Bakı — orta əsr qalası ilə göydələnlərin qonşuluq etdiyi nadir şəhərlərdən biridir",
    "🌋 Azərbaycanda dünyanın üçdə birini təşkil edən 400-dən çox palçıq vulkanı var",
    "🔥 Azərbaycan — «Od Yurdu» deməkdir, burada minilliklər boyu əbədi od yanır",
    "🏔 Şahdağ — dəniz səviyyəsindən 4243 metr yüksəklikdə dağ-xizək kurortu",
    "🌊 Xəzər dənizi — sahəsinə görə dünyanın ən böyük gölüdür",
    "🕌 İçərişəhər YUNESKO-nun siyahısına daxil edilmişdir",
  ] : locale === "tr" ? [
    "🏛 Bakü — ortaçağ kalesinin gökdelenlerle komşu olduğu nadir şehirlerden biri",
    "🌋 Azerbaycan'da dünyanın üçte birini oluşturan 400'den fazla çamur yanardağı var",
    "🔥 Azerbaycan — «Ateş Ülkesi» anlamına gelir, burada binlerce yıldır ebedi ateş yanıyor",
    "🏔 Şahdağ — deniz seviyesinden 4243 metre yükseklikte kayak merkezi",
    "🌊 Hazar Denizi — yüzey alanına göre dünyanın en büyük gölü",
    "🕌 İçərişəhər UNESCO listesine dahildir",
  ] : [
    "🏛 Baku is one of the few cities where a medieval fortress stands next to skyscrapers",
    "🌋 Azerbaijan has over 400 mud volcanoes — a third of all in the world",
    "🔥 Azerbaijan means 'Land of Fire' — eternal flames have burned here for thousands of years",
    "🏔 Shahdag is a ski resort at 4,243 meters above sea level",
    "🌊 The Caspian Sea is the world's largest lake by surface area",
    "🕌 Icherisheher (Baku Old City) is a UNESCO World Heritage Site",
  ];

  useEffect(() => {
    const factTimer = setInterval(() => {
      setFactIdx(prev => (prev + 1) % facts.length);
    }, 3000);
    const progressTimer = setInterval(() => {
      setProgress(prev => prev < 90 ? prev + 1 : prev);
    }, 600);
    return () => { clearInterval(factTimer); clearInterval(progressTimer); };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(6,9,15,0.97)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, backdropFilter: "blur(8px)" }}>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes factFade { 0%{opacity:0;transform:translateY(10px)} 20%{opacity:1;transform:translateY(0)} 80%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-10px)} }
        @keyframes pulse2 { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.1)} }
      `}</style>

      {/* Logo */}
      <div style={{ marginBottom: 40, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00d4aa", boxShadow: "0 0 20px #00d4aa", animation: "pulse2 2s ease infinite" }} />
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#e8edf5", letterSpacing: -0.5 }}>
          CASPIAN<span style={{ color: "#00d4aa" }}>.</span>ROUTES
        </span>
      </div>

      {/* Spinner */}
      <div style={{ position: "relative", width: 70, height: 70, marginBottom: 24 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(0,212,170,0.1)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#00d4aa", animation: "spin 1s linear infinite" }} />
        <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "1.5px solid transparent", borderTopColor: "rgba(0,212,170,0.4)", animation: "spin 1.5s linear infinite reverse" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🗺</div>
      </div>

      {/* Title */}
      <p style={{ fontSize: 11, color: "#00d4aa", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>
        {locale === "ru" ? "AI составляет маршрут" : locale === "az" ? "AI marşrut hazırlayır" : locale === "tr" ? "AI rota hazırlıyor" : "AI building itinerary"}
      </p>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: 320, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 99, marginBottom: 40, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #00d4aa, #00b894)", borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>

      {/* Fact */}
      <div style={{ maxWidth: 340, textAlign: "center", minHeight: 72, padding: "0 16px" }}>
  <p key={factIdx} style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, animation: "factFade 3s ease", margin: 0 }}>
          {facts[factIdx]}
        </p>
      </div>

      {/* Progress % */}
      <p style={{ color: "#475569", fontSize: 11, marginTop: 20 }}>{progress}%</p>
    </div>
  );
}
// ── MAIN COMPONENT ────────────────────────────────────────────────────
export default function CaspianCommandCenter() {
  const params = useParams();
  const locale = (params?.locale as string) || "ru";
const texts = getTexts(locale);
const options = getOptions(locale);
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [prefs, setPrefs] = useState<Prefs>({ duration: null, group: null, budget: null, interests: [], pace: null });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [step, setStep] = useState(0);
  const [activeOptions, setActiveOptions] = useState<ActiveOptions>(null);

  // Plan state
  const [plan, setPlan] = useState<Plan | null>(null);
  const [geoDays, setGeoDays] = useState<GeoDay[]>([]);
  const [view, setView] = useState<"chat" | "itinerary">("chat");
  const [activeDay, setActiveDay] = useState(1);
  const [activeStopIdx, setActiveStopIdx] = useState<number | null>(null);
  const [activeSlot, setActiveSlot] = useState<"morning" | "afternoon" | "evening">("morning");
  const [geocoding, setGeocoding] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const scrollBottom = () => {
  setTimeout(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }
  }, 100);
};

  const pushAI = (text: string) => setMessages(prev => [...prev, { role: "ai", text }]);
  const pushUser = (text: string) => setMessages(prev => [...prev, { role: "user", text }]);

  const aiSay = (text: string, delay = 900, then?: () => void) => {
    setActiveOptions(null);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      pushAI(text);
      scrollBottom();
      if (then) setTimeout(() => { then(); setTimeout(scrollBottom, 150); }, 300);
    }, delay);
  };

  useEffect(() => {
  const t = getTexts(locale);
  aiSay(t.greeting, 700, () => {
    aiSay(t.q_duration, 800, () => { scrollBottom(); setActiveOptions("duration"); });
  });
}, [locale]);
  const handleOption = (value: string, label: string) => {
  if (generating) return;
  setActiveOptions(null);
  pushUser(label);
  if (step === 0) {
    const np = { ...prefs, duration: value };
    setPrefs(np); setStep(1);
    aiSay(getTexts(locale).q_group, 700, () => { scrollBottom(); setActiveOptions("group"); });
  } else if (step === 1) {
    const np = { ...prefs, group: value };
    setPrefs(np); setStep(2);
    aiSay(getTexts(locale).q_budget, 700, () => { scrollBottom(); setActiveOptions("budget"); });
  } else if (step === 2) {
    const np = { ...prefs, budget: value };
    setPrefs(np); setStep(3);
    aiSay(getTexts(locale).q_interests, 700, () => { scrollBottom(); setActiveOptions("interests"); });
  } else if (step === 4) {
    const np = { ...prefs, pace: value };
    setPrefs(np); setStep(5);
    generatePlan({ ...prefs, pace: value });
  } else if (step === 5) {
    if (value === "NEW_ROUTE") { window.location.reload(); return; }
    continueChat(value);
  }
};

const handleInterestsDone = () => {
  const interests = selectedInterests.length > 0 ? selectedInterests : ["Разное"];
  setActiveOptions(null);
  pushUser(interests.join(", "));
  const np = { ...prefs, interests };
  setPrefs(np); setStep(4);
  aiSay(getTexts(locale).q_pace, 700, () => { scrollBottom(); setActiveOptions("pace"); });
};

  const geocodePlan = async (planData: Plan): Promise<GeoDay[]> => {
  const days: GeoDay[] = planData.days.map((day, di) => ({
    day: day.day,
    title: day.title,
    color: DAY_COLORS[di % DAY_COLORS.length],
    stops: [
      {
        time: "Утро", label: "morning",
        activity: day.morning.activity,
        description: day.morning.description,
        tip: day.morning.tip,
        lat: (day.morning as any).lat || 40.4093,
        lng: (day.morning as any).lng || 49.8671,
      },
      {
        time: "День", label: "afternoon",
        activity: day.afternoon.activity,
        description: day.afternoon.description,
        tip: day.afternoon.tip,
        lat: (day.afternoon as any).lat || 40.4093,
        lng: (day.afternoon as any).lng || 49.8671,
      },
      {
        time: "Вечер", label: "evening",
        activity: day.evening.activity,
        description: day.evening.description,
        tip: day.evening.tip,
        lat: (day.evening as any).lat || 40.4093,
        lng: (day.evening as any).lng || 49.8671,
      },
    ],
  }));
  return days;
};

  const generatePlan = async (finalPrefs: Prefs) => {
  aiSay(texts.generating, 400);
  setGenerating(true);
  try {
    const res = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        days: finalPrefs.duration,
        group: finalPrefs.group,
        budget: finalPrefs.budget,
        interests: finalPrefs.interests,
        from: "Весь Азербайджан",
        locale,
        diet: [],
        pace: finalPrefs.pace,
      }),
    });
    const data = await res.json();
    if (data.plan) {
      setPlan(data.plan);
      aiSay(texts.ready, 600);
      const geo = await geocodePlan(data.plan);
      setGeoDays(geo);
      setActiveDay(1);
      setTimeout(() => { setView("itinerary"); }, 1200);
    } else {
      aiSay(texts.error);
    }
  } catch {
    aiSay(texts.network_error);
  }
  setGenerating(false);
};

const continueChat = async (userMsg: string) => {
  if (generating) return;
  setGenerating(true);
  setIsTyping(true);
  setActiveOptions(null);
  const langInstruction = locale === "ru" ? "Отвечай на русском." : locale === "az" ? "Azərbaycan dilində cavab ver." : locale === "tr" ? "Türkçe yanıt ver." : "Respond in English.";
  const system = `${langInstruction} Travel consultant for Azerbaijan. Context: ${prefs.duration} days, ${prefs.group}, budget ${prefs.budget}, interests: ${prefs.interests.join(", ")}, pace ${prefs.pace}. Max 150 words.`;
  const newHistory = [...chatHistory, { role: "user", content: userMsg }];
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newHistory, system }),
    });
    const data = await res.json();
    const text = data.text || (locale === "ru" ? "Попробуйте переформулировать." : "Please try rephrasing.");
    setChatHistory([...newHistory, { role: "assistant", content: text }]);
    setIsTyping(false);
    pushAI(text);
    scrollBottom();
    setTimeout(() => { scrollBottom(); setActiveOptions("post"); }, 400);
  } catch {
    setIsTyping(false);
    aiSay(texts.error);
  }
  setGenerating(false);
};

const handleSend = () => {
  const text = inputValue.trim();
  if (!text || generating) return;
  setInputValue("");
  pushUser(text);
  setActiveOptions(null);
  if (step >= 5) continueChat(text);
  else if (step === 0) handleOption(text, text);
  else if (step === 1) handleOption(text, text);
  else if (step === 2) handleOption(text, text);
  else if (step === 4) handleOption(text, text);
  else aiSay(texts.select_above);
};

const currentDay = plan?.days.find(d => d.day === activeDay);
const currentGeoDay = geoDays.find(d => d.day === activeDay);

  // ── ITINERARY VIEW ─────────────────────────────────────────────────
  if (view === "itinerary" && plan) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: T.bg, color: T.text, fontFamily: T.font, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
        *{box-sizing:border-box;}
        .stop-row:hover{background:rgba(255,255,255,0.04)!important;border-color:rgba(0,212,170,0.2)!important;}
        .stop-row.active-stop{background:${T.accentGlow}!important;border-color:${T.accent}!important;}
        .day-chip:hover{opacity:0.8;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(0,212,170,0.2);border-radius:2px;}
        .itin-split{display:flex;flex:1;overflow:hidden;flex-direction:row;}
        .itin-left{width:420px;flex-shrink:0;display:flex;flex-direction:column;border-right:1px solid ${T.border};overflow:hidden;}
        .itin-map{flex:1;position:relative;min-height:0;}
        @media(max-width:767px){
          .itin-split{flex-direction:column;overflow-y:auto;overflow-x:hidden;}
          .itin-left{width:100%!important;flex-shrink:0;overflow:visible;height:auto;}
          .itin-map{height:320px;flex:none;flex-shrink:0;position:relative;}
          .itin-topbar-title{display:none;}
        }
      `}</style>

      {/* Top nav */}
      <div style={{ height: 52, background: T.sidebar, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <Link href={`/${locale}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: "pulse 2s ease infinite" }} />
            <span style={{ fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 800, color: T.text, whiteSpace: "nowrap" }}>CASPIAN<span style={{ color: T.accent }}>.</span>ROUTES</span>
          </Link>
          <div style={{ width: 1, height: 16, background: T.border, flexShrink: 0 }} />
          <span className="itin-topbar-title" style={{ fontSize: 12, color: T.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI маршрут</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {geocoding && <span style={{ fontSize: 11, color: T.textMuted, whiteSpace: "nowrap" }}>Загружаем...</span>}
          <button onClick={() => setView("chat")} style={{ padding: "6px 14px", borderRadius: 8, background: T.accentGlow, border: `1px solid ${T.accentBorder}`, color: T.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: T.font, whiteSpace: "nowrap" }}>
            💬 Чат
          </button>
        </div>
      </div>

      {/* Split */}
      <div className="itin-split">

        {/* Left: Itinerary */}
        <div className="itin-left">

          {/* Plan header */}
          <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
            <p style={{ fontSize: 9, color: T.accent, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 4 }}>✦ Ваш маршрут</p>
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(0.95rem, 2vw, 1.2rem)", color: T.text, fontWeight: 800, margin: "0 0 4px" }}>{plan.plan_title}</h2>
            <p style={{ color: T.textMuted, fontSize: 12, margin: 0 }}>{plan.total_budget_estimate}</p>
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {[prefs.group, prefs.budget, prefs.pace].filter(Boolean).map((p, i) => (
                <span key={i} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMuted }}>{p}</span>
              ))}
            </div>
          </div>

          {/* Day chips */}
          <div style={{ display: "flex", gap: 6, padding: "10px 20px", borderBottom: `1px solid ${T.border}`, overflowX: "auto", flexShrink: 0 }}>
            {plan.days.map((day, di) => {
              const color = DAY_COLORS[di % DAY_COLORS.length];
              const isActive = day.day === activeDay;
              return (
                <button key={day.day} className="day-chip"
                  onClick={() => { setActiveDay(day.day); setActiveStopIdx(null); }}
                  style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${isActive ? color : T.border}`, background: isActive ? `${color}15` : T.bgCard, color: isActive ? color : T.textMuted, fontSize: 12, fontWeight: isActive ? 600 : 400, cursor: "pointer", fontFamily: T.font, whiteSpace: "nowrap", transition: "all 0.2s", flexShrink: 0 }}>
                  День {day.day}
                </button>
              );
            })}
          </div>

          {/* Day content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            {currentDay && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 10, color: currentGeoDay?.color || T.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>День {currentDay.day}</p>
                  <h3 style={{ fontFamily: T.fontDisplay, fontSize: "1.1rem", color: T.text, fontWeight: 800, margin: 0 }}>{currentDay.title}</h3>
                </div>

                {[
                  { slot: "morning" as const, label: "🌅 Утро", data: currentDay.morning },
                  { slot: "afternoon" as const, label: "☀️ День", data: currentDay.afternoon },
                  { slot: "evening" as const, label: "🌙 Вечер", data: currentDay.evening },
                ].map(({ slot, label, data }, si) => {
                  const isActive = activeStopIdx === si;
                  const color = currentGeoDay?.color || T.accent;
                  return (
                    <div key={slot} className={`stop-row${isActive ? " active-stop" : ""}`}
                      onClick={() => { setActiveStopIdx(si); setActiveSlot(slot); }}
                      style={{ display: "flex", gap: 12, padding: "12px", borderRadius: 10, border: `1px solid ${T.border}`, marginBottom: 8, cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: 32, flexShrink: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: isActive ? color : T.bgCard, border: `1.5px solid ${isActive ? color : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: isActive ? "#06090f" : T.textMuted, transition: "all 0.2s" }}>
                          {si + 1}
                        </div>
                        {si < 2 && <div style={{ width: 1, flex: 1, minHeight: 16, background: isActive ? color : T.border, opacity: 0.4 }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 10, color: T.textMuted, marginBottom: 2 }}>{label}</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: isActive ? color : T.text, margin: "0 0 3px" }}>{data.activity}</p>
                        <p style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.5, margin: 0 }}>{data.description}</p>
                        {data.curator_note && isActive && (
                          <p style={{ fontSize: 11, color: T.textMuted, fontStyle: "italic", marginTop: 6, paddingLeft: 8, borderLeft: `2px solid ${T.accentBorder}` }}>{data.curator_note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {currentDay.excursion && (
                  <a href={currentDay.excursion.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: T.accentGlow, border: `1px solid ${T.accentBorder}`, textDecoration: "none", marginTop: 4 }}>
                    <span style={{ fontSize: 16 }}>🎫</span>
                    <div>
                      <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: 0 }}>{currentDay.excursion.name}</p>
                      <p style={{ fontSize: 11, color: T.textMuted, margin: 0 }}>Забронировать экскурсию →</p>
                    </div>
                  </a>
                )}
              </>
            )}

            {plan.curated_stays && plan.curated_stays.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 10, color: T.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>🏨 Рекомендуемые отели</p>
                {plan.curated_stays.map(hotel => (
                  <a key={hotel.name} href={hotel.booking_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "block", textDecoration: "none", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                    <p style={{ color: T.text, fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{hotel.name}</p>
                    <p style={{ color: T.textSoft, fontSize: 12, margin: "0 0 4px" }}>{hotel.description}</p>
                    <span style={{ color: T.accent, fontSize: 11 }}>Найти номер →</span>
                  </a>
                ))}
              </div>
            )}

            {plan.logistics && (
              <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", marginTop: 12 }}>
                <p style={{ color: T.accent, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>🚕 {plan.logistics.title}</p>
                <p style={{ color: T.textSoft, fontSize: 12, lineHeight: 1.6, margin: 0 }}>{plan.logistics.content}</p>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8, marginBottom: 20 }}>
              {plan.flights && (
                <a href={plan.flights.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ color: T.accent, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>✈️ Билеты</p>
                  <p style={{ color: T.textSoft, fontSize: 11, margin: "0 0 4px" }}>{plan.flights.tip}</p>
                  <span style={{ color: T.accent, fontSize: 11 }}>Найти →</span>
                </a>
              )}
              {plan.car_rental && (
                <a href={plan.car_rental.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ color: "#f59e0b", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>🚗 Авто</p>
                  <p style={{ color: T.textSoft, fontSize: 11, margin: "0 0 4px" }}>{plan.car_rental.tip}</p>
                  <span style={{ color: "#f59e0b", fontSize: 11 }}>Найти →</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Map */}
        <div className="itin-map">
          {geoDays.length > 0 ? (
            <ItineraryMap
              geoDays={geoDays}
              activeDay={activeDay}
              onMarkerClick={(day, stopIdx) => {
                setActiveDay(day);
                setActiveStopIdx(stopIdx);
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#07111e" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🗺</div>
                <p style={{ color: T.textMuted, fontSize: 13 }}>{geocoding ? "Загружаем карту..." : "Карта недоступна"}</p>
              </div>
            </div>
          )}

          {currentGeoDay && (
            <div style={{ position: "absolute", top: 12, left: 12, padding: "6px 14px", borderRadius: 20, background: currentGeoDay.color, color: "#06090f", fontSize: 12, fontWeight: 600, zIndex: 10, pointerEvents: "none" }}>
              День {currentGeoDay.day} — {currentGeoDay.title}
            </div>
          )}
{activeStopIdx !== null && currentGeoDay && currentGeoDay.stops[activeStopIdx as number] && (
  <div
    onClick={() => setActiveStopIdx(null)}
    style={{ position: "absolute", bottom: 16, left: 12, right: 12, maxWidth: 320, background: "rgba(6,9,15,0.96)", border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "10px 14px", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 10, animation: "fadeUp 0.2s ease", cursor: "pointer" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, color: T.textMuted, marginBottom: 2 }}>{currentGeoDay.stops[activeStopIdx as number].time}</p>
        <p style={{ fontSize: 13, fontWeight: 700, color: currentGeoDay.color, margin: "0 0 3px", lineHeight: 1.3 }}>{currentGeoDay.stops[activeStopIdx as number].activity}</p>
        <p style={{ fontSize: 12, color: T.textSoft, lineHeight: 1.4, margin: 0 }}>{currentGeoDay.stops[activeStopIdx as number].description}</p>
      </div>
      <button onClick={(e) => { e.stopPropagation(); setActiveStopIdx(null); }} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 16, padding: 0, flexShrink: 0 }}>×</button>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}
  // ── CHAT VIEW ──────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", height: "100dvh", background: T.bg, color: T.text, fontFamily: T.font, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
        *{box-sizing:border-box;}
        .cr-opt:hover{border-color:${T.accent}!important;color:${T.accent}!important;background:${T.accentGlow}!important;transform:translateY(-1px);}
        .cr-int.sel{border-color:${T.accent}!important;color:${T.accent}!important;background:${T.accentGlow}!important;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(0,212,170,0.2);border-radius:2px;}
        @media(max-width:767px){
        .nav-lang { display: none !important; }
  .cr-sidebar{display:none!important;}
  .cr-main{border-left:none!important;}
  .itin-left{width:100%!important;flex:none!important;}
  .itin-map{height:350px!important;flex:none!important;display:block!important;}
}
      `}</style>

      {/* Sidebar */}
      <aside className="cr-sidebar" style={{ width: 260, flexShrink: 0, background: T.sidebar, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "24px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(0,212,170,0.04)", filter: "blur(40px)", pointerEvents: "none" }} />
        <Link href={`/${locale}`} style={{ textDecoration: "none", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, boxShadow: `0 0 8px ${T.accent}`, animation: "pulse 2s ease infinite" }} />
            <span style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>CASPIAN<span style={{ color: T.accent }}>.</span>ROUTES</span>
          </div>
        </Link>
        <p style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: T.textMuted, marginBottom: 16 }}>Профиль поездки</p>
        {[
          { icon: "🗓", label: "Длительность", value: prefs.duration ? `${prefs.duration} дней` : null },
          { icon: "👥", label: "Состав", value: prefs.group },
          { icon: "💳", label: "Бюджет", value: prefs.budget },
          { icon: "🎯", label: "Интересы", value: prefs.interests.length > 0 ? prefs.interests.slice(0, 2).join(", ") + (prefs.interests.length > 2 ? "..." : "") : null },
          { icon: "🚶", label: "Темп", value: prefs.pace },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: T.bgCard, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{item.icon}</div>
            <div>
              <span style={{ fontSize: 10, color: T.textMuted, display: "block", marginBottom: 1 }}>{item.label}</span>
              <span style={{ fontSize: 12, color: item.value ? T.textSoft : T.textMuted, fontStyle: item.value ? "normal" : "italic" }}>{item.value || "Не указано"}</span>
            </div>
          </div>
        ))}
        {plan && (
          <button onClick={() => setView("itinerary")} style={{ marginTop: 20, padding: "8px 0", borderRadius: 8, background: T.accentGlow, border: `1px solid ${T.accentBorder}`, color: T.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: T.font }}>
            🗺 Открыть маршрут
          </button>
        )}
        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <div style={{ display: "flex", gap: 6, padding: "6px 8px", borderRadius: 8, background: T.bgCard, border: `1px solid ${T.border}` }}>
            {["ru", "en", "az", "tr"].map(l => (
              <a key={l} href={`/${l}/planner`} style={{ flex: 1, textAlign: "center", fontSize: 10, padding: "3px 0", borderRadius: 4, color: locale === l ? T.accent : T.textMuted, background: locale === l ? T.accentGlow : "transparent", textDecoration: "none", fontWeight: locale === l ? 600 : 400 }}>{l.toUpperCase()}</a>
            ))}
          </div>
        </div>
      </aside>

      {/* Main chat */}
      <div className="cr-main" style={{ flex: 1, display: "flex", flexDirection: "column", borderLeft: `1px solid ${T.border}`, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <span style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 800, color: T.text }}>AI <span style={{ color: T.accent }}>планер</span> маршрутов</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {plan && (
              <button onClick={() => setView("itinerary")} style={{ padding: "5px 12px", borderRadius: 8, background: T.accentGlow, border: `1px solid ${T.accentBorder}`, color: T.accent, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: T.font }}>
                🗺 Маршрут
              </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: T.accentGlow, border: `1px solid ${T.accentBorder}` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: "pulse 2s ease infinite" }} />
              <span style={{ fontSize: 11, color: T.accent, fontWeight: 500 }}>{texts.ai_active}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 3, padding: "10px 20px 6px", flexShrink: 0 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i < step ? T.accent : i === step ? T.accentDim : T.bgCard, transition: "all 0.3s" }} />
          ))}
        </div>
{generating && step === 5 && <GeneratingOverlay locale={locale} />}
        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: 10, maxWidth: "85%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row", animation: "fadeUp 0.3s ease" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: msg.role === "ai" ? T.accent : T.bgCard, color: msg.role === "ai" ? "#06090f" : T.textMuted, fontSize: msg.role === "ai" ? 10 : 13, fontWeight: 600, marginTop: 2 }}>
                {msg.role === "ai" ? "CR" : "👤"}
              </div>
              <div style={{ padding: "10px 14px", borderRadius: msg.role === "ai" ? "4px 12px 12px 12px" : "12px 4px 12px 12px", background: msg.role === "ai" ? T.bgCard : T.accent, color: msg.role === "ai" ? T.text : "#06090f", fontSize: 14, lineHeight: 1.6, border: msg.role === "ai" ? `1px solid ${T.border}` : "none", whiteSpace: "pre-line" }}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: T.accent, color: "#06090f", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>CR</div>
              <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "4px 12px 12px 12px" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.textMuted, animation: `bounce 0.9s ease-in-out ${i*0.15}s infinite` }} />)}
              </div>
            </div>
          )}

          {!isTyping && !generating && activeOptions && activeOptions !== "interests" && activeOptions !== "post" && (
            <div style={{ paddingLeft: 40, display: "flex", flexWrap: "wrap", gap: 7, animation: "fadeUp 0.3s ease" }}>
              {options[activeOptions as keyof typeof options]?.map((opt: any) => (
                <button key={opt.label} className="cr-opt" onClick={() => handleOption(opt.value || opt.label, opt.label)}
                  style={{ padding: "7px 14px", border: `1px solid ${T.border}`, borderRadius: 20, background: T.bgCard, color: T.text, fontSize: 13, fontFamily: T.font, cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{opt.icon}</span>{opt.label}
                </button>
              ))}
            </div>
          )}

          {!isTyping && !generating && activeOptions === "interests" && (
            <div style={{ paddingLeft: 40, animation: "fadeUp 0.3s ease" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
                {options.interests.map(opt => (
                  <button key={opt.label} className={`cr-int${selectedInterests.includes(opt.label) ? " sel" : ""}`}
                    onClick={() => setSelectedInterests(prev => prev.includes(opt.label) ? prev.filter(x => x !== opt.label) : [...prev, opt.label])}
                    style={{ padding: "7px 14px", border: `1px solid ${T.border}`, borderRadius: 20, background: T.bgCard, color: T.text, fontSize: 13, fontFamily: T.font, cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{opt.icon}</span>{opt.label}
                  </button>
                ))}
              </div>
              <button onClick={handleInterestsDone} style={{ padding: "8px 20px", borderRadius: 20, background: T.accent, color: "#06090f", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: T.font }}>{texts.done_btn}</button>
            </div>
          )}

          {!isTyping && !generating && activeOptions === "post" && (
            <div style={{ paddingLeft: 40, display: "flex", flexWrap: "wrap", gap: 7, animation: "fadeUp 0.3s ease" }}>
              {OPTIONS.post.map(opt => (
                <button key={opt.label} className="cr-opt"
                  onClick={() => { setActiveOptions(null); if (opt.value === "Новый маршрут") { window.location.reload(); return; } pushUser(opt.label); continueChat(opt.value); }}
                  style={{ padding: "7px 14px", border: `1px solid ${T.border}`, borderRadius: 20, background: T.bgCard, color: T.text, fontSize: 13, fontFamily: T.font, cursor: "pointer", transition: "all 0.18s", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{opt.icon}</span>{opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea value={inputValue}
              onChange={e => { setInputValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={texts.placeholder} rows={1}
              style={{ flex: 1, minHeight: 44, maxHeight: 120, padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: 12, background: T.bgCard, color: T.text, fontSize: 14, fontFamily: T.font, resize: "none", outline: "none", lineHeight: 1.5, transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = T.border}
            />
            <button onClick={handleSend} disabled={generating || !inputValue.trim()}
              style={{ width: 44, height: 44, borderRadius: 12, background: T.accent, border: "none", cursor: generating || !inputValue.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: generating || !inputValue.trim() ? 0.4 : 1, transition: "all 0.18s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06090f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}