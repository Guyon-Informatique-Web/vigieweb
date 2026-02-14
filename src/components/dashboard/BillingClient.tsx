// Composant client pour la gestion de l'abonnement
// Affiche les plans, gere le checkout et le portail Stripe

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/config/plans";
import type { Plan } from "@/generated/prisma/client";
import { toast } from "sonner";
import { Check, Loader2, CreditCard, ExternalLink } from "lucide-react";

interface BillingClientProps {
  currentPlan: Plan;
  currentPlanName: string;
  hasSubscription: boolean;
}

export function BillingClient({
  currentPlan,
  currentPlanName,
  hasSubscription,
}: BillingClientProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  // Rediriger vers le checkout Stripe
  const handleCheckout = async (priceId: string, planName: string) => {
    setLoading(planName);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erreur lors de la creation du paiement");
        return;
      }

      // Rediriger vers Stripe Checkout
      window.location.href = data.url;
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(null);
    }
  };

  // Ouvrir le portail client Stripe
  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erreur");
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setPortalLoading(false);
    }
  };

  const plans = [
    { key: "FREE" as Plan, ...PLANS.FREE },
    { key: "PRO" as Plan, ...PLANS.PRO },
    { key: "AGENCY" as Plan, ...PLANS.AGENCY },
  ];

  return (
    <div className="space-y-6">
      {/* Plan actuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plan actuel
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">{currentPlanName}</p>
            <p className="text-sm text-muted-foreground">
              {currentPlan === "FREE"
                ? "Gratuit"
                : `Abonnement actif`}
            </p>
          </div>
          {hasSubscription && (
            <Button
              variant="outline"
              onClick={handlePortal}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Gerer l&apos;abonnement
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Toggle mensuel/annuel */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant={billing === "monthly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setBilling("monthly")}
        >
          Mensuel
        </Button>
        <Button
          variant={billing === "yearly" ? "default" : "ghost"}
          size="sm"
          onClick={() => setBilling("yearly")}
        >
          Annuel
          <Badge variant="secondary" className="ml-2">
            2 mois offerts
          </Badge>
        </Button>
      </div>

      {/* Grille des plans */}
      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          const price =
            billing === "yearly" && "yearlyPrice" in plan
              ? plan.yearlyPrice
              : plan.price;
          const priceId =
            billing === "yearly" && "stripePriceIdYearly" in plan
              ? plan.stripePriceIdYearly
              : "stripePriceIdMonthly" in plan
                ? plan.stripePriceIdMonthly
                : null;

          return (
            <Card
              key={plan.key}
              className={isCurrent ? "border-primary" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {isCurrent && <Badge>Actuel</Badge>}
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    {price === 0 ? "0" : price}
                  </span>
                  {price > 0 && (
                    <span className="text-muted-foreground">
                      /{billing === "yearly" ? "an" : "mois"}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {!isCurrent && priceId && (
                  <Button
                    className="w-full"
                    onClick={() => handleCheckout(priceId, plan.key)}
                    disabled={loading === plan.key}
                  >
                    {loading === plan.key ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {plan.key === "FREE"
                      ? "Passer au gratuit"
                      : "S'abonner"}
                  </Button>
                )}

                {isCurrent && (
                  <Button className="w-full" disabled variant="outline">
                    Plan actuel
                  </Button>
                )}

                {!isCurrent && !priceId && plan.key === "FREE" && (
                  <Button className="w-full" disabled variant="outline">
                    Plan gratuit
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
