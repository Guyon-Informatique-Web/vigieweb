// Layout minimal pour la page de statut publique
// Branding Vigie Web en footer

import Link from "next/link";
import { Shield } from "lucide-react";

export default function StatusPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
      <footer className="border-t py-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          Surveille par
          <Shield className="h-4 w-4 text-indigo-600" />
          <span className="font-medium">Vigie Web</span>
        </Link>
      </footer>
    </div>
  );
}
