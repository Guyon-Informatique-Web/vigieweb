// Definition des plans tarifaires Vigie Web
// Les stripePriceId sont a remplir apres creation dans le dashboard Stripe

export const PLANS = {
  FREE: {
    name: "Gratuit",
    price: 0,
    stripePriceId: null,
    limits: {
      maxSites: 1,
      checkInterval: 30,
      retentionDays: 7,
      notifications: ["email"] as const,
      reports: false,
      customAlerts: false,
    },
    features: [
      "1 site surveille",
      "Verification toutes les 30 min",
      "Historique 7 jours",
      "Alertes email",
      "Monitoring uptime + SSL",
    ],
  },
  PRO: {
    name: "Pro",
    price: 9.99,
    yearlyPrice: 99.99,
    stripePriceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
    stripePriceIdYearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
    limits: {
      maxSites: 10,
      checkInterval: 5,
      retentionDays: 90,
      notifications: ["email", "discord"] as const,
      reports: true,
      customAlerts: true,
    },
    features: [
      "10 sites surveilles",
      "Verification toutes les 5 min",
      "Historique 90 jours",
      "Alertes email + Discord",
      "Rapports PDF mensuels",
      "Seuils d'alerte personnalisables",
      "Monitoring SSL + domaine",
    ],
  },
  AGENCY: {
    name: "Agence",
    price: 29.99,
    yearlyPrice: 299.99,
    stripePriceIdMonthly: process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID || "",
    stripePriceIdYearly: process.env.STRIPE_AGENCY_YEARLY_PRICE_ID || "",
    limits: {
      maxSites: 50,
      checkInterval: 1,
      retentionDays: 365,
      notifications: ["email", "discord"] as const,
      reports: true,
      customAlerts: true,
    },
    features: [
      "50 sites surveilles",
      "Verification toutes les minutes",
      "Historique 1 an",
      "Alertes email + Discord",
      "Rapports PDF personnalises",
      "Seuils d'alerte personnalisables",
      "Support prioritaire",
      "Marque blanche (a venir)",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;
