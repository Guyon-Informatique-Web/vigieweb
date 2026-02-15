// Section newsletter pour la landing page
// Fond indigo, titre accrocheur, formulaire centre

import { NewsletterForm } from "@/components/blog/NewsletterForm";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="bg-indigo-50 py-16 dark:bg-indigo-950/30">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm">
          <Mail className="h-4 w-4 text-indigo-600" />
          Newsletter
        </div>
        <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
          Restez informe sur le monitoring web
        </h2>
        <p className="mb-6 text-muted-foreground">
          Recevez nos conseils et guides sur la surveillance de sites web.
          Pas de spam, uniquement du contenu utile.
        </p>
        <div className="flex justify-center">
          <NewsletterForm source="landing" />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Desabonnement en un clic. Nous respectons votre vie privee.
        </p>
      </div>
    </section>
  );
}
