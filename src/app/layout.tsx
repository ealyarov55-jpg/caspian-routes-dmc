import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Caspian Routes — AI Travel Planner for Azerbaijan",
  description: "AI-powered travel planner for Azerbaijan. Build your personal itinerary in 2 minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
      </head>
      <body>{children}</body>
    </html>
  );
}