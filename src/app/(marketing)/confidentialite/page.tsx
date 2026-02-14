// Page Politique de Confidentialite - RGPD

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">
        Politique de confidentialite
      </h1>

      <div className="prose prose-gray max-w-none dark:prose-invert">
        <p>
          <em>Derniere mise a jour : [Date]</em>
        </p>

        <h2>1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement des donnees est :<br />
          <strong>Guyon Informatique &amp; Web</strong>
          <br />
          Email : support@vigieweb.fr
        </p>

        <h2>2. Donnees collectees</h2>
        <p>Nous collectons les donnees suivantes :</p>
        <ul>
          <li>
            <strong>Donnees d&apos;inscription :</strong> nom, adresse email, mot de
            passe (chiffre)
          </li>
          <li>
            <strong>Donnees de paiement :</strong> traitees par Stripe, nous ne
            stockons pas vos informations bancaires
          </li>
          <li>
            <strong>Donnees d&apos;utilisation :</strong> URLs des sites surveilles,
            resultats des verifications, alertes
          </li>
          <li>
            <strong>Donnees techniques :</strong> adresse IP, navigateur, pour
            la securite du service
          </li>
        </ul>

        <h2>3. Finalite du traitement</h2>
        <p>Vos donnees sont utilisees pour :</p>
        <ul>
          <li>Fournir le service de monitoring (verification des sites)</li>
          <li>Envoyer les notifications d&apos;alerte (email, Discord)</li>
          <li>Gerer votre compte et votre abonnement</li>
          <li>Ameliorer le service</li>
        </ul>

        <h2>4. Base legale</h2>
        <p>
          Le traitement des donnees est fonde sur l&apos;execution du contrat
          (fourniture du service) et votre consentement (notifications).
        </p>

        <h2>5. Duree de conservation</h2>
        <ul>
          <li>
            <strong>Donnees de compte :</strong> conservees tant que le compte
            est actif, supprimees dans les 30 jours suivant la suppression du
            compte
          </li>
          <li>
            <strong>Donnees de monitoring :</strong> conservees selon la duree de
            retention du plan (7 jours a 1 an)
          </li>
          <li>
            <strong>Donnees de facturation :</strong> conservees 10 ans
            conformement aux obligations legales
          </li>
        </ul>

        <h2>6. Partage des donnees</h2>
        <p>
          Vos donnees ne sont pas vendues ni partagees avec des tiers a des fins
          commerciales. Elles sont transmises uniquement a nos sous-traitants
          techniques :
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> : hebergement de la base de donnees et
            authentification
          </li>
          <li>
            <strong>Vercel</strong> : hebergement de l&apos;application
          </li>
          <li>
            <strong>Stripe</strong> : traitement des paiements
          </li>
          <li>
            <strong>Resend</strong> : envoi des emails
          </li>
        </ul>

        <h2>7. Vos droits (RGPD)</h2>
        <p>Conformement au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>
            <strong>Droit d&apos;acces :</strong> obtenir une copie de vos donnees
          </li>
          <li>
            <strong>Droit de rectification :</strong> corriger vos donnees
          </li>
          <li>
            <strong>Droit de suppression :</strong> demander la suppression de
            vos donnees
          </li>
          <li>
            <strong>Droit a la portabilite :</strong> recevoir vos donnees dans
            un format structure
          </li>
          <li>
            <strong>Droit d&apos;opposition :</strong> vous opposer au traitement de
            vos donnees
          </li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous a support@vigieweb.fr. Nous
          repondrons dans un delai maximum de 30 jours.
        </p>

        <h2>8. Cookies</h2>
        <p>
          Vigie Web utilise uniquement des cookies techniques necessaires au
          fonctionnement du service (session d&apos;authentification, preferences de
          theme). Aucun cookie publicitaire ou de tracking n&apos;est utilise.
        </p>

        <h2>9. Securite</h2>
        <p>
          Nous mettons en oeuvre des mesures techniques et organisationnelles
          pour proteger vos donnees : chiffrement HTTPS, mots de passe haches,
          acces restreint aux donnees.
        </p>

        <h2>10. Contact</h2>
        <p>
          Pour toute question relative a la protection de vos donnees,
          contactez-nous a support@vigieweb.fr.
        </p>
        <p>
          Vous pouvez egalement introduire une reclamation aupres de la CNIL
          (Commission Nationale de l&apos;Informatique et des Libertes) :
          www.cnil.fr.
        </p>
      </div>
    </div>
  );
}
