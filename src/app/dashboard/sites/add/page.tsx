// Page d'ajout d'un site

import type { Metadata } from "next";
import { AddSiteForm } from "@/components/dashboard/AddSiteForm";

export const metadata: Metadata = {
  title: "Ajouter un site",
};

export default function AddSitePage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h2 className="text-2xl font-bold">Ajouter un site</h2>
      <AddSiteForm />
    </div>
  );
}
