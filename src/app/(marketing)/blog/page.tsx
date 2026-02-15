// Page listing blog - Grille responsive d'articles
// SEO : meta title/description, JSON-LD

import type { Metadata } from "next";
import { getAllArticles } from "@/content/blog";
import { BlogCard } from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Blog - Guides et conseils monitoring web",
  description:
    "Articles et guides pratiques sur la surveillance de sites web, le monitoring uptime, les certificats SSL et la gestion des incidents.",
  openGraph: {
    title: "Blog Vigie Web - Guides monitoring web",
    description:
      "Articles et guides pratiques sur la surveillance de sites web.",
  },
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">
          Blog Vigie Web
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Guides pratiques et conseils pour surveiller vos sites web, gerer vos
          certificats SSL et reagir aux incidents.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <BlogCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
