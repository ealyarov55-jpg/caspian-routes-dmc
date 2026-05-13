"use client";

import { useEffect, useRef, useState } from "react";

// Fade-in при скролле
export function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// Счётчик
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else { setCount(Math.floor(current)); }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Секция со статистикой
export function StatsSection({ stats }: {
  stats: Array<{ value: number; suffix: string; label: string }>
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 1,
      background: "rgba(255,255,255,0.06)",
      borderRadius: 16,
      overflow: "hidden",
      margin: "0 0 80px",
    }}>
      {stats.map((stat, i) => (
        <FadeIn key={i} delay={i * 100}>
          <div style={{
            padding: "32px 24px",
            textAlign: "center",
            background: "rgba(2,26,26,0.8)",
            borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}>
            <div style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#2DD4BF",
              fontWeight: 300,
              lineHeight: 1,
              marginBottom: 8,
            }}>
              <Counter target={stat.value} suffix={stat.suffix} />
            </div>
            <div style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              fontFamily: "DM Sans, sans-serif",
              letterSpacing: "0.02em",
            }}>
              {stat.label}
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// Why cards с анимацией
export function WhyCards({ items }: {
  items: Array<{ icon: string; title: string; desc: string }>
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
      {items.map((item, i) => (
        <FadeIn key={i} delay={i * 120}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "28px 24px",
            height: "100%",
            transition: "border-color 0.3s ease, transform 0.3s ease",
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(45,212,191,0.3)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
            <h3 style={{ color: "white", fontSize: 17, fontWeight: 500, marginBottom: 10, fontFamily: "DM Sans, sans-serif" }}>{item.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, fontFamily: "DM Sans, sans-serif" }}>{item.desc}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// Blog cards с анимацией
export function BlogCards({ children }: { children: React.ReactNode }) {
  return (
    <FadeIn delay={100}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {children}
      </div>
    </FadeIn>
  );
}