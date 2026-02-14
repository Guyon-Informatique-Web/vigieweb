// Page liste des alertes
// Filtres par site, type, severite, lu/non lu

import type { Metadata } from "next";
import { AlertsList } from "@/components/dashboard/AlertsList";

export const metadata: Metadata = {
  title: "Alertes",
};

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Alertes</h2>
      <AlertsList />
    </div>
  );
}
