import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

function getPosts(locale: string): Post[] {
  const postsDir = path.join(process.cwd(), "content/posts", locale);
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug: data.slug || file.replace(".mdx", ""),
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      image: data.image || "",
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = getPosts(locale);

  const title = locale === "ru"
    ? "Путеводитель по Азербайджану"
    : locale === "az"
    ? "Azerbaycan Beledcisi"
    : "Azerbaijan Travel Guide";

  const subtitle = locale === "ru"
    ? "Marshruty, sovety i rekomendacii dlya puteshestvennikov"
    : "Routes, tips and recommendations for travelers";

  const empty = locale === "ru" ? "Stati skoro poyavyatsya" : "Posts coming soon";

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px" }}>
      <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "white", fontWeight: 300, marginBottom: 16 }}>
        {title}
      </h1>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 48 }}>
        {subtitle}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} style={{ textDecoration: "none" }}>
            <article style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              overflow: "hidden",
              transition: "border-color 0.3s",
            }}>
              {post.image && (
                <div style={{ height: 180, overflow: "hidden" }}>
                  <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div style={{ padding: "20px 24px" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 8 }}>
                  {new Date(post.date).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.3rem", color: "white", fontWeight: 400, marginBottom: 10, lineHeight: 1.3 }}>
                  {post.title}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>
                  {post.description}
                </p>
              </div>
            </article>
          </Link>
        ))}
        {posts.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.4)" }}>{empty}</p>
        )}
      </div>
    </main>
  );
}