// API route pour creer une session du portail client Stripe
// POST /api/stripe/portal - Redirige vers le portail de gestion d'abonnement

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { getAuthUser } from "@/lib/auth";
import { APP_CONFIG } from "@/config/app";

export async function POST() {
  const { user, error } = await getAuthUser();
  if (error) return error;

  if (!user!.stripeCustomerId) {
    return NextResponse.json(
      { error: "Aucun abonnement actif" },
      { status: 400 }
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user!.stripeCustomerId,
    return_url: `${APP_CONFIG.url}/dashboard/settings/billing`,
  });

  return NextResponse.json({ url: session.url });
}
