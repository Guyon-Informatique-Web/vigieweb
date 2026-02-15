import Link from "next/link";

export default function PageStatutSiteWeb() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p>
        Quand un service en ligne rencontre un probleme, les utilisateurs
        veulent des reponses. Est-ce que c&apos;est en panne ? Est-ce que
        c&apos;est juste moi ? Quand est-ce que ca sera repare ? Une{" "}
        <strong>page de statut</strong> repond a toutes ces questions en un
        seul endroit. C&apos;est un outil de communication devenu
        incontournable pour tout site ou service web qui prend la fiabilite
        au serieux.
      </p>
      <p>
        Ce guide vous explique ce qu&apos;est une page de statut, pourquoi
        elle est essentielle et comment en mettre une en place pour votre
        propre site.
      </p>

      <h2>Qu&apos;est-ce qu&apos;une page de statut</h2>

      <p>
        Une page de statut est une page web dediee qui affiche en temps reel
        l&apos;etat de fonctionnement de vos services. Elle indique
        clairement quels composants sont operationnels, lesquels rencontrent
        des problemes et lesquels sont en panne. Les meilleures pages de
        statut incluent egalement un historique des incidents passes et des
        indicateurs de disponibilite (uptime) sur les derniers jours ou mois.
      </p>
      <p>
        Vous en avez certainement deja consulte : les grandes plateformes
        comme GitHub, AWS ou Slack proposent toutes une page de statut
        publique. Mais cet outil n&apos;est pas reserve aux geants de la
        tech. Tout site web, quelle que soit sa taille, peut en beneficier.
      </p>

      <h2>Pourquoi la transparence est essentielle</h2>

      <h3>Reduire la pression sur le support</h3>
      <p>
        Sans page de statut, chaque panne declenche une avalanche de messages
        au support. Votre equipe passe son temps a repondre la meme chose au
        lieu de se concentrer sur la resolution. Une page publique absorbe
        ces demandes avant qu&apos;elles n&apos;arrivent.
      </p>

      <h3>Renforcer la confiance des utilisateurs</h3>
      <p>
        Paradoxalement, afficher ouvertement vos incidents renforce la
        confiance plutot que de la degrader. Les utilisateurs apprecient la
        transparence. Un service qui communique proactivement sur ses
        problemes inspire plus confiance qu&apos;un service qui fait comme
        si de rien n&apos;etait. C&apos;est un signal fort de
        professionnalisme.
      </p>

      <h3>Proteger votre reputation</h3>
      <p>
        En l&apos;absence d&apos;information officielle, les utilisateurs
        speculant sur les reseaux sociaux, et les rumeurs se propagent vite.
        Une page de statut vous permet de controler le recit : vous expliquez
        ce qui se passe, ce que vous faites et quand le retour a la normale
        est prevu.
      </p>

      <h2>Que doit contenir une bonne page de statut</h2>

      <h3>Liste des services surveilles</h3>
      <p>
        Decomposez votre infrastructure en composants comprehensibles : site
        web principal, API, espace client, systeme de paiement, etc. Chaque
        composant affiche son etat actuel : operationnel, degradation de
        performance, panne partielle ou panne totale. Cette granularite
        permet aux utilisateurs de savoir exactement ce qui est touche.
      </p>

      <h3>Indicateurs d&apos;uptime</h3>
      <p>
        Des barres d&apos;uptime visuelles montrent la disponibilite de
        chaque service sur les 30, 60 ou 90 derniers jours. Un jour vert
        signifie 100 % de disponibilite, un jour orange indique une
        degradation et un jour rouge signale une panne. C&apos;est un
        indicateur visuel immediat qui rassure les utilisateurs et demontre
        votre engagement envers la fiabilite. Pour comprendre comment
        mesurer cet uptime,{" "}
        <Link href="/blog/surveiller-site-web">
          notre guide sur la surveillance de site web
        </Link>{" "}
        detaille les methodes disponibles.
      </p>

      <h3>Historique des incidents</h3>
      <p>
        Une chronologie des incidents passes avec leur description, leur
        duree et les mesures correctives prises. Cela montre que vous
        prenez chaque incident au serieux et que vous travaillez activement
        a ameliorer la fiabilite de vos services. Les utilisateurs peuvent
        consulter cet historique pour evaluer la stabilite globale de votre
        plateforme.
      </p>

      <h3>Mises a jour en temps reel</h3>
      <p>
        Pendant un incident, mettez a jour la page regulierement : premiere
        detection, diagnostic, correctif en deploiement, resolution confirmee.
        Chaque mise a jour rassure les utilisateurs.
      </p>

      <h2>Page de statut publique ou privee</h2>

      <h3>Page publique</h3>
      <p>
        Accessible a tous, sans authentification. C&apos;est le choix le plus
        courant et le plus transparent. Tout le monde peut verifier l&apos;etat
        de vos services : clients, prospects, partenaires. C&apos;est aussi un
        argument commercial : afficher un uptime de 99,9 % sur une page
        publique est une preuve concrete de fiabilite.
      </p>

      <h3>Page privee</h3>
      <p>
        Accessible uniquement aux utilisateurs authentifies ou a une liste
        restreinte de personnes. Ce format convient aux outils internes ou
        aux services B2B qui ne souhaitent pas exposer leur infrastructure au
        public. La page privee offre les memes fonctionnalites mais avec un
        controle d&apos;acces supplementaire.
      </p>

      <h3>Le bon choix selon votre contexte</h3>
      <p>
        Pour la majorite des sites web et services SaaS, la page publique est
        recommandee. Elle maximise la transparence et reduit le plus
        efficacement la charge sur le support. La page privee est a reserver
        aux cas ou la confidentialite de l&apos;infrastructure est un enjeu.
      </p>

      <h2>Creer une page de statut avec Vigie Web</h2>

      <p>
        Vigie Web integre nativement la creation de pages de statut publiques.
        Une fois vos sites configures dans votre tableau de bord de
        surveillance, vous pouvez activer une page de statut en quelques
        clics :
      </p>

      <ul>
        <li>
          <strong>Selection des services</strong> : choisissez quels sites ou
          composants afficher sur votre page de statut. Vous n&apos;etes pas
          oblige de tout rendre visible.
        </li>
        <li>
          <strong>Personnalisation</strong> : adaptez le titre, la
          description et l&apos;apparence de votre page pour qu&apos;elle
          corresponde a votre identite.
        </li>
        <li>
          <strong>URL dediee</strong> : partagez un lien direct vers votre
          page de statut avec vos clients, dans vos e-mails de support ou
          sur votre site principal.
        </li>
        <li>
          <strong>Mise a jour automatique</strong> : l&apos;etat des services
          est mis a jour automatiquement en fonction des resultats de
          surveillance. Pas besoin de modifier manuellement la page a chaque
          incident.
        </li>
      </ul>

      <p>
        La page de statut fonctionne de pair avec le systeme d&apos;
        <Link href="/blog/alerte-site-hors-ligne">
          alertes de site hors ligne
        </Link>
        . Quand Vigie Web detecte une panne, l&apos;etat est
        automatiquement mis a jour sur la page de statut et les alertes sont
        envoyees simultanement a votre equipe.
      </p>

      <div className="not-prose my-8 rounded-lg bg-indigo-50 p-6 dark:bg-indigo-950/30">
        <h3 className="mb-2 text-lg font-semibold">
          Creez votre page de statut en quelques minutes
        </h3>
        <p className="mb-4 text-muted-foreground">
          Inscrivez-vous sur Vigie Web, configurez vos moniteurs et activez
          votre page de statut publique. Vos clients sauront toujours ou en
          est votre service.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Creer ma page de statut
        </Link>
      </div>

      <h2>Bonnes pratiques pour votre page de statut</h2>

      <ul>
        <li>
          <strong>Rendez-la facile a trouver</strong> : ajoutez un lien dans
          le footer de votre site et dans vos e-mails de support.
        </li>
        <li>
          <strong>Soyez honnete</strong> : ne minimisez pas les problemes.
          Les utilisateurs detectent vite les contradictions entre leur
          experience et ce que la page affiche.
        </li>
        <li>
          <strong>Communiquez pendant et apres</strong> : mettez a jour la
          page regulierement pendant la resolution et publiez un bilan
          post-mortem. Cela demontre votre serieux.
        </li>
        <li>
          <strong>Hebergez-la independamment</strong> : si votre serveur est
          en panne, la page de statut doit rester accessible. Les solutions
          hebergees comme Vigie Web garantissent cette independance.
        </li>
        <li>
          <strong>Surveillez ce que vous affichez</strong> : une page qui
          indique &quot;operationnel&quot; alors que le service est en panne
          est pire que pas de page du tout.
        </li>
      </ul>

      <h2>Qui peut beneficier d&apos;une page de statut</h2>

      <p>
        Que vous soyez freelance gerant les sites de vos clients, editeur
        d&apos;un SaaS ou responsable d&apos;un e-commerce, une page de
        statut vous sera utile. Pour un freelance, c&apos;est un argument de
        differenciation face a la concurrence. Pour un SaaS, elle permet aux
        utilisateurs de verifier instantanement si un probleme vient de votre
        cote. Pour un e-commerce, elle clarifie la situation lors d&apos;une
        panne du paiement ou du site principal. Dans tous les cas, commencez
        avec un{" "}
        <Link href="/blog/monitoring-site-web-gratuit">
          plan de monitoring gratuit
        </Link>{" "}
        pour tester la fonctionnalite.
      </p>

      <h2>En resume</h2>

      <p>
        Une page de statut est bien plus qu&apos;un gadget technique.
        C&apos;est un outil de communication qui protege votre reputation,
        reduit la pression sur votre support et renforce la confiance de vos
        utilisateurs. Qu&apos;elle soit publique ou privee, simple ou
        detaillee, elle doit faire partie de votre strategie de fiabilite.
        Avec des outils comme Vigie Web, sa mise en place ne prend que
        quelques minutes.
      </p>

      <div className="not-prose my-8 rounded-lg bg-indigo-50 p-6 dark:bg-indigo-950/30">
        <h3 className="mb-2 text-lg font-semibold">
          Offrez de la transparence a vos utilisateurs
        </h3>
        <p className="mb-4 text-muted-foreground">
          Vigie Web vous permet de creer une page de statut publique en quelques
          clics, alimentee automatiquement par vos moniteurs. Inscrivez-vous
          gratuitement pour commencer.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Creer mon compte gratuit
        </Link>
      </div>
    </div>
  );
}
