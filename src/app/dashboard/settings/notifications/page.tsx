// Page de configuration des notifications
// Toggles email/Discord + URL webhook Discord + bouton tester

import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NotificationsClient } from "@/components/dashboard/NotificationsClient";

export default async function NotificationsPage() {
  const { user, error } = await getAuthUser();
  if (error) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notifications</h2>
        <p className="text-muted-foreground">
          Configurez comment vous souhaitez etre alerte
        </p>
      </div>

      <NotificationsClient
        notifyEmail={user!.notifyEmail}
        notifyDiscord={user!.notifyDiscord}
        discordWebhookUrl={user!.discordWebhookUrl || ""}
        plan={user!.plan}
      />
    </div>
  );
}
