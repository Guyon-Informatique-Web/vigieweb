// Card article pour le listing blog
// Titre, description, date, temps de lecture

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import type { BlogArticleMeta } from "@/content/blog";

interface BlogCardProps {
  article: BlogArticleMeta;
}

export function BlogCard({ article }: BlogCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readingTime} min de lecture
            </span>
          </div>
          <h3 className="mb-2 text-lg font-semibold leading-tight">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
