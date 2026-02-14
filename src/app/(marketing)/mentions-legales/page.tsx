// Page Mentions Legales - Obligatoire en France

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions legales",
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Mentions legales</h1>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        <h2>Editeur du site</h2>
        <p>
          Le site vigieweb.fr est edite par :<br />
          <strong>Guyon Informatique &amp; Web</strong>
          <br />
          Micro-entreprise
          <br />
          SIRET : [A completer]
          <br />
          Adresse : [A completer]
          <br />
          Email : support@vigieweb.fr
        </p>

        <h2>Directeur de la publication</h2>
        <p>Valentin Guyon</p>

        <h2>Hebergeur</h2>
        <p>
          Le site est heberge par :<br />
          <strong>Vercel Inc.</strong>
          <br />
          340 S Lemon Ave #4133, Walnut, CA 91789, Etats-Unis
          <br />
          Site : https://vercel.com
        </p>

        <h2>Base de donnees</h2>
        <p>
          Les donnees sont stockees par :<br />
          <strong>Supabase Inc.</strong>
          <br />
          970 Toa Payoh North #07-04, Singapore 318992
          <br />
          Site : https://supabase.com
        </p>

        <h2>Propriete intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu du site (textes, images, logo, code source)
          est la propriete exclusive de Guyon Informatique &amp; Web, sauf mention
          contraire. Toute reproduction, meme partielle, est interdite sans
          autorisation prealable.
        </p>

        <h2>Donnees personnelles</h2>
        <p>
          Conformement a la loi Informatique et Libertes du 6 janvier 1978 et au
          RGPD, vous disposez d&apos;un droit d&apos;acces, de rectification et de
          suppression de vos donnees. Pour exercer ce droit, contactez-nous a
          support@vigieweb.fr.
        </p>
        <p>
          Pour plus de details, consultez notre{" "}
          <a href="/confidentialite">politique de confidentialite</a>.
        </p>
      </div>
    </div>
  );
}
