import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import CuratedSection from "@/components/sections/CuratedSection";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <Navbar locale={locale} />
      <HeroSection locale={locale} />
      <CuratedSection />
    </main>
  );
}