"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
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
            {tr("Terms & Conditions", "Условия использования", "İstifadə şərtləri")}
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
              "These Terms and Conditions govern the use of Caspian Routes DMC services and platform. By accessing or using our services, you agree to be bound by these terms.",
              "Настоящие Условия использования регулируют использование услуг и платформы Caspian Routes DMC. Получая доступ к нашим услугам или используя их, вы соглашаетесь с настоящими условиями.",
              "Bu İstifadə Şərtləri Caspian Routes DMC xidmətlərinin və platformasının istifadəsini tənzimləyir."
            )}
          </p>

          {[
            {
              num: "1",
              title: tr("Services", "Услуги", "Xidmətlər"),
              content: tr(
                "Caspian Routes DMC provides B2B destination management services in Azerbaijan, including but not limited to: tour programs, guide and driver services, hotel accommodation, transfers, and MICE events. All services are provided to verified travel agencies and tour operators (Partners) under separate agreements.",
                "Caspian Routes DMC предоставляет B2B услуги управления дестинацией в Азербайджане, включая, помимо прочего: туристические программы, услуги гидов и водителей, размещение в отелях, трансферы и MICE мероприятия. Все услуги предоставляются проверенным турагентствам и туроператорам (Партнёрам) на основании отдельных соглашений.",
                "Caspian Routes DMC Azərbaycanda B2B destinasiya idarəetmə xidmətləri göstərir: tur proqramları, bələdçi və sürücü xidmətləri, otel yerləşdirməsi, transferlər və MICE tədbirləri."
              ),
            },
            {
              num: "2",
              title: tr("Partner Registration", "Регистрация партнёра", "Tərəfdaş qeydiyyatı"),
              content: tr(
                "Access to net prices and the partner portal is available only to verified travel agencies and tour operators. Registration requires submission of company information including company name, country of registration, and contact details. Caspian Routes DMC reserves the right to approve or reject partner applications at its sole discretion. Partners must provide accurate and complete information during registration.",
                "Доступ к net-ценам и партнёрскому порталу доступен только для проверенных турагентств и туроператоров. Регистрация требует предоставления информации о компании, включая название компании, страну регистрации и контактные данные. Caspian Routes DMC оставляет за собой право одобрять или отклонять заявки партнёров по своему усмотрению.",
                "Net qiymətlərə və tərəfdaş portalına giriş yalnız yoxlanılmış turizm agentlikləri üçün mövcuddur. Qeydiyyat şirkət adı, qeydiyyat ölkəsi və əlaqə məlumatlarını tələb edir."
              ),
            },
            {
              num: "3",
              title: tr("Pricing & Commissions", "Ценообразование и комиссии", "Qiymətlər və komissiyalar"),
              content: tr(
                "Net prices displayed in the partner portal are exclusive to verified partners and are confidential. Partners agree not to disclose net prices to third parties. Caspian Routes DMC pays a commission of 15% of the net value on confirmed bookings. Partners may set their own retail prices when selling to end clients. All prices are quoted in USD and may be displayed in other currencies for reference only — USD is the billing currency.",
                "Net-цены, отображаемые в партнёрском портале, предназначены исключительно для проверенных партнёров и являются конфиденциальными. Партнёры обязуются не раскрывать net-цены третьим лицам. Caspian Routes DMC выплачивает комиссию в размере 15% от net-стоимости подтверждённых бронирований. Партнёры могут устанавливать собственные розничные цены при продаже конечным клиентам. Все цены указаны в USD — USD является валютой выставления счетов.",
                "Tərəfdaş portalında göstərilən net qiymətlər məxfidir. Tərəfdaşlar net qiymətləri üçüncü şəxslərə açıqlamamağa razılaşır. Caspian Routes DMC təsdiqlənmiş rezervasiyaların net dəyərinin 15%-i həcmində komissiya ödəyir."
              ),
            },
            {
              num: "4",
              title: tr("Bookings & Cancellations", "Бронирования и отмены", "Rezervasiyalar və ləğvetmələr"),
              content: tr(
                "All booking requests are subject to availability and confirmation by Caspian Routes DMC. A booking is confirmed only after written confirmation from Caspian Routes DMC. Cancellation policies vary by service type and will be specified in individual booking confirmations. Cancellations made less than 48 hours before the service date may be subject to cancellation fees.",
                "Все запросы на бронирование зависят от наличия и подтверждения со стороны Caspian Routes DMC. Бронирование считается подтверждённым только после письменного подтверждения от Caspian Routes DMC. Политика отмены варьируется в зависимости от типа услуги и будет указана в индивидуальных подтверждениях бронирования. Отмены, сделанные менее чем за 48 часов до даты оказания услуги, могут облагаться штрафом за отмену.",
                "Bütün rezervasiya sorğuları Caspian Routes DMC tərəfindən mövcudluq və təsdiqdən asılıdır. Xidmət tarixindən 48 saatdan az müddət əvvəl edilən ləğvetmələr ləğvetmə haqqına cəlb edilə bilər."
              ),
            },
            {
              num: "5",
              title: tr("Payment Terms", "Условия оплаты", "Ödəniş şərtləri"),
              content: tr(
                "Payment terms are agreed upon individually with each partner. Standard payment terms require a deposit of 30% upon booking confirmation and the remaining balance 14 days before the service date. Commissions are paid to partners within 30 days after the completion of the service. All payments are processed in USD via bank transfer.",
                "Условия оплаты согласовываются индивидуально с каждым партнёром. Стандартные условия оплаты требуют внесения депозита в размере 30% при подтверждении бронирования и оставшегося баланса за 14 дней до даты оказания услуги. Комиссии выплачиваются партнёрам в течение 30 дней после завершения услуги.",
                "Ödəniş şərtləri hər bir tərəfdaşla fərdi razılaşdırılır. Standart şərtlər rezervasiya təsdiqində 30% depozit tələb edir. Komissiyalar xidmətin başa çatmasından 30 gün ərzində ödənilir."
              ),
            },
            {
              num: "6",
              title: tr("Confidentiality", "Конфиденциальность", "Məxfilik"),
              content: tr(
                "Partners agree to keep all net prices, business terms, and confidential information received from Caspian Routes DMC strictly confidential. This obligation survives the termination of any partnership agreement. Partners may not share login credentials or portal access with unauthorized third parties.",
                "Партнёры обязуются сохранять строгую конфиденциальность всех net-цен, коммерческих условий и конфиденциальной информации, полученной от Caspian Routes DMC. Это обязательство сохраняется после расторжения любого партнёрского соглашения.",
                "Tərəfdaşlar Caspian Routes DMC-dən alınan bütün net qiymətlərini, ticarət şərtlərini və məxfi məlumatları ciddi məxfi saxlamağa razılaşır."
              ),
            },
            {
              num: "7",
              title: tr("Limitation of Liability", "Ограничение ответственности", "Məsuliyyətin məhdudlaşdırılması"),
              content: tr(
                "Caspian Routes DMC shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our liability is limited to the value of the specific service that gave rise to the claim. Caspian Routes DMC is not responsible for force majeure events including but not limited to natural disasters, political unrest, or pandemic-related restrictions.",
                "Caspian Routes DMC не несёт ответственности за косвенный, случайный или косвенный ущерб, возникший в результате использования наших услуг. Наша ответственность ограничена стоимостью конкретной услуги, ставшей причиной претензии.",
                "Caspian Routes DMC dolayı, təsadüfi və ya nəticəvi zərərlərdən məsuliyyət daşımır. Məsuliyyətimiz iddiaya səbəb olan xüsusi xidmətin dəyəri ilə məhdudlaşır."
              ),
            },
            {
              num: "8",
              title: tr("Intellectual Property", "Интеллектуальная собственность", "Əqli mülkiyyət"),
              content: tr(
                "All content on the Caspian Routes DMC platform, including but not limited to text, images, logos, and software, is the property of Caspian Routes DMC or its licensors. Marketing materials provided to partners may be used solely for the purpose of promoting Caspian Routes DMC services to end clients.",
                "Весь контент на платформе Caspian Routes DMC, включая, помимо прочего, тексты, изображения, логотипы и программное обеспечение, является собственностью Caspian Routes DMC или её лицензиаров. Маркетинговые материалы, предоставляемые партнёрам, могут использоваться исключительно для продвижения услуг Caspian Routes DMC.",
                "Caspian Routes DMC platformasındakı bütün məzmun şirkətin mülkiyyətidir. Tərəfdaşlara verilən marketinq materialları yalnız Caspian Routes DMC xidmətlərini tanıtmaq üçün istifadə edilə bilər."
              ),
            },
            {
              num: "9",
              title: tr("Governing Law", "Применимое право", "Tətbiq olunan hüquq"),
              content: tr(
                "These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of Azerbaijan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Baku, Azerbaijan.",
                "Настоящие Условия использования регулируются и толкуются в соответствии с законодательством Азербайджанской Республики. Любые споры, возникающие из настоящих условий, подлежат исключительной юрисдикции судов Баку, Азербайджан.",
                "Bu Şərtlər Azərbaycan Respublikasının qanunlarına uyğun tənzimlənir. Bu şərtlərdən irəli gələn mübahisələr Bakı məhkəmələrinin yurisdiksiyasına tabedir."
              ),
            },
            {
              num: "10",
              title: tr("Contact", "Контакт", "Əlaqə"),
              content: tr(
                "For questions regarding these Terms and Conditions, please contact us at ealyarov55@gmail.com or via WhatsApp at +994 55 279 36 73.",
                "По вопросам, касающимся настоящих Условий использования, свяжитесь с нами по адресу ealyarov55@gmail.com или через WhatsApp по номеру +994 55 279 36 73.",
                "Bu Şərtlərə dair suallar üçün ealyarov55@gmail.com ünvanına və ya +994 55 279 36 73 nömrəsinə WhatsApp vasitəsilə müraciət edin."
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

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href={`/${locale}`}
            style={{ color: "#0a7070", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
            ← {tr("Back to Home", "На главную", "Ana səhifəyə qayıt")}
          </Link>
        </div>
      </div>
    </div>
  );
}