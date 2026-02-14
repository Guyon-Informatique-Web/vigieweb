// Page Conditions Generales de Vente

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions generales de vente",
};

export default function CGVPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">
        Conditions generales de vente
      </h1>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        <p>
          <em>Derniere mise a jour : [Date]</em>
        </p>

        <h2>1. Objet</h2>
        <p>
          Les presentes conditions generales de vente (CGV) s&apos;appliquent a
          toute souscription a un plan payant du service Vigie Web, edite par
          Guyon Informatique &amp; Web.
        </p>

        <h2>2. Description des offres</h2>
        <p>Vigie Web propose trois plans :</p>
        <ul>
          <li>
            <strong>Gratuit :</strong> 1 site, verification toutes les 30
            minutes, alertes email
          </li>
          <li>
            <strong>Pro (9,99 EUR/mois ou 99,99 EUR/an) :</strong> 10 sites,
            verification toutes les 5 minutes, alertes email + Discord, rapports
            PDF
          </li>
          <li>
            <strong>Agence (29,99 EUR/mois ou 299,99 EUR/an) :</strong> 50
            sites, verification chaque minute, support prioritaire
          </li>
        </ul>

        <h2>3. Tarifs</h2>
        <p>
          Les tarifs sont indiques en euros TTC (TVA non applicable, article
          293B du CGI). Les tarifs peuvent etre modifies a tout moment, mais les
          modifications ne s&apos;appliquent pas aux abonnements en cours.
        </p>

        <h2>4. Modalites de paiement</h2>
        <p>
          Le paiement s&apos;effectue par carte bancaire via la plateforme
          securisee Stripe. Les abonnements sont preleves automatiquement a
          chaque echeance (mensuelle ou annuelle).
        </p>

        <h2>5. Droit de retractation</h2>
        <p>
          Conformement a l&apos;article L221-18 du Code de la consommation, vous
          disposez d&apos;un delai de 14 jours a compter de la souscription pour
          exercer votre droit de retractation, sans avoir a justifier de motifs
          ni a payer de penalites.
        </p>
        <p>
          Pour exercer ce droit, contactez-nous a support@vigieweb.fr. Le
          remboursement sera effectue dans un delai de 14 jours.
        </p>

        <h2>6. Resiliation</h2>
        <p>
          Vous pouvez resilier votre abonnement a tout moment depuis votre
          espace client ou via le portail Stripe. La resiliation prend effet a
          la fin de la periode en cours. Aucun remboursement au prorata n&apos;est
          effectue pour la periode restante.
        </p>

        <h2>7. Remboursement</h2>
        <p>
          En dehors du droit de retractation, les abonnements ne sont pas
          remboursables. En cas de dysfonctionnement majeur du service, un
          remboursement partiel ou total peut etre accorde au cas par cas.
        </p>

        <h2>8. Responsabilite</h2>
        <p>
          Guyon Informatique &amp; Web ne saurait etre tenu responsable des
          dommages directs ou indirects lies a l&apos;utilisation du service,
          notamment en cas de panne non detectee ou de retard dans l&apos;envoi des
          alertes.
        </p>

        <h2>9. Droit applicable</h2>
        <p>
          Les presentes CGV sont soumises au droit francais. En cas de litige,
          le client peut recourir a un mediateur de la consommation avant toute
          action judiciaire.
        </p>
      </div>
    </div>
  );
}
