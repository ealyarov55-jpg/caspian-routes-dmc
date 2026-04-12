import TourCard, { Tour } from "@/components/ui/TourCard";

const tours: Tour[] = [
  {
    id: "baku-city-tour",
    title: "Baku City Tour",
    subtitle: "Baku, Azerbaijan",
    image: "/images/pexels-arzu-ibaeva-479643718-16976814.jpg",
    duration: "3 days",
    price: 1000,
    tag: "Popular",
  },
  {
    id: "absheron-peninsula",
    title: "Absheron Peninsula",
    subtitle: "Fire Temple & Mud Volcanoes",
    image: "/images/pexels-rahibyaqubov-17050728.jpg",
    duration: "2 days",
    price: 450,
    tag: "New",
  },
  {
    id: "sheki-silk-road",
    title: "Sheki & Silk Road",
    subtitle: "Ancient Caravanserais",
    image: "/images/pexels-sultan-jafarov-475048977-18207490.jpg",
    duration: "4 days",
    price: 700,
  },
  {
    id: "caspian-sea-cruise",
    title: "Caspian Sea Cruise",
    subtitle: "Baku Bay & Caspian Coast",
    image: "/images/pexels-zulfugarkarimov-34686330.jpg",
    duration: "5 days",
    price: 1200,
    tag: "Premium",
  },
];

export default function CuratedSection() {
  return (
    <section className="py-24 px-6" style={{ background: "#f0f7f7" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p style={{ color: "#0a7070", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12, fontFamily: "DM Sans, sans-serif" }}>
              Handpicked for you
            </p>
            <h2 className="font-serif" style={{ color: "#021a1a", fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>
              Curated Experiences
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #0a7070", color: "#0a7070", background: "transparent", cursor: "pointer", fontSize: 16 }}>←</button>
            <button style={{ width: 40, height: 40, borderRadius: "50%", background: "#0a7070", color: "white", border: "none", cursor: "pointer", fontSize: 16 }}>→</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/routes" style={{ color: "#0a7070", fontSize: 14, fontFamily: "DM Sans, sans-serif", fontWeight: 500, textDecoration: "none", borderBottom: "1px solid rgba(10,112,112,0.4)", paddingBottom: 2 }}>
            View all routes →
          </a>
        </div>
      </div>
    </section>
  );
}