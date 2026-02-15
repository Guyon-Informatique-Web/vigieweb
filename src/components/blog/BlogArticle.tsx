// Layout d'un article de blog
// Contenu principal + sidebar

import { Calendar, Clock } from "lucide-react";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { TableOfContents } from "@/components/blog/TableOfContents";
import type { BlogArticleMeta } from "@/content/blog";
import { getRelatedArticles } from "@/content/blog";

interface BlogArticleLayoutProps {
  article: BlogArticleMeta;
  children: React.ReactNode;
}

export function BlogArticleLayout({
  article,
  children,
}: BlogArticleLayoutProps) {
  const relatedArticles = getRelatedArticles(article.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* En-tete article */}
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {article.readingTime} min de lecture
          </span>
        </div>
      </header>

      {/* Contenu + sidebar */}
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <div data-article>{children}</div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <TableOfContents />
            <BlogSidebar relatedArticles={relatedArticles} />
          </div>
        </div>
      </div>
    </div>
  );
}
