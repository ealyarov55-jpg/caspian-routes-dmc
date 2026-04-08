export const locales = ["en", "ru", "az"] as const;
export type Locale = typeof locales[number];

export const translations = {
  en: {
    nav: {
      destinations: "Destinations",
      experiences: "Experiences",
      routes: "Routes",
      about: "About",
      contact: "Contact",
      planTrip: "Plan Your Trip",
    },
    hero: {
      subtitle: "Your DMC Partner for Unforgettable Journeys in Azerbaijan, Kazakhstan, Turkmenistan, Iran & Russia.",
      exploreBtn: "Explore Routes",
      planBtn: "Plan Your Trip",
      countries: "Countries",
      routes: "Routes",
      travelers: "Travelers",
    },
    curated: {
      tag: "Handpicked for you",
      title: "Curated Experiences",
      viewAll: "View all routes",
      from: "From",
      explore: "Explore Route",
    },
  },
  ru: {
    nav: {
      destinations: "Направления",
      experiences: "Впечатления",
      routes: "Маршруты",
      about: "О нас",
      contact: "Контакты",
      planTrip: "Спланировать поездку",
    },
    hero: {
      subtitle: "Ваш DMC-партнёр для незабываемых путешествий по Азербайджану, Казахстану, Туркменистану, Ирану и России.",
      exploreBtn: "Смотреть маршруты",
      planBtn: "Спланировать поездку",
      countries: "Страны",
      routes: "Маршруты",
      travelers: "Путешественников",
    },
    curated: {
      tag: "Специально для вас",
      title: "Кураторские впечатления",
      viewAll: "Все маршруты",
      from: "От",
      explore: "Подробнее",
    },
  },
  az: {
    nav: {
      destinations: "Istiqamətlər",
      experiences: "Təcrübələr",
      routes: "Marşrutlar",
      about: "Haqqımızda",
      contact: "Əlaqə",
      planTrip: "Səfər planla",
    },
    hero: {
      subtitle: "Azərbaycan, Qazaxıstan, Türkmənistan, İran və Rusiyada unudulmaz səyahətlər üçün DMC tərəfdaşınız.",
      exploreBtn: "Marşrutlara bax",
      planBtn: "Səfər planla",
      countries: "Ölkə",
      routes: "Marşrut",
      travelers: "Səyahətçi",
    },
    curated: {
      tag: "Sizin üçün seçilmişdir",
      title: "Kuratorluq təcrübələri",
      viewAll: "Bütün marşrutlar",
      from: "Başlayaraq",
      explore: "Marşruta bax",
    },
  },
};

export function getT(locale: string) {
  const lang = locales.includes(locale as Locale) ? locale as Locale : "en";
  return translations[lang];
}