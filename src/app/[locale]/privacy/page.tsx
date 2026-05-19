import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

const content = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: May 2026",
    sections: [
      {
        title: "1. Who We Are",
        text: "Caspian Routes (caspian-routes.com) is an AI-powered travel planning platform for Azerbaijan and the Caucasus. We help travelers plan personalized itineraries and connect them with travel services through affiliate partnerships."
      },
      {
        title: "2. Information We Collect",
        text: "We collect: email address when you subscribe to receive free travel guides; travel preferences you enter into the AI Trip Planner (not stored after itinerary generation); pages visited and features used (anonymous analytics); name, email and message when you contact us."
      },
      {
        title: "3. How We Use Your Information",
        text: "We use your information to deliver the free travel guide you requested, generate your AI travel itinerary, respond to your inquiries, and improve our platform. We do not sell your personal data to third parties."
      },
      {
        title: "4. Affiliate Links",
        text: "Caspian Routes earns commissions through affiliate partnerships with Aviasales, Ostrovok, Localrent and GetYourGuide. When you click an affiliate link and make a purchase, we may receive a commission at no extra cost to you. This does not influence our editorial recommendations."
      },
      {
        title: "5. Third-Party Services",
        text: "We use: Resend for email delivery; Anthropic Claude API for AI itinerary generation (inputs not stored by us); Firebase (Google) for platform infrastructure; Vercel for hosting and analytics."
      },
      {
        title: "6. Cookies",
        text: "We use essential cookies for platform functionality and analytics cookies to understand how our platform is used. You can control cookie settings through your browser preferences."
      },
      {
        title: "7. Your Rights",
        text: "You have the right to access, correct or request deletion of your personal data. Contact us at ealyarov55@gmail.com. We will respond within 30 days."
      },
      {
        title: "8. Contact",
        text: "Email: ealyarov55@gmail.com · Baku, Azerbaijan"
      },
    ]
  },
  ru: {
    title: "Политика конфиденциальности",
    updated: "Последнее обновление: май 2026",
    sections: [
      {
        title: "1. Кто мы",
        text: "Caspian Routes (caspian-routes.com) — AI-планировщик путешествий по Азербайджану и Кавказу. Мы помогаем путешественникам планировать маршруты и находить туристические услуги через партнёрские программы."
      },
      {
        title: "2. Какие данные мы собираем",
        text: "Мы собираем: email-адрес при подписке на бесплатные гиды; туристические предпочтения в AI-планировщике (не сохраняются после генерации маршрута); анонимные данные о посещении страниц; имя, email и сообщение при обращении через форму связи."
      },
      {
        title: "3. Как мы используем данные",
        text: "Мы используем ваши данные для отправки запрошенного гида, генерации AI-маршрута, ответа на запросы и улучшения платформы. Мы не продаём персональные данные третьим лицам."
      },
      {
        title: "4. Партнёрские ссылки",
        text: "Caspian Routes получает комиссии через партнёрские программы Aviasales, Ostrovok, Localrent и GetYourGuide. Когда вы переходите по партнёрской ссылке и совершаете покупку, мы можем получить комиссию без дополнительных расходов для вас. Это не влияет на наши рекомендации."
      },
      {
        title: "5. Сторонние сервисы",
        text: "Мы используем: Resend для доставки email; Anthropic Claude API для генерации маршрутов (ваши данные не сохраняются нами); Firebase (Google) для инфраструктуры; Vercel для хостинга и аналитики."
      },
      {
        title: "6. Cookies",
        text: "Мы используем основные cookies для работы платформы и аналитические cookies для понимания использования сайта. Вы можете управлять настройками cookies в браузере."
      },
      {
        title: "7. Ваши права",
        text: "Вы имеете право на доступ, исправление или удаление своих персональных данных. Напишите нам на ealyarov55@gmail.com. Мы ответим в течение 30 дней."
      },
      {
        title: "8. Контакт",
        text: "Email: ealyarov55@gmail.com · Баку, Азербайджан"
      },
    ]
  },
  tr: {
    title: "Gizlilik Politikası",
    updated: "Son güncelleme: Mayıs 2026",
    sections: [
      {
        title: "1. Biz Kimiz",
        text: "Caspian Routes (caspian-routes.com), Azerbaycan ve Kafkasya için yapay zeka destekli bir seyahat planlama platformudur. Gezginlerin kişiselleştirilmiş rotalar oluşturmasına ve ortaklık programları aracılığıyla seyahat hizmetlerine ulaşmasına yardımcı oluyoruz."
      },
      {
        title: "2. Topladığımız Bilgiler",
        text: "Şunları topluyoruz: ücretsiz seyahat rehberi aboneliğinde e-posta adresi; AI Rota Planlayıcısı'na girilen seyahat tercihleri (rota oluşturulduktan sonra saklanmaz); anonim sayfa ziyareti verileri; iletişim formundaki ad, e-posta ve mesaj."
      },
      {
        title: "3. Bilgileri Nasıl Kullanıyoruz",
        text: "Bilgilerinizi talep ettiğiniz rehberi göndermek, AI rotanızı oluşturmak, sorularınızı yanıtlamak ve platformumuzu geliştirmek için kullanıyoruz. Kişisel verilerinizi üçüncü taraflara satmıyoruz."
      },
      {
        title: "4. Ortaklık Bağlantıları",
        text: "Caspian Routes, Aviasales, Ostrovok, Localrent ve GetYourGuide ile ortaklık programları aracılığıyla komisyon kazanmaktadır. Bir ortaklık bağlantısına tıklayıp satın alma yaptığınızda, size ek bir maliyet olmaksızın komisyon alabiliriz. Bu, editoryal önerilerimizi etkilemez."
      },
      {
        title: "5. Üçüncü Taraf Hizmetler",
        text: "Şunları kullanıyoruz: e-posta iletimi için Resend; AI rota oluşturma için Anthropic Claude API (girişleriniz tarafımızca saklanmaz); platform altyapısı için Firebase (Google); barındırma ve analitik için Vercel."
      },
      {
        title: "6. Çerezler",
        text: "Platform işlevselliği için temel çerezler ve platformun nasıl kullanıldığını anlamak için analitik çerezler kullanıyoruz. Çerez ayarlarını tarayıcı tercihlerinizden yönetebilirsiniz."
      },
      {
        title: "7. Haklarınız",
        text: "Kişisel verilerinize erişim, düzeltme veya silme talep etme hakkına sahipsiniz. ealyarov55@gmail.com adresine yazın. 30 gün içinde yanıt vereceğiz."
      },
      {
        title: "8. İletişim",
        text: "E-posta: ealyarov55@gmail.com · Bakü, Azerbaycan"
      },
    ]
  },
  az: {
    title: "Məxfilik Siyasəti",
    updated: "Son yenilənmə: may 2026",
    sections: [
      {
        title: "1. Biz kimik",
        text: "Caspian Routes (caspian-routes.com) Azərbaycan və Qafqaz üçün AI-dəstəkli səyahət planlaşdırma platformudur. Səyahətçilərə fərdi marşrutlar qurmaqda və tərəfdaşlıq proqramları vasitəsilə turizm xidmətlərinə çatmaqda kömək edirik."
      },
      {
        title: "2. Topladığımız məlumatlar",
        text: "Biz topluyuruq: pulsuz bələdçiyə abunəlik zamanı e-poçt ünvanı; AI Marşrut Planlayıcısına daxil edilən səyahət üstünlükləri (marşrut yaradıldıqdan sonra saxlanılmır); anonim səhifə ziyarəti məlumatları; əlaqə formasındakı ad, e-poçt və mesaj."
      },
      {
        title: "3. Məlumatları necə istifadə edirik",
        text: "Məlumatlarınızı tələb olunan bələdçini göndərmək, AI marşrutunuzu yaratmaq, sorğularınıza cavab vermək və platformumuzu inkişaf etdirmək üçün istifadə edirik. Şəxsi məlumatlarınızı üçüncü tərəflərə satmırıq."
      },
      {
        title: "4. Tərəfdaşlıq bağlantıları",
        text: "Caspian Routes Aviasales, Ostrovok, Localrent və GetYourGuide ilə tərəfdaşlıq proqramları vasitəsilə komissiya qazanır. Tərəfdaşlıq bağlantısına klikləyib alış-veriş etdikdə sizə əlavə xərc olmadan komissiya ala bilərik. Bu, redaksiya tövsiyələrimizə təsir etmir."
      },
      {
        title: "5. Üçüncü tərəf xidmətlər",
        text: "Biz istifadə edirik: e-poçt çatdırılması üçün Resend; AI marşrut yaradılması üçün Anthropic Claude API (daxiletmələriniz bizdə saxlanılmır); platforma infrastrukturu üçün Firebase (Google); hosting və analitika üçün Vercel."
      },
      {
        title: "6. Cookies",
        text: "Platforma funksionallığı üçün əsas cookies və platformanın necə istifadə edildiyini anlamaq üçün analitik cookies istifadə edirik. Cookie parametrlərini brauzer tənzimləmələrinizdən idarə edə bilərsiniz."
      },
      {
        title: "7. Hüquqlarınız",
        text: "Şəxsi məlumatlarınıza daxil olmaq, düzəltmək və ya silmək tələb etmək hüququnuz var. ealyarov55@gmail.com ünvanına yazın. 30 gün ərzində cavab verəcəyik."
      },
      {
        title: "8. Əlaqə",
        text: "E-poçt: ealyarov55@gmail.com · Bakı, Azərbaycan"
      },
    ]
  },
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = (locale === "ru" || locale === "tr" || locale === "az") ? locale : "en";
  const t = content[lang as keyof typeof content];

  return (
    <main style={{ background: "#021a1a", minHeight: "100vh" }}>
      <Navbar locale={locale} />
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "100px 24px 80px" }}>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 8 }}>
          {t.title}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 48 }}>{t.updated}</p>

        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.8, fontFamily: "DM Sans, sans-serif" }}>
          {t.sections.map((section, i) => (
            <div key={i}>
              <h2 style={{ color: "white", fontSize: 18, fontWeight: 500, marginTop: 40, marginBottom: 12 }}>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer locale={locale} />
    </main>
  );
}