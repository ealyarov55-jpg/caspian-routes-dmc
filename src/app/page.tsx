import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorks from "@/components/sections/HowItWorks";
import CuratedSection from "@/components/sections/CuratedSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <Navbar locale={locale} />
      <HeroSection locale={locale} />
      <HowItWorks />
      <CuratedSection />
      <WhyChooseUs />
    </main>
  );
}