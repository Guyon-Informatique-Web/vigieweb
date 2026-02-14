// Page de gestion de l'abonnement
// Affiche le plan actuel et permet l'upgrade/downgrade via Stripe

import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PLANS } from "@/config/plans";
import type { Plan } from "@/generated/prisma/client";
import { BillingClient } from "@/components/dashboard/BillingClient";

export default async function BillingPage() {
  const { user, error } = await getAuthUser();
  if (error) redirect("/login");

  const currentPlan = PLANS[user!.plan as Plan];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Abonnement</h2>
        <p className="text-muted-foreground">
          Gerez votre plan et votre facturation
        </p>
      </div>

      <BillingClient
        currentPlan={user!.plan as Plan}
        currentPlanName={currentPlan.name}
        hasSubscription={!!user!.stripeSubscriptionId}
      />
    </div>
  );
}
