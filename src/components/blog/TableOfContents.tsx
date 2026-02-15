// Table des matieres sticky pour les articles de blog
// Genere a partir des h2 du contenu

"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // Extraire les h2 et h3 de l'article
    const article = document.querySelector("[data-article]");
    if (!article) return;

    const headings = article.querySelectorAll("h2, h3");
    const tocItems: TocItem[] = [];

    headings.forEach((heading) => {
      // Generer un ID si absent
      if (!heading.id) {
        heading.id = heading.textContent
          ?.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "";
      }

      tocItems.push({
        id: heading.id,
        text: heading.textContent || "",
        level: heading.tagName === "H2" ? 2 : 3,
      });
    });

    setItems(tocItems);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <h4 className="mb-3 text-sm font-semibold">Sommaire</h4>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${item.id}`}
              className={`block py-1 transition-colors hover:text-foreground ${
                activeId === item.id
                  ? "font-medium text-indigo-600 dark:text-indigo-400"
                  : "text-muted-foreground"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
