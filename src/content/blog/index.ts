// Registre des articles de blog
// Centralise les metadonnees et les composants des articles

import type { ComponentType } from "react";

export interface BlogArticleMeta {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number; // en minutes
}

export interface BlogArticle extends BlogArticleMeta {
  component: ComponentType;
}

const articleMetas: BlogArticleMeta[] = [
  {
    slug: "surveiller-site-web",
    title: "Comment surveiller son site web efficacement en 2026",
    description:
      "Decouvrez les methodes et outils pour surveiller votre site web : uptime, SSL, performance. Guide complet pour freelances et agences.",
    keywords: [
      "surveiller site web",
      "monitoring website",
      "surveillance site internet",
      "uptime monitoring",
    ],
    publishedAt: "2026-02-15",
    readingTime: 8,
  },
  {
    slug: "monitoring-site-web-gratuit",
    title: "Monitoring de site web gratuit : guide complet",
    description:
      "Comment surveiller gratuitement la disponibilite de vos sites web. Comparatif des solutions de monitoring gratuit en 2026.",
    keywords: [
      "monitoring gratuit",
      "surveillance site gratuit",
      "monitoring site web gratuit",
      "outil monitoring gratuit",
    ],
    publishedAt: "2026-02-15",
    readingTime: 7,
  },
  {
    slug: "verifier-certificat-ssl-expiration",
    title: "Verifier l'expiration d'un certificat SSL : guide pratique",
    description:
      "Comment verifier la date d'expiration de votre certificat SSL et eviter les interruptions. Methodes manuelles et automatiques.",
    keywords: [
      "certificat ssl expiration",
      "ssl expire",
      "verifier ssl",
      "renouveler certificat ssl",
    ],
    publishedAt: "2026-02-15",
    readingTime: 6,
  },
  {
    slug: "alerte-site-hors-ligne",
    title: "Site hors ligne : detecter et reagir rapidement",
    description:
      "Que faire quand votre site est hors ligne ? Comment detecter une panne rapidement et mettre en place des alertes automatiques.",
    keywords: [
      "alerte site hors ligne",
      "site down",
      "site inaccessible",
      "panne site web",
    ],
    publishedAt: "2026-02-15",
    readingTime: 7,
  },
  {
    slug: "page-statut-site-web",
    title: "Page de statut pour votre site web : le guide complet",
    description:
      "Pourquoi et comment creer une page de statut publique pour vos sites web. Transparence, confiance client et gestion des incidents.",
    keywords: [
      "page statut",
      "status page",
      "uptime page",
      "page disponibilite site",
    ],
    publishedAt: "2026-02-15",
    readingTime: 7,
  },
];

// Import dynamique des composants articles
const articleComponents: Record<string, () => Promise<{ default: ComponentType }>> = {
  "surveiller-site-web": () => import("./surveiller-site-web"),
  "monitoring-site-web-gratuit": () => import("./monitoring-site-web-gratuit"),
  "verifier-certificat-ssl-expiration": () => import("./verifier-certificat-ssl-expiration"),
  "alerte-site-hors-ligne": () => import("./alerte-site-hors-ligne"),
  "page-statut-site-web": () => import("./page-statut-site-web"),
};

export function getAllArticles(): BlogArticleMeta[] {
  return articleMetas.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): BlogArticleMeta | undefined {
  return articleMetas.find((a) => a.slug === slug);
}

export function getArticleComponent(slug: string) {
  return articleComponents[slug];
}

export function getRelatedArticles(
  currentSlug: string,
  limit = 3
): BlogArticleMeta[] {
  return articleMetas
    .filter((a) => a.slug !== currentSlug)
    .slice(0, limit);
}
