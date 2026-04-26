"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const lang = (locale === "ru" || locale === "az") ? locale : "en";

  const tr = (en: string, ru: string, az: string) =>
    lang === "ru" ? ru : lang === "az" ? az : en;

  const lastUpdated = "April 2026";

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f7", fontFamily: "DM Sans, sans-serif" }}>
      <Navbar locale={locale} />

      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #021a1a 0%, #042e2e 100%)", padding: "120px 24px 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ color: "#2dd4bf", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12 }}>
            {tr("Legal", "Правовая информация", "Hüquqi məlumat")}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", color: "white", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, marginBottom: 16 }}>
            {tr("Privacy Policy", "Политика конфиденциальности", "Məxfilik siyasəti")}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            {tr("Last updated", "Последнее обновление", "Son yenilənmə")}: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ background: "white", borderRadius: 24, padding: "40px 48px", boxShadow: "0 4px 24px rgba(4,46,46,0.08)", lineHeight: 1.8 }}>

          {/* Intro */}
          <p style={{ color: "#4a6060", fontSize: 15, marginBottom: 32 }}>
            {tr(
              "Caspian Routes DMC ('we', 'us', 'our') is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform and services.",
              "Caspian Routes DMC ('мы', 'нас', 'наш') стремится защищать вашу личную информацию. Настоящая Политика конфиденциальности объясняет, как мы собираем, используем и защищаем ваши данные при использовании нашей платформы и услуг.",
              "Caspian Routes DMC şəxsi məlumatlarınızı qorumağa sadiqdir. Bu Məxfilik Siyasəti platformamızdan istifadə edərkən məlumatlarınızı necə topladığımızı, istifadə etdiyimizi və qoruduğumuzu izah edir."
            )}
          </p>

          {[
            {
              num: "1",
              title: tr("Information We Collect", "Информация, которую мы собираем", "Topladığımız məlumatlar"),
              content: tr(
                "We collect the following types of information: (a) Registration data — name, email address, company name, country, phone number when you register as a partner; (b) Usage data — pages visited, features used, and actions taken on our platform; (c) Communication data — messages and inquiries sent through our platform; (d) Booking data — details of tour requests and quotes submitted through our platform.",
                "Мы собираем следующие типы информации: (а) Регистрационные данные — имя, адрес электронной почты, название компании, страна, номер телефона при регистрации в качестве партнёра; (б) Данные об использовании — посещённые страницы, используемые функции и действия на нашей платформе; (в) Коммуникационные данные — сообщения и запросы, отправленные через нашу платформу; (г) Данные о бронировании — детали запросов на туры и котировок.",
                "Aşağıdakı məlumat növlərini toplayırıq: (a) Qeydiyyat məlumatları — ad, e-poçt ünvanı, şirkət adı, ölkə, telefon nömrəsi; (b) İstifadə məlumatları — ziyarət edilən səhifələr, istifadə olunan funksiyalar; (c) Ünsiyyət məlumatları — platformamız vasitəsilə göndərilən mesajlar."
              ),
            },
            {
              num: "2",
              title: tr("How We Use Your Information", "Как мы используем вашу информацию", "Məlumatlarınızı necə istifadə edirik"),
              content: tr(
                "We use your information to: provide and improve our B2B DMC services; process booking requests and send confirmations; communicate with you about your account and requests; send relevant updates about our services; comply with legal obligations; prevent fraud and ensure platform security. We do not sell your personal data to third parties.",
                "Мы используем вашу информацию для: предоставления и улучшения наших B2B DMC услуг; обработки запросов на бронирование и отправки подтверждений; общения с вами по вопросам вашего аккаунта; отправки соответствующих обновлений о наших услугах; соблюдения правовых обязательств; предотвращения мошенничества. Мы не продаём ваши персональные данные третьим лицам.",
                "Məlumatlarınızı istifadə edirik: B2B DMC xidmətlərini göstərmək üçün; rezervasiya sorğularını emal etmək üçün; hesabınız barədə sizinlə əlaqə saxlamaq üçün. Şəxsi məlumatlarınızı üçüncü şəxslərə satmırıq."
              ),
            },
            {
              num: "3",
              title: tr("Data Storage & Security", "Хранение и безопасность данных", "Məlumatların saxlanması və təhlükəsizliyi"),
              content: tr(
                "Your data is stored securely using Firebase (Google Cloud Platform), which provides enterprise-grade security. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Data is stored on servers located within the European Economic Area.",
                "Ваши данные хранятся в безопасности с использованием Firebase (Google Cloud Platform), обеспечивающего корпоративный уровень безопасности. Мы применяем надлежащие технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.",
                "Məlumatlarınız Firebase (Google Cloud Platform) istifadə edərək təhlükəsiz şəkildə saxlanılır. Şəxsi məlumatlarınızı icazəsiz girişdən, dəyişdirməkdən və məhv edilməkdən qorumaq üçün müvafiq texniki tədbirlər görürük."
              ),
            },
            {
              num: "4",
              title: tr("Cookies", "Файлы cookie", "Kukilər"),
              content: tr(
                "Our platform uses cookies and similar tracking technologies to enhance your experience. We use: essential cookies for platform functionality; analytics cookies to understand how our platform is used; preference cookies to remember your settings such as language and currency. You can control cookie settings through your browser preferences.",
                "Наша платформа использует файлы cookie и аналогичные технологии отслеживания для улучшения вашего опыта. Мы используем: необходимые файлы cookie для функционирования платформы; аналитические файлы cookie для понимания использования платформы; файлы cookie предпочтений для запоминания ваших настроек (язык, валюта).",
                "Platformamız təcrübənizi artırmaq üçün kukilər istifadə edir: zəruri kukiler; analitik kukiler; üstünlük kukileri — dil və valyuta parametrlərinizi yadda saxlamaq üçün."
              ),
            },
            {
              num: "5",
              title: tr("Third-Party Services", "Сторонние сервисы", "Üçüncü tərəf xidmətləri"),
              content: tr(
                "We use the following third-party services that may process your data: Firebase (Google) — authentication and database; Resend — email delivery; ExchangeRate-API — currency conversion (no personal data shared). Each of these services has its own privacy policy. We encourage you to review them.",
                "Мы используем следующие сторонние сервисы, которые могут обрабатывать ваши данные: Firebase (Google) — аутентификация и база данных; Resend — доставка электронных писем; ExchangeRate-API — конвертация валют (персональные данные не передаются). Каждый из этих сервисов имеет собственную политику конфиденциальности.",
                "Aşağıdakı üçüncü tərəf xidmətlərindən istifadə edirik: Firebase (Google) — autentifikasiya və verilənlər bazası; Resend — e-poçt çatdırılması; ExchangeRate-API — valyuta konvertasiyası."
              ),
            },
            {
              num: "6",
              title: tr("Your Rights", "Ваши права", "Sizin hüquqlarınız"),
              content: tr(
                "You have the right to: access your personal data we hold; correct inaccurate data; request deletion of your data; object to processing of your data; withdraw consent at any time. To exercise these rights, contact us at ealyarov55@gmail.com. We will respond to your request within 30 days.",
                "Вы имеете право: получить доступ к своим персональным данным; исправить неточные данные; запросить удаление своих данных; возразить против обработки своих данных; отозвать согласие в любое время. Для реализации этих прав свяжитесь с нами по адресу ealyarov55@gmail.com. Мы ответим на ваш запрос в течение 30 дней.",
                "Aşağıdakı hüquqlara maliksiniz: şəxsi məlumatlarınıza giriş; qeyri-dəqiq məlumatların düzəldilməsi; məlumatlarınızın silinməsi; məlumatların emalına etiraz. Bu hüquqları həyata keçirmək üçün ealyarov55@gmail.com ünvanına müraciət edin."
              ),
            },
            {
              num: "7",
              title: tr("Data Retention", "Хранение данных", "Məlumatların saxlanma müddəti"),
              content: tr(
                "We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Partner account data is retained for the duration of the partnership and up to 3 years after termination for legal and accounting purposes. Booking data is retained for 5 years for financial record-keeping requirements under Azerbaijani law.",
                "Мы храним ваши персональные данные в течение времени, необходимого для предоставления наших услуг и соблюдения правовых обязательств. Данные партнёрского аккаунта хранятся в течение срока партнёрства и до 3 лет после его прекращения в юридических и бухгалтерских целях. Данные о бронировании хранятся 5 лет.",
                "Şəxsi məlumatlarınızı xidmətlərimizi göstərmək üçün lazım olan müddət ərzində saxlayırıq. Tərəfdaş hesabı məlumatları tərəfdaşlıq müddəti ərzində və başa çatmasından 3 il sonra saxlanılır."
              ),
            },
            {
              num: "8",
              title: tr("Changes to This Policy", "Изменения в этой политике", "Bu siyasətdə dəyişikliklər"),
              content: tr(
                "We may update this Privacy Policy from time to time. We will notify registered partners of significant changes via email. Your continued use of our platform after changes are posted constitutes acceptance of the updated policy. The date of the last update is shown at the top of this page.",
                "Мы можем периодически обновлять настоящую Политику конфиденциальности. Мы будем уведомлять зарегистрированных партнёров о существенных изменениях по электронной почте. Продолжение использования нашей платформы после публикации изменений означает принятие обновлённой политики.",
                "Bu Məxfilik Siyasətini vaxtaşırı yeniləyə bilərik. Qeydiyyatdan keçmiş tərəfdaşlara əhəmiyyətli dəyişikliklər barədə e-poçt vasitəsilə məlumat veriləcək."
              ),
            },
            {
              num: "9",
              title: tr("Contact Us", "Свяжитесь с нами", "Bizimlə əlaqə"),
              content: tr(
                "If you have any questions about this Privacy Policy or how we handle your data, please contact us: Email: ealyarov55@gmail.com · WhatsApp: +994 55 279 36 73 · Address: Baku, Azerbaijan. We are committed to resolving any privacy concerns promptly and transparently.",
                "Если у вас есть вопросы о настоящей Политике конфиденциальности или о том, как мы обрабатываем ваши данные, свяжитесь с нами: Email: ealyarov55@gmail.com · WhatsApp: +994 55 279 36 73 · Адрес: Баку, Азербайджан.",
                "Məxfilik siyasəti ilə bağlı suallarınız üçün: Email: ealyarov55@gmail.com · WhatsApp: +994 55 279 36 73 · Ünvan: Bakı, Azərbaycan."
              ),
            },
          ].map(section => (
            <div key={section.num} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, color: "#021a1a", fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #042e2e, #0a7070)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#2dd4bf", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{section.num}</span>
                {section.title}
              </h2>
              <p style={{ color: "#4a6060", fontSize: 14, lineHeight: 1.8, paddingLeft: 44 }}>{section.content}</p>
            </div>
          ))}

          {/* Footer note */}
          <div style={{ borderTop: "1px solid #e2eded", paddingTop: 24, marginTop: 8 }}>
            <p style={{ color: "#94a3a3", fontSize: 13, textAlign: "center" }}>
              © 2026 Caspian Routes DMC. {tr("All rights reserved.", "Все права защищены.", "Bütün hüquqlar qorunur.")}
            </p>
            <p style={{ color: "#94a3a3", fontSize: 12, textAlign: "center", marginTop: 8 }}>
              Baku, Azerbaijan · ealyarov55@gmail.com · +994 55 279 36 73
            </p>
          </div>
        </div>

        {/* Links */}
        <div style={{ textAlign: "center", marginTop: 32, display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/${locale}/terms`}
            style={{ color: "#0a7070", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
            {tr("Terms & Conditions", "Условия использования", "İstifadə şərtləri")} →
          </Link>
          <Link href={`/${locale}`}
            style={{ color: "#0a7070", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
            ← {tr("Back to Home", "На главную", "Ana səhifəyə qayıt")}
          </Link>
        </div>
      </div>
    </div>
  );
}