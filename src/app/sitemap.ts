import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE_URL = "https://www.caspian-routes.com";
const locales = ["ru", "en", "az"];

function getBlogSlugs(locale: string): string[] {
  const postsDir = path.join(process.cwd(), "content/posts", locale);
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(postsDir, f), "utf-8");
      const { data } = matter(raw);
      return data.slug || f.replace(".mdx", "");
    });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    routes.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });

    routes.push({
      url: `${BASE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    });

    const slugs = getBlogSlugs(locale);
    for (const slug of slugs) {
      routes.push({
        url: `${BASE_URL}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return routes;
}