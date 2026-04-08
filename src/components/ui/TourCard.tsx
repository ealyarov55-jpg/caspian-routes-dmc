"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export interface Tour {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  duration: string;
  price: number;
  tag?: string;
}

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <div className="card-hover rounded-2xl overflow-hidden bg-white flex flex-col"
      style={{ boxShadow: "0 4px 24px rgba(4,46,46,0.10)" }}>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "210px" }}>
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(2,26,26,0.75) 0%, transparent 60%)"
        }} />
        {tour.tag && (
          <span style={{
            position: "absolute", top: 12, left: 12,
            background: "#c9a84c", color: "white",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "4px 12px", borderRadius: 999,
          }}>
            {tour.tag}
          </span>
        )}
        <div style={{
          position: "absolute", bottom: 12, left: 12,
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          borderRadius: 999, padding: "4px 12px",
        }}>
          <Clock size={12} color="#2dd4bf" />
          <span style={{ color: "white", fontSize: 12 }}>{tour.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{
          color: "#0a7070", fontSize: 11, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4,
          fontFamily: "DM Sans, sans-serif"
        }}>
          {tour.subtitle}
        </p>
        <h3 style={{
          fontFamily: "Cormorant Garamond, serif",
          color: "#0d1f1f", fontSize: 20, fontWeight: 600,
          lineHeight: 1.2, marginBottom: 16,
        }}>
          {tour.title}
        </h3>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ color: "#94a3a3", fontSize: 11, fontFamily: "DM Sans, sans-serif" }}>From</span>
            <p style={{ fontFamily: "Cormorant Garamond, serif", color: "#021a1a", fontSize: 24, fontWeight: 700 }}>
              ${tour.price.toLocaleString()}
            </p>
          </div>
          <Link
            href={`/routes/${tour.id}`}
            className="flex items-center gap-1.5 text-white text-xs font-medium rounded-xl transition-colors duration-200 hover:bg-[#0a7070]"
            style={{
              background: "#042e2e",
              padding: "10px 16px",
              textDecoration: "none",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Explore Route <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}