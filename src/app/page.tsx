// Page d'accueil temporaire
// Sera remplacee par la landing page marketing en Phase 5

import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Shield className="mb-6 h-16 w-16 text-indigo-600" />
      <h1 className="mb-2 text-4xl font-bold">{APP_CONFIG.name}</h1>
      <p className="mb-8 text-lg text-muted-foreground">{APP_CONFIG.slogan}</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/register">Commencer gratuitement</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    </div>
  );
}
