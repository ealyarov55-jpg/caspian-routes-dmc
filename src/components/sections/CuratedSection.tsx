import TourCard, { Tour } from "@/components/ui/TourCard";
import { getT } from "@/lib/i18n";

const tours: Tour[] = [
  {
    id: "sheki-silk-road",
    title: "Sheki & Silk Road",
    subtitle: "Mountains & Ancient Forests",
    image: "/images/pexels-arzu-ibaeva-479643718-16976814-opt.jpg",
    duration: "3 days",
    price: 700,
  },
  {
    id: "caucasus-nature",
    title: "Caucasus Nature Trek",
    subtitle: "Forests & Mountain Villages",
    image: "/images/pexels-rahibyaqubov-17050728-opt.jpg",
    duration: "2 days",
    price: 450,
    tag: "New",
  },
  {
    id: "baku-city-tour",
    title: "Baku City Tour",
    subtitle: "Baku Boulevard & Old City",
    image:"/images/pexels-sultan-jafarov-475048977-18207490-opt.jpg",
    duration: "1-3 days",
    price: 300,
    tag: "Popular",
  },
  {
    id: "caspian-sea-cruise",
    title: "Caspian Sea Cruise",
    subtitle: "Baku Bay & Caspian Coast",
    image: "/images/pexels-zulfugarkarimov-34686330-opt.jpg",
    duration: "5 days",
    price: 1200,
    tag: "Premium",
  },
];

export default function CuratedSection({ locale = "en" }: { locale?: string }) {
  const t = getT(locale);

  return (
    <section className="py-24 px-6" style={{ background: "#f0f7f7" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p style={{ color: "#0a7070", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12, fontFamily: "DM Sans, sans-serif" }}>
              {t.curated.tag}
            </p>
            <h2 className="font-serif" style={{ color: "#021a1a", fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>
              {t.curated.title}
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #0a7070", color: "#0a7070", background: "transparent", cursor: "pointer", fontSize: 16 }}>←</button>
            <button style={{ width: 40, height: 40, borderRadius: "50%", background: "#0a7070", color: "white", border: "none", cursor: "pointer", fontSize: 16 }}>→</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} locale={locale} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a href={`/${locale}/routes`} style={{ color: "#0a7070", fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, textDecoration: "none", borderBottom: "1px solid rgba(10,112,112,0.4)", paddingBottom: 2 }}>
            {t.curated.viewAll} →
          </a>
        </div>
      </div>
    </section>
  );
}