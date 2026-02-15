// Landing page Vigie Web
// Hero, Comment ca marche, Fonctionnalites, Pricing, FAQ, Newsletter

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  Activity,
  Bell,
  Clock,
  Globe,
  Lock,
  Zap,
  BarChart3,
  ArrowRight,
  Check,
} from "lucide-react";
import { PLANS } from "@/config/plans";
import { NewsletterSection } from "@/components/shared/NewsletterSection";
import { faqPageJsonLd } from "@/lib/seo/json-ld";

// Fonctionnalites principales
const features = [
  {
    icon: Activity,
    title: "Monitoring uptime",
    description:
      "Verifiez que vos sites repondent correctement, detectez les pannes en quelques minutes.",
  },
  {
    icon: Lock,
    title: "Surveillance SSL",
    description:
      "Soyez alerte avant l'expiration de vos certificats SSL. Plus de mauvaises surprises.",
  },
  {
    icon: Globe,
    title: "Expiration domaine",
    description:
      "Surveillez la date d'expiration de vos noms de domaine et renouvelez a temps.",
  },
  {
    icon: Bell,
    title: "Alertes instantanees",
    description:
      "Recevez des notifications par email et Discord des qu'un probleme est detecte.",
  },
  {
    icon: Zap,
    title: "Temps de reponse",
    description:
      "Mesurez les performances de vos sites et detectez les ralentissements.",
  },
  {
    icon: BarChart3,
    title: "Statistiques detaillees",
    description:
      "Graphiques d'uptime, historique des checks, pourcentage de disponibilite.",
  },
];

// Etapes "Comment ca marche"
const steps = [
  {
    number: "1",
    title: "Ajoutez vos sites",
    description: "Entrez les URLs des sites a surveiller en quelques secondes.",
  },
  {
    number: "2",
    title: "On surveille",
    description:
      "Nos serveurs verifient vos sites automatiquement, toutes les minutes.",
  },
  {
    number: "3",
    title: "Vous etes alerte",
    description:
      "Recevez une notification instantanee en cas de probleme detecte.",
  },
];

// FAQ
const faq = [
  {
    question: "Comment fonctionne le monitoring ?",
    answer:
      "Nos serveurs envoient des requetes HTTP vers vos sites a intervalles reguliers (de 1 a 30 minutes selon votre plan). Si un site ne repond pas ou repond avec un code d'erreur, une alerte est creee et vous etes notifie.",
  },
  {
    question: "Quels types de verifications sont effectuees ?",
    answer:
      "Nous verifions 3 elements : la disponibilite du site (uptime), la validite et l'expiration du certificat SSL, et la date d'expiration du nom de domaine.",
  },
  {
    question: "Puis-je tester gratuitement ?",
    answer:
      "Oui, le plan gratuit vous permet de surveiller 1 site avec des verifications toutes les 30 minutes, sans carte bancaire ni engagement.",
  },
  {
    question: "Comment sont envoyees les alertes ?",
    answer:
      "Les alertes sont envoyees par email (tous les plans) et via Discord webhook (plans Pro et Agence). Vous pouvez configurer vos preferences dans les parametres.",
  },
  {
    question: "Puis-je annuler mon abonnement a tout moment ?",
    answer:
      "Oui, vous pouvez annuler votre abonnement a tout moment depuis votre espace client. Votre plan reste actif jusqu'a la fin de la periode en cours.",
  },
  {
    question: "Mes donnees sont-elles securisees ?",
    answer:
      "Oui, toutes les communications sont chiffrees en HTTPS. Vos donnees sont stockees sur des serveurs securises et ne sont jamais partagees avec des tiers.",
  },
];

export default function HomePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(faq)),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent dark:from-indigo-950/30" />
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
            <Shield className="h-4 w-4 text-indigo-600" />
            Monitoring simple et fiable
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            La sentinelle de vos{" "}
            <span className="text-indigo-600">sites internet</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Surveillez la disponibilite, le SSL et les domaines de vos sites
            web. Soyez alerte avant vos clients.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">Voir les tarifs</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Gratuit pour 1 site - Sans carte bancaire
          </p>
        </div>
      </section>

      {/* Comment ca marche */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Comment ca marche
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalites */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Tout ce qu&apos;il faut pour surveiller vos sites
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Des outils simples et efficaces pour garder un oeil sur la sante de
            vos sites web.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <feature.icon className="mb-3 h-8 w-8 text-indigo-600" />
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Des tarifs simples et transparents
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Commencez gratuitement, evoluez selon vos besoins.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {(
              [
                { key: "FREE", plan: PLANS.FREE, popular: false },
                { key: "PRO", plan: PLANS.PRO, popular: true },
                { key: "AGENCY", plan: PLANS.AGENCY, popular: false },
              ] as const
            ).map(({ key, plan, popular }) => (
              <Card
                key={key}
                className={popular ? "relative border-indigo-600 shadow-lg" : ""}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
                    Populaire
                  </div>
                )}
                <CardContent className="pt-8">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-2 mb-6">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? "0" : `${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/mois</span>
                    )}
                  </div>
                  <ul className="mb-6 space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/register">
                      {plan.price === 0
                        ? "Commencer gratuitement"
                        : "S'abonner"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Questions frequentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />

      {/* CTA final */}
      <section className="border-t bg-indigo-600 py-16 dark:bg-indigo-950">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Pret a surveiller vos sites ?
          </h2>
          <p className="mb-8 text-lg text-indigo-100">
            Inscrivez-vous en 30 secondes. Gratuit, sans carte bancaire.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
