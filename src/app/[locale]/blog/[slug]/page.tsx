import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import remarkGfm from "remark-gfm";

const BASE_URL = "https://www.caspian-routes.com";

function getPost(locale: string, slug: string) {
  const postsDir = path.join(process.cwd(), "content/posts", locale);
  const filePath = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
}

// Извлекает H2 заголовки и следующий за ними абзац для FAQPage schema
function extractFAQ(content: string): Array<{ question: string; answer: string }> {
  const lines = content.split("\n");
  const faq: Array<{ question: string; answer: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("## ")) {
      const question = line.replace(/^## /, "").trim();
      // Ищем следующий непустой абзац
      let answer = "";
      for (let j = i + 1; j < lines.length && j < i + 8; j++) {
        const next = lines[j].trim();
        if (next && !next.startsWith("#") && !next.startsWith(">") && !next.startsWith("-") && !next.startsWith("|")) {
          answer = next.replace(/\*\*/g, "").replace(/\*/g, "").slice(0, 200);
          break;
        }
      }
      if (question && answer) {
        faq.push({ question, answer });
      }
    }
  }
  return faq.slice(0, 8); // максимум 8 вопросов
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};
  const { data } = post;
  const url = `${BASE_URL}/${locale}/blog/${slug}`;
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      type: "article",
      url,
      title: data.title,
      description: data.description,
      images: data.image ? [{ url: `${BASE_URL}${data.image}`, width: 1200, height: 630, alt: data.title }] : [],
      publishedTime: data.date,
      locale: locale === "ru" ? "ru_RU" : locale === "az" ? "az_AZ" : "en_US",
      siteName: "Caspian Routes",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: data.image ? [`${BASE_URL}${data.image}`] : [],
    },
    alternates: { canonical: url },
  };
}

function PartnerCard({ icon, label, title, desc, btnText, href }: {
  icon: string; label: string; title: string; desc: string; btnText: string; href: string;
}) {
  return (
    <div className="partner-card">
      <div className="partner-card-icon">{icon}</div>
      <div className="partner-card-body">
        <div className="partner-card-label">{label}</div>
        <div className="partner-card-title">{title}</div>
        <div className="partner-card-desc">{desc}</div>
        <a className="partner-card-btn" href={href} target="_blank" rel="noopener noreferrer">
          {btnText} →
        </a>
      </div>
    </div>
  );
}

function CTABlock({
  title = "Готов планировать поездку?",
  desc = "Ответь на 5 вопросов — ИИ составит маршрут под твой бюджет и интересы. Бесплатно.",
  btnText = "Создать маршрут с ИИ",
  locale = "ru",
}: {
  title?: string; desc?: string; btnText?: string; locale?: string;
}) {
  return (
    <div className="cta-block">
      <h3>{title}</h3>
      <p>{desc}</p>
      <Link className="cta-block-btn" href={`/${locale}/planner`}>
        {btnText} →
      </Link>
    </div>
  );
}

function InfoBar({ children }: { children: React.ReactNode }) {
  return <div className="info-bar">{children}</div>;
}

function Checklist({ items }: { items: string[] }) {
  return (
    <div className="checklist">
      {items.map((item, i) => (
        <div key={i} className="checklist-item">{item}</div>
      ))}
    </div>
  );
}

const mdxComponents = { PartnerCard, CTABlock, InfoBar, Checklist };

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) notFound();
  const { data, content } = post;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    image: data.image ? `${BASE_URL}${data.image}` : undefined,
    datePublished: new Date(data.date).toISOString(),
dateModified: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    author: { "@type": "Organization", name: "Caspian Routes", url: BASE_URL },
    publisher: { "@type": "Organization", name: "Caspian Routes", url: BASE_URL },
    url: `${BASE_URL}/${locale}/blog/${slug}`,
  };

  const faqItems = extractFAQ(content);
  const faqSchema = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  } : null;

  return (
    <main style={{ background: "#021a1a", minHeight: "100vh" }}>
      <Navbar locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero фото */}
      {data.image && (
        <div style={{ maxWidth: 780, margin: "80px auto 0", padding: "0 24px" }}>
          <div style={{ borderRadius: 12, overflow: "hidden", height: 400 }}>
            <img
              src={data.image}
              alt={data.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>
      )}

      <article style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 80px" }}>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
            {new Date(data.date).toLocaleDateString(
              locale === "ru" ? "ru-RU" : "en-US",
              { year: "numeric", month: "long", day: "numeric" }
            )}
          </p>
          {data.tag && <span className="meta-badge">{data.tag}</span>}
          {data.updated && (
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>· Обновлено: {data.updated}</span>
          )}
          {data.currency && (
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>· {data.currency}</span>
          )}
        </div>

        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
          {data.title}
        </h1>

        {data.infobar && (
          <div className="info-bar">
            {data.infobar.map((item: string, i: number) => (
              <span key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </div>
        )}

        <div className="prose-content">
          <MDXRemote source={content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>

        <CTABlock locale={locale} />
      </article>

      <Footer locale={locale} />
    </main>
  );
}