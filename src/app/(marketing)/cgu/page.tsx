// Page Conditions Generales d'Utilisation

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions generales d'utilisation",
};

export default function CGUPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">
        Conditions generales d&apos;utilisation
      </h1>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        <p>
          <em>Derniere mise a jour : [Date]</em>
        </p>

        <h2>1. Objet</h2>
        <p>
          Les presentes conditions generales d&apos;utilisation (CGU) regissent
          l&apos;utilisation du service Vigie Web, accessible a l&apos;adresse
          vigieweb.fr, edite par Guyon Informatique &amp; Web.
        </p>

        <h2>2. Description du service</h2>
        <p>
          Vigie Web est un service de monitoring de sites web qui permet de
          surveiller la disponibilite, les certificats SSL et les noms de
          domaine. Le service envoie des alertes en cas de probleme detecte.
        </p>

        <h2>3. Inscription</h2>
        <p>
          L&apos;inscription est gratuite et ouverte a toute personne physique ou
          morale. L&apos;utilisateur s&apos;engage a fournir des informations exactes et
          a les maintenir a jour.
        </p>

        <h2>4. Obligations de l&apos;utilisateur</h2>
        <p>L&apos;utilisateur s&apos;engage a :</p>
        <ul>
          <li>
            Ne surveiller que des sites dont il est proprietaire ou pour lesquels
            il dispose d&apos;une autorisation
          </li>
          <li>
            Ne pas utiliser le service a des fins malveillantes (DDoS, scraping,
            etc.)
          </li>
          <li>Respecter les limites de son plan tarifaire</li>
          <li>
            Ne pas tenter de contourner les mesures de securite du service
          </li>
        </ul>

        <h2>5. Disponibilite du service</h2>
        <p>
          Guyon Informatique &amp; Web s&apos;efforce de maintenir le service
          accessible 24h/24, 7j/7. Toutefois, le service peut etre
          temporairement interrompu pour des raisons de maintenance ou en cas de
          force majeure. Aucune garantie de disponibilite n&apos;est offerte.
        </p>

        <h2>6. Limitation de responsabilite</h2>
        <p>
          Le service est fourni &quot;en l&apos;etat&quot;. Guyon Informatique &amp; Web ne
          garantit pas l&apos;exactitude ou l&apos;exhaustivite des resultats de
          monitoring. L&apos;utilisateur reste seul responsable des decisions prises
          sur la base des informations fournies par le service.
        </p>

        <h2>7. Propriete intellectuelle</h2>
        <p>
          Le service, son interface et son code source sont la propriete
          exclusive de Guyon Informatique &amp; Web. L&apos;utilisateur ne dispose
          d&apos;aucun droit de propriete intellectuelle sur le service.
        </p>

        <h2>8. Resiliation</h2>
        <p>
          L&apos;utilisateur peut supprimer son compte a tout moment depuis les
          parametres de son compte. Guyon Informatique &amp; Web se reserve le
          droit de suspendre ou supprimer un compte en cas de violation des
          presentes CGU.
        </p>

        <h2>9. Modification des CGU</h2>
        <p>
          Guyon Informatique &amp; Web se reserve le droit de modifier les presentes
          CGU. Les utilisateurs seront informes par email de toute modification
          substantielle.
        </p>

        <h2>10. Droit applicable</h2>
        <p>
          Les presentes CGU sont soumises au droit francais. Tout litige sera
          soumis aux tribunaux competents de [Ville].
        </p>
      </div>
    </div>
  );
}
