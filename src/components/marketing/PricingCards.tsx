// Composant PricingCards avec toggle mensuel/annuel
// Utilise par la page pricing et la landing page

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/config/plans";
import { Check } from "lucide-react";

export function PricingCards() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    { key: "FREE" as const, popular: false },
    { key: "PRO" as const, popular: true },
    { key: "AGENCY" as const, popular: false },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Toggle mensuel/annuel */}
      <div className="mb-8 flex items-center justify-center gap-3">
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

      {/* Grille */}
      <div className="grid gap-6 sm:grid-cols-3">
        {plans.map(({ key, popular }) => {
          const plan = PLANS[key];
          const price =
            billing === "yearly" && "yearlyPrice" in plan
              ? plan.yearlyPrice
              : plan.price;

          return (
            <Card
              key={key}
              className={
                popular ? "relative border-indigo-600 shadow-lg" : ""
              }
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
                    {price === 0 ? "0" : `${price}`}
                  </span>
                  {price > 0 && (
                    <span className="text-muted-foreground">
                      /{billing === "yearly" ? "an" : "mois"}
                    </span>
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
                    {price === 0
                      ? "Commencer gratuitement"
                      : "S'abonner"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
