// Types lies aux utilisateurs

import type { PlanType } from "@/config/plans";

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  plan: PlanType;
  notifyEmail: boolean;
  notifyDiscord: boolean;
  discordWebhookUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
