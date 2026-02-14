// Page Features - Detail de chaque fonctionnalite
// Sections illustrees avec icones et descriptions detaillees

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Lock,
  Globe,
  Bell,
  Zap,
  BarChart3,
  Shield,
  Clock,
  Mail,
  MessageSquare,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Fonctionnalites",
  description:
    "Decouvrez toutes les fonctionnalites de Vigie Web : monitoring uptime, SSL, domaine, alertes, graphiques et rapports.",
};

const features = [
  {
    icon: Activity,
    title: "Monitoring uptime en continu",
    description:
      "Nos serveurs envoient des requetes HTTP vers vos sites a intervalles reguliers. Nous detectons les pannes, les erreurs serveur (5xx) et les pages introuvables (404).",
    details: [
      "Verification HTTP avec mesure du temps de reponse",
      "Detection des codes d'erreur (4xx, 5xx)",
      "Timeout de 10 secondes pour detecter les sites lents",
      "Suivi des redirections",
    ],
  },
  {
    icon: Lock,
    title: "Surveillance des certificats SSL",
    description:
      "Un certificat SSL expire peut bloquer l'acces a un site et afficher un avertissement de securite. Nous verifions l'etat de vos certificats et vous alertons avant l'expiration.",
    details: [
      "Verification de la validite du certificat",
      "Alerte 14 jours avant l'expiration",
      "Alerte critique 3 jours avant l'expiration",
      "Identification de l'emetteur du certificat",
    ],
  },
  {
    icon: Globe,
    title: "Expiration des noms de domaine",
    description:
      "Un domaine expire peut entrainer la perte totale du site. Nous surveillons les dates d'expiration via le protocole RDAP et vous prevenons a temps.",
    details: [
      "Verification quotidienne de la date d'expiration",
      "Support des extensions .com, .net, .org, .fr, .io, .dev, .app",
      "Alerte 30 jours avant l'expiration",
      "Alerte critique 7 jours avant l'expiration",
    ],
  },
  {
    icon: Zap,
    title: "Mesure des performances",
    description:
      "Au-dela de la simple disponibilite, nous mesurons le temps de reponse de vos sites. Un site lent degrade l'experience utilisateur et le referencement.",
    details: [
      "Temps de reponse mesure a chaque verification",
      "Alerte si le temps depasse 3 secondes",
      "Statistiques min/max/moyenne par periode",
      "Graphiques d'evolution du temps de reponse",
    ],
  },
  {
    icon: Bell,
    title: "Alertes instantanees",
    description:
      "Des qu'un probleme est detecte, vous etes prevenu immediatement par le canal de votre choix. Fini les mauvaises surprises signalees par vos clients.",
    details: [
      "Alertes par email avec template professionnel",
      "Notifications Discord via webhook",
      "Severite adaptee : INFO, WARNING, CRITICAL",
      "Anti-spam : pas de doublon dans les 30 minutes",
    ],
  },
  {
    icon: BarChart3,
    title: "Statistiques et graphiques",
    description:
      "Visualisez l'historique de disponibilite et les performances de vos sites avec des graphiques interactifs et des metriques detaillees.",
    details: [
      "Pourcentage d'uptime sur 30 jours",
      "Graphique du temps de reponse (24h, 7j, 30j)",
      "Historique detaille des verifications",
      "Tableau de bord avec vue d'ensemble",
    ],
  },
];

const channels = [
  {
    icon: Mail,
    title: "Email",
    description: "Recevez un email detaille a chaque alerte avec lien direct vers le dashboard.",
    available: "Tous les plans",
  },
  {
    icon: MessageSquare,
    title: "Discord",
    description: "Envoyez les alertes dans un canal Discord via webhook. Ideal pour les equipes.",
    available: "Pro et Agence",
  },
];

export default function FeaturesPage() {
  return (
    <div>
      {/* En-tete */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-4 text-4xl font-bold">
            Tout pour surveiller vos sites
          </h1>
          <p className="text-lg text-muted-foreground">
            Des outils simples et efficaces pour garder un oeil sur la sante de
            vos sites web, 24h/24.
          </p>
        </div>
      </section>

      {/* Fonctionnalites detaillees */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="space-y-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex flex-col items-center gap-8 lg:flex-row ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visuel */}
                <div className="flex w-full items-center justify-center lg:w-1/2">
                  <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/30">
                    <feature.icon className="h-20 w-20 text-indigo-600" />
                  </div>
                </div>

                {/* Texte */}
                <div className="w-full lg:w-1/2">
                  <h2 className="mb-3 text-2xl font-bold">{feature.title}</h2>
                  <p className="mb-4 text-muted-foreground">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Canaux de notification */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Canaux de notification
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {channels.map((channel) => (
              <Card key={channel.title}>
                <CardContent className="pt-6">
                  <channel.icon className="mb-3 h-8 w-8 text-indigo-600" />
                  <h3 className="mb-1 font-semibold">{channel.title}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {channel.description}
                  </p>
                  <span className="text-xs font-medium text-indigo-600">
                    {channel.available}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Frequences de verification */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Frequence de verification selon votre plan
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                plan: "Gratuit",
                interval: "30 min",
                icon: Clock,
                color: "text-gray-600",
              },
              {
                plan: "Pro",
                interval: "5 min",
                icon: Clock,
                color: "text-indigo-600",
              },
              {
                plan: "Agence",
                interval: "1 min",
                icon: Zap,
                color: "text-amber-600",
              },
            ].map((item) => (
              <Card key={item.plan} className="text-center">
                <CardContent className="pt-6">
                  <item.icon className={`mx-auto mb-2 h-8 w-8 ${item.color}`} />
                  <p className="text-sm text-muted-foreground">{item.plan}</p>
                  <p className="text-2xl font-bold">
                    Toutes les {item.interval}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-indigo-600 py-16 dark:bg-indigo-950">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-indigo-200" />
          <h2 className="mb-4 text-3xl font-bold text-white">
            Pret a surveiller vos sites ?
          </h2>
          <p className="mb-8 text-lg text-indigo-100">
            Commencez gratuitement en moins de 30 secondes.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Creer mon compte
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
