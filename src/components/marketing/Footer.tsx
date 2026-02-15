// Footer des pages publiques
// Liens legaux, ressources, contact, newsletter compact

import Link from "next/link";
import { Shield } from "lucide-react";
import { NewsletterForm } from "@/components/blog/NewsletterForm";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Marque */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center gap-2 font-bold">
              <Shield className="h-5 w-5 text-indigo-600" />
              Vigie Web
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              La sentinelle de vos sites internet. Monitoring simple et fiable
              pour freelances et agences web.
            </p>
            <p className="mb-2 text-xs font-medium">Newsletter</p>
            <NewsletterForm source="footer" />
          </div>

          {/* Produit */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Produit</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-foreground">
                  Fonctionnalites
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground">
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Ressources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/surveiller-site-web"
                  className="hover:text-foreground"
                >
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal + Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/mentions-legales" className="hover:text-foreground">
                  Mentions legales
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="hover:text-foreground">
                  CGU
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-foreground">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-foreground">
                  Confidentialite
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@vigieweb.fr"
                  className="hover:text-foreground"
                >
                  support@vigieweb.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Guyon Informatique &amp; Web. Tous
          droits reserves.
        </div>
      </div>
    </footer>
  );
}
