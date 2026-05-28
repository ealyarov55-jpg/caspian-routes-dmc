import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Caspian Routes — AI Travel Planner for Azerbaijan",
  description: "AI-powered travel planner for Azerbaijan. Build your personal itinerary in 2 minutes.",
  icons: {
  icon: "/favicon.png",
  apple: "/favicon.png",
},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}