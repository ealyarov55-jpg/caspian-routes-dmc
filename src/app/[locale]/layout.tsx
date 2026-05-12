import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ToastContainer } from "@/components/ui/Toast";
import "../globals.css";

const metadata_translations = {
  en: {
    title: "Caspian Routes | AI Travel Planner for Azerbaijan",
    description: "Plan your perfect trip to Azerbaijan with AI. Get personalized itineraries, hotel recommendations, and book tours in seconds.",
    keywords: "Azerbaijan travel planner, AI itinerary Azerbaijan, Baku travel guide, Azerbaijan tourism, Caucasus travel",
  },
  ru: {
    title: "Caspian Routes | AI-планировщик путешествий по Азербайджану",
    description: "Спланируй идеальное путешествие в Азербайджан с помощью ИИ. Персональные маршруты, отели и экскурсии за 2 минуты.",
    keywords: "планировщик путешествий Азербайджан, маршрут Баку, туризм Азербайджан, AI маршрут Кавказ, что посмотреть в Баку",
  },
  az: {
    title: "Caspian Routes | Azərbaycana AI Səyahət Planlayıcısı",
    description: "AI ilə Azərbaycana mükəmməl səyahətinizi planlaşdırın. Fərdi marşrutlar, otellər və turlar 2 dəqiqəyə.",
    keywords: "Azərbaycan səyahət planlayıcısı, Bakı gəzinti, Azərbaycan turizmi, AI marşrut",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = (locale === "ru" || locale === "az") ? locale : "en";
  const meta = metadata_translations[lang as keyof typeof metadata_translations];
  const BASE_URL = "https://www.caspian-routes.com";

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: "Caspian Routes" }],
    creator: "Caspian Routes",
    publisher: "Caspian Routes",
    robots: "index, follow",
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : locale === "az" ? "az_AZ" : "en_US",
      url: `${BASE_URL}/${locale}`,
      siteName: "Caspian Routes",
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: `${BASE_URL}/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg`,
          width: 1200,
          height: 630,
          alt: "Caspian Routes - Azerbaijan Travel Planner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${BASE_URL}/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg`],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        ru: `${BASE_URL}/ru`,
        az: `${BASE_URL}/az`,
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
        {/* Travelpayouts виджет удалён */}
        <script
          async
          defer
          src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
          data-gyg-partner-id="YNRQ0A3"
        />
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
      </body>
    </html>
  );
}