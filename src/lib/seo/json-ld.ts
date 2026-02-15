// Utilitaires JSON-LD pour le SEO structure
// Genere les schemas Schema.org pour chaque type de page

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vigieweb.fr";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vigie Web",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Vigie Web surveille la disponibilite, le SSL et les domaines de vos sites web. Alertes instantanees pour freelances et agences.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@vigieweb.fr",
      contactType: "customer support",
      availableLanguage: "French",
    },
    sameAs: [],
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Vigie Web",
    url: BASE_URL,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    description:
      "Service de monitoring de sites web pour freelances et agences. Surveillance uptime, SSL et domaine avec alertes email et Discord.",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        name: "Gratuit",
        description: "1 site surveille, verification toutes les 30 minutes",
      },
      {
        "@type": "Offer",
        price: "9.99",
        priceCurrency: "EUR",
        name: "Pro",
        description: "10 sites surveilles, verification toutes les 5 minutes",
      },
      {
        "@type": "Offer",
        price: "29.99",
        priceCurrency: "EUR",
        name: "Agence",
        description: "50 sites surveilles, verification toutes les minutes",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "50",
    },
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

interface ArticleMeta {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
}

export function articleJsonLd(article: ArticleMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${BASE_URL}/blog/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.author || "Vigie Web",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Vigie Web",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${article.slug}`,
    },
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface PlanInfo {
  name: string;
  price: number;
  description: string;
  features: string[];
}

export function productJsonLd(plan: PlanInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Vigie Web ${plan.name}`,
    description: plan.description,
    brand: {
      "@type": "Organization",
      name: "Vigie Web",
    },
    offers: {
      "@type": "Offer",
      price: plan.price.toString(),
      priceCurrency: "EUR",
      priceValidUntil: new Date(
        new Date().getFullYear() + 1,
        11,
        31
      ).toISOString(),
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/pricing`,
    },
  };
}
