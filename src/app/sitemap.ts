import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://caspian-routes.vercel.app";
  const locales = ["en", "ru", "az"];
  const routes = [
    "",
    "/routes",
    "/about",
    "/contact",
    "/partners",
    "/routes/baku-city-tour",
    "/routes/absheron-peninsula",
    "/routes/sheki-silk-road",
    "/routes/caspian-sea-cruise",
    "/routes/caucasus-nature",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : route === "/partners" ? 0.9 : route.startsWith("/routes/") ? 0.8 : 0.7,
      });
    }
  }

  return entries;
}