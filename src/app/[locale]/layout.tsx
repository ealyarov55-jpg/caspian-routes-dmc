import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ToastContainer } from "@/components/ui/Toast";
import "../globals.css";

const metadata_translations = {
  en: {
    title: "Caspian Routes DMC | B2B Travel Partner in Azerbaijan",
    description: "B2B DMC for tour operators and travel agencies. Net prices, local guides, drivers and hotels across Azerbaijan. Partner with us to earn commission.",
    keywords: "Azerbaijan DMC, B2B travel Azerbaijan, tour operator Azerbaijan, net prices Azerbaijan, local guides Baku, Azerbaijan travel agency",
  },
  ru: {
    title: "Caspian Routes DMC | B2B Партнёр в Азербайджане",
    description: "B2B DMC для туроператоров и турагентств. Net-цены на гидов, водителей и отели по Азербайджану. Станьте партнёром и получайте комиссию.",
    keywords: "DMC Азербайджан, B2B туризм Азербайджан, туроператор Азербайджан, нет цены Азербайджан, гиды Баку, турагентство Азербайджан",
  },
  az: {
    title: "Caspian Routes DMC | Azərbaycanda B2B Tərəfdaş",
    description: "Tur operatorları üçün B2B DMC. Azərbaycanda bələdçilər, sürücülər və otellərə net qiymətlər. Tərəfdaş olun və komissiya qazanın.",
    keywords: "Azərbaycan DMC, B2B turizm Azərbaycan, tur operatoru Azərbaycan, net qiymətlər, bələdçilər Bakı",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const lang = (locale === "ru" || locale === "az") ? locale : "en";
  const meta = metadata_translations[lang as keyof typeof metadata_translations];

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "Caspian Routes DMC" }],
    creator: "Caspian Routes DMC",
    publisher: "Caspian Routes DMC",
    robots: "index, follow",
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : locale === "az" ? "az_AZ" : "en_US",
      url: `https://caspian-routes.vercel.app/${locale}`,
      siteName: "Caspian Routes DMC",
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: "https://caspian-routes.vercel.app/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg",
          width: 1200,
          height: 630,
          alt: "Caspian Routes DMC - Azerbaijan Travel",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["https://caspian-routes.vercel.app/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg"],
    },
    alternates: {
      canonical: `https://caspian-routes.vercel.app/${locale}`,
      languages: {
        "en": "https://caspian-routes.vercel.app/en",
        "ru": "https://caspian-routes.vercel.app/ru",
        "az": "https://caspian-routes.vercel.app/az",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <head>
        <meta name="google-site-verification" content="R5qPPlNoG4TA-zvddXVnS47DsbLHO4oQ_yG-rr32RXw" />
        <link rel="preload" as="image" href="/images/maxxja-baku-1997163_1920.jpg" />
        <link rel="preload" as="image" href="/images/maxxja-baku-1997163_1920-opt.jpg" />
        <link rel="preload" as="image" href="/images/pexels-zulfugarkarimov-33085326-opt.jpg" />
        <link rel="preload" as="image" href="/images/pozziss-azerbaijan-4856054_1920-opt.jpg" />
        <link rel="preload" as="image" href="/images/pexels-arzu-ibaeva-479643718-16976814-opt.jpg" />
        <link rel="preload" as="image" href="/images/pexels-rahibyaqubov-17050728-opt.jpg" />
        <link rel="preload" as="image" href="/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg" />
        <link rel="preload" as="image" href="/images/pexels-zulfugarkarimov-34686330-opt.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ overflowX: "hidden", margin: 0, padding: 0, background: "#021a1a" }}>
        <AuthProvider>
          <CurrencyProvider>
            {children}
            <ToastContainer />
          </CurrencyProvider>
        </AuthProvider>
        <a
          href="https://wa.me/994552793673"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 999,
            width: 56, height: 56, borderRadius: "50%",
            background: "#25D366",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(37,211,102,0.4)",
            textDecoration: "none",
            transition: "all 0.3s",
          }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </body>
    </html>
  );
}