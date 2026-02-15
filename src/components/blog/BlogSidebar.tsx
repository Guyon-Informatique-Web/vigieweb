// Sidebar pour les articles de blog
// Newsletter + articles connexes

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsletterForm } from "@/components/blog/NewsletterForm";
import type { BlogArticleMeta } from "@/content/blog";

interface BlogSidebarProps {
  relatedArticles: BlogArticleMeta[];
}

export function BlogSidebar({ relatedArticles }: BlogSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Newsletter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Recevez nos derniers articles et conseils sur le monitoring web.
          </p>
          <NewsletterForm source="blog" />
        </CardContent>
      </Card>

      {/* Articles connexes */}
      {relatedArticles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Articles connexes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {relatedArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    {article.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {article.readingTime} min de lecture
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </aside>
  );
}
