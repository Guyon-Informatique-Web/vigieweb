// Page Pricing - Comparatif detaille des plans
// Toggle mensuel/annuel, badge 2 mois offerts, FAQ pricing, JSON-LD Product

import type { Metadata } from "next";
import { PricingCards } from "@/components/marketing/PricingCards";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { productJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Decouvrez les tarifs de Vigie Web. Plan gratuit disponible. Monitoring de sites web pour freelances et agences.",
};

const pricingFaq = [
  {
    question: "Puis-je changer de plan a tout moment ?",
    answer:
      "Oui, vous pouvez upgrader ou downgrader votre plan a tout moment. Le changement prend effet immediatement. En cas d'upgrade, vous ne payez que le prorata restant.",
  },
  {
    question: "Le plan gratuit est-il vraiment gratuit ?",
    answer:
      "Oui, le plan gratuit permet de surveiller 1 site avec des verifications toutes les 30 minutes. Pas de carte bancaire requise, pas de limite de temps.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) via Stripe, notre processeur de paiement securise.",
  },
  {
    question: "Y a-t-il un engagement de duree ?",
    answer:
      "Non, nos plans mensuels sont sans engagement. Vous pouvez annuler a tout moment. Les plans annuels offrent 2 mois gratuits et sont renouveles automatiquement.",
  },
  {
    question: "Que se passe-t-il si je depasse la limite de sites ?",
    answer:
      "Vous ne pouvez pas ajouter plus de sites que votre plan le permet. Pour ajouter plus de sites, passez au plan superieur.",
  },
  {
    question: "Proposez-vous des remboursements ?",
    answer:
      "Oui, conformement a la loi francaise, vous disposez d'un droit de retractation de 14 jours apres votre premier abonnement.",
  },
];

const plans = [
  {
    name: "Gratuit",
    price: 0,
    description:
      "1 site surveille avec verification toutes les 30 minutes et alertes email.",
    features: [
      "1 site surveille",
      "Verification toutes les 30 min",
      "Alertes email",
    ],
  },
  {
    name: "Pro",
    price: 9.99,
    description:
      "10 sites surveilles avec verification toutes les 5 minutes, alertes email et Discord, rapports PDF.",
    features: [
      "10 sites surveilles",
      "Verification toutes les 5 min",
      "Alertes email + Discord",
      "Rapports PDF",
    ],
  },
  {
    name: "Agence",
    price: 29.99,
    description:
      "50 sites surveilles avec verification toutes les minutes, rapports personnalises et support prioritaire.",
    features: [
      "50 sites surveilles",
      "Verification toutes les minutes",
      "Rapports personnalises",
      "Support prioritaire",
    ],
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* JSON-LD Product pour chaque plan */}
      {plans.map((plan) => (
        <script
          key={plan.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd(plan)),
          }}
        />
      ))}

      {/* En-tete */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-4 text-4xl font-bold">
            Des tarifs simples et transparents
          </h1>
          <p className="text-lg text-muted-foreground">
            Choisissez le plan adapte a votre activite. Commencez gratuitement,
            evoluez selon vos besoins.
          </p>
        </div>
      </section>

      {/* Grille des plans */}
      <section className="pb-20">
        <PricingCards />
      </section>

      {/* Tableau comparatif */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Comparatif detaille
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">
                    Fonctionnalite
                  </th>
                  <th className="py-3 text-center font-medium">Gratuit</th>
                  <th className="py-3 text-center font-medium">Pro</th>
                  <th className="py-3 text-center font-medium">Agence</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3">Sites surveilles</td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-center">10</td>
                  <td className="py-3 text-center">50</td>
                </tr>
                <tr>
                  <td className="py-3">Frequence de verification</td>
                  <td className="py-3 text-center">30 min</td>
                  <td className="py-3 text-center">5 min</td>
                  <td className="py-3 text-center">1 min</td>
                </tr>
                <tr>
                  <td className="py-3">Retention des donnees</td>
                  <td className="py-3 text-center">7 jours</td>
                  <td className="py-3 text-center">90 jours</td>
                  <td className="py-3 text-center">1 an</td>
                </tr>
                <tr>
                  <td className="py-3">Monitoring uptime</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                </tr>
                <tr>
                  <td className="py-3">Surveillance SSL</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                </tr>
                <tr>
                  <td className="py-3">Surveillance domaine</td>
                  <td className="py-3 text-center text-muted-foreground">
                    Non
                  </td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                </tr>
                <tr>
                  <td className="py-3">Alertes email</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                </tr>
                <tr>
                  <td className="py-3">Alertes Discord</td>
                  <td className="py-3 text-center text-muted-foreground">
                    Non
                  </td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                </tr>
                <tr>
                  <td className="py-3">Rapports PDF</td>
                  <td className="py-3 text-center text-muted-foreground">
                    Non
                  </td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                </tr>
                <tr>
                  <td className="py-3">Support prioritaire</td>
                  <td className="py-3 text-center text-muted-foreground">
                    Non
                  </td>
                  <td className="py-3 text-center text-muted-foreground">
                    Non
                  </td>
                  <td className="py-3 text-center text-emerald-600">Oui</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Pricing */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Questions sur les tarifs
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {pricingFaq.map((item, index) => (
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
    </div>
  );
}
