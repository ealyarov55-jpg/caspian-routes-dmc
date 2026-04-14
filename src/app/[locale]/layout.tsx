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