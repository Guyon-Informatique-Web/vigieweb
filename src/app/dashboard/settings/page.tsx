// Page des parametres du compte
// Modifier le nom, changer le mot de passe, supprimer le compte

import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountClient } from "@/components/dashboard/AccountClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parametres",
};

export default async function SettingsPage() {
  const { user, error } = await getAuthUser();
  if (error) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Parametres du compte</h2>
        <p className="text-muted-foreground">
          Gerez votre profil et votre compte
        </p>
      </div>

      <AccountClient
        name={user!.name || ""}
        email={user!.email}
      />
    </div>
  );
}
