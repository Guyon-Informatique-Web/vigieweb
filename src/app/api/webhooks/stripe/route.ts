// Webhook Stripe pour gerer les evenements d'abonnement
// Verifie la signature et met a jour le plan de l'utilisateur

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/config/plans";
import { withErrorHandling } from "@/lib/api-error-handler";
import type Stripe from "stripe";
import type { Plan } from "@/generated/prisma/client";

// Determiner le plan a partir du price ID Stripe
function getPlanFromPriceId(priceId: string): Plan | null {
  if (
    priceId === PLANS.PRO.stripePriceIdMonthly ||
    priceId === PLANS.PRO.stripePriceIdYearly
  ) {
    return "PRO";
  }
  if (
    priceId === PLANS.AGENCY.stripePriceIdMonthly ||
    priceId === PLANS.AGENCY.stripePriceIdYearly
  ) {
    return "AGENCY";
  }
  return null;
}

export const POST = withErrorHandling(async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Signature manquante" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(
      "Erreur verification signature Stripe:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json(
      { error: "Signature invalide" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      // Nouvel abonnement cree
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (!userId || !subscriptionId) break;

        // Recuperer les details de l'abonnement pour connaitre le plan
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        const plan = priceId ? getPlanFromPriceId(priceId) : null;

        if (plan) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: session.customer as string,
              plan,
            },
          });
        }
        break;
      }

      // Abonnement mis a jour (upgrade/downgrade)
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        const plan = priceId ? getPlanFromPriceId(priceId) : null;

        if (!plan) break;

        // Trouver l'utilisateur par son subscription ID
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan },
          });
        }
        break;
      }

      // Abonnement annule ou expire
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "FREE",
              stripeSubscriptionId: null,
            },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error(
      "Erreur traitement webhook Stripe:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { error: "Erreur interne" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}, "WEBHOOK");
