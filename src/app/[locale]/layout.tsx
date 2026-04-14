import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "../globals.css";

export const metadata: Metadata = {
  title: "Caspian Routes DMC",
  description: "Your DMC Partner for Unforgettable Journeys",
};

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