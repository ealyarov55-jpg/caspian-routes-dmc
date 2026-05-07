import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";

const BASE_URL = "https://www.caspian-routes.com";

function getPost(locale: string, slug: string) {
  const postsDir = path.join(process.cwd(), "content/posts", locale);
  const filePath = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
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
    alternates: {
      canonical: url,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) notFound();

  const { data, content } = post;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "image": data.image ? `${BASE_URL}${data.image}` : undefined,
    "datePublished": data.date,
    "dateModified": data.date,
    "author": {
      "@type": "Organization",
      "name": "Caspian Routes",
      "url": BASE_URL,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Caspian Routes",
      "url": BASE_URL,
    },
    "url": `${BASE_URL}/${locale}/blog/${slug}`,
  };

  return (
    <main style={{ background: "#021a1a", minHeight: "100vh" }}>
      <Navbar locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article style={{ maxWidth: 780, margin: "0 auto", padding: "100px 24px 80px" }}>
        {data.image && (
          <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 40, height: 400 }}>
            <img src={data.image} alt={data.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 16 }}>
          {new Date(data.date).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", fontWeight: 300, marginBottom: 32, lineHeight: 1.2 }}>
          {data.title}
        </h1>
        <div className="prose-content">
          <MDXRemote source={content} />
        </div>
      </article>
      <Footer locale={locale} />
    </main>
  );
}