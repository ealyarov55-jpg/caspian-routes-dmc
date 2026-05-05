import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

function getPost(locale: string, slug: string) {
  const postsDir = path.join(process.cwd(), "content/posts", locale);
  const filePath = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
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

  return (
    <main style={{ maxWidth: 780, margin: "0 auto", padding: "80px 24px" }}>
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
      <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 17, lineHeight: 1.8 }} className="prose-content">
        <MDXRemote source={content} />
      </div>
    </main>
  );
}