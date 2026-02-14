// Footer des pages publiques
// Liens legaux, contact, copyright

import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marque */}
          <div>
            <div className="mb-3 flex items-center gap-2 font-bold">
              <Shield className="h-5 w-5 text-indigo-600" />
              Vigie Web
            </div>
            <p className="text-sm text-muted-foreground">
              La sentinelle de vos sites internet. Monitoring simple et fiable
              pour freelances et agences web.
            </p>
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

          {/* Legal */}
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
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
