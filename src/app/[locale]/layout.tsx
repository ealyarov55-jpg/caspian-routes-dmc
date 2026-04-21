import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}