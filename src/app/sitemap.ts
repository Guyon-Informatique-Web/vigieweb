// Sitemap dynamique pour le SEO
// Inclut les pages statiques, articles blog et pages de statut actives

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getAllArticles } from "@/content/blog";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vigieweb.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cgu`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cgv`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Articles blog
  const articles = getAllArticles();
  const blogPages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Pages de statut publiques actives
  let statusPages: MetadataRoute.Sitemap = [];
  try {
    const activeStatusPages = await prisma.user.findMany({
      where: {
        statusPageEnabled: true,
        statusSlug: { not: null },
      },
      select: { statusSlug: true, updatedAt: true },
    });

    statusPages = activeStatusPages
      .filter((u) => u.statusSlug)
      .map((u) => ({
        url: `${BASE_URL}/status/${u.statusSlug}`,
        lastModified: u.updatedAt,
        changeFrequency: "hourly" as const,
        priority: 0.5,
      }));
  } catch {
    // BDD non disponible au build (mode statique)
  }

  return [...staticPages, ...blogPages, ...statusPages];
}
