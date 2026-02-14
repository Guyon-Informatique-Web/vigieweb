// API route pour creer une session Stripe Checkout
// POST /api/stripe/checkout - Creer une session d'abonnement

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APP_CONFIG } from "@/config/app";
import { z } from "zod";

const checkoutSchema = z.object({
  priceId: z.string().min(1, "ID du prix requis"),
});

export async function POST(request: Request) {
  const { user, error } = await getAuthUser();
  if (error) return error;

  const body = await request.json();
  const result = checkoutSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  // Si l'utilisateur a deja un customer Stripe, le reutiliser
  let customerId = user!.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user!.email,
      name: user!.name || undefined,
      metadata: { userId: user!.id },
    });
    customerId = customer.id;

    // Sauvegarder le customer ID
    await prisma.user.update({
      where: { id: user!.id },
      data: { stripeCustomerId: customerId },
    });
  }

  // Creer la session de checkout
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: result.data.priceId, quantity: 1 }],
    success_url: `${APP_CONFIG.url}/dashboard/settings/billing?success=true`,
    cancel_url: `${APP_CONFIG.url}/dashboard/settings/billing?canceled=true`,
    metadata: { userId: user!.id },
  });

  return NextResponse.json({ url: session.url });
}
