import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import HowItWorks from "@/components/sections/HowItWorks";
import CuratedSection from "@/components/sections/CuratedSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Footer from "@/components/sections/Footer";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <Navbar locale={locale} />
      <HeroSection locale={locale} />
      <HowItWorks locale={locale} />
      <CuratedSection locale={locale} />
      <WhyChooseUs locale={locale} />
      <Footer locale={locale} />
    </main>
  );
}