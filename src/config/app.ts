// Configuration generale de l'application
// Centralise le nom et les URLs pour faciliter un eventuel changement

export const APP_CONFIG = {
  name: "Vigie Web",
  slug: "vigieweb",
  slogan: "La sentinelle de vos sites internet",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  email: {
    from: process.env.EMAIL_FROM || "noreply@vigieweb.fr",
    support: "support@vigieweb.fr",
  },
  company: {
    name: "Guyon Informatique & Web",
    type: "Micro-entreprise",
    address: "",
    siret: "",
  },
  social: {
    twitter: "",
    linkedin: "",
    github: "",
  },
} as const;
