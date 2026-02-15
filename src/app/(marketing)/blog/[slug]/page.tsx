// Page article de blog dynamique
// generateStaticParams + generateMetadata + JSON-LD Article + BreadcrumbList

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getArticleBySlug,
  getArticleComponent,
} from "@/content/blog";
import { BlogArticleLayout } from "@/components/blog/BlogArticle";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vigieweb.fr";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      url: `${BASE_URL}/blog/${article.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `${BASE_URL}/blog/${article.slug}`,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const loadComponent = getArticleComponent(slug);

  if (!article || !loadComponent) {
    notFound();
  }

  const { default: ArticleContent } = await loadComponent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd(article)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Accueil", url: BASE_URL },
              { name: "Blog", url: `${BASE_URL}/blog` },
              { name: article.title, url: `${BASE_URL}/blog/${article.slug}` },
            ])
          ),
        }}
      />
      <BlogArticleLayout article={article}>
        <ArticleContent />
      </BlogArticleLayout>
    </>
  );
}
