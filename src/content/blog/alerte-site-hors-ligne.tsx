import Link from "next/link";

export default function AlerteSiteHorsLigne() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p>
        Votre site web vient de tomber. Combien de temps avant que quelqu&apos;un
        s&apos;en apercoive ? Si la reponse est &quot;quand un client se
        plaint&quot;, vous avez un probleme. La vitesse de detection d&apos;une
        panne determine directement l&apos;ampleur des degats : pertes de
        revenus, degradation SEO, frustration des utilisateurs. Mettre en
        place un systeme d&apos;
        <strong>alerte quand votre site est hors ligne</strong> est la
        premiere etape pour reprendre le controle.
      </p>

      <h2>Les causes courantes d&apos;indisponibilite</h2>

      <h3>Problemes serveur</h3>
      <p>
        Le serveur qui heberge votre site peut tomber pour de multiples
        raisons : surcharge de trafic, manque de memoire, processus bloque ou
        panne materielle chez votre hebergeur. Meme les fournisseurs cloud
        les plus fiables connaissent des incidents. Un serveur qui repond avec
        une erreur 500 ou qui ne repond plus du tout rend votre site
        completement inaccessible.
      </p>

      <h3>Problemes DNS</h3>
      <p>
        Le DNS est le systeme qui traduit votre nom de domaine en adresse IP.
        Si votre configuration DNS est corrompue, si votre fournisseur DNS
        connait une panne ou si vous avez fait une erreur de configuration
        apres une migration, votre domaine ne pointe plus vers le bon serveur.
        Le site existe toujours, mais personne ne peut le trouver.
      </p>

      <h3>Attaques DDoS</h3>
      <p>
        Les attaques par deni de service distribue submergent votre serveur
        de requetes jusqu&apos;a le rendre inoperant. Ces attaques peuvent
        durer de quelques minutes a plusieurs heures et touchent aussi bien
        les grands sites que les petits projets.
      </p>

      <h3>Erreurs de deploiement</h3>
      <p>
        Une mise a jour mal testee, une migration de base de donnees qui
        echoue, un fichier de configuration ecrase : les deploiements sont
        une source frequente de pannes. Le site fonctionnait parfaitement
        avant la mise en production, et soudain plus rien.
      </p>

      <h3>Expiration de certificat SSL ou de domaine</h3>
      <p>
        Un certificat SSL expire affiche un avertissement de securite qui
        bloque l&apos;acces. Un domaine non renouvele cesse tout simplement
        de fonctionner. Ces deux problemes sont evitables avec une
        surveillance adaptee. Consultez notre guide pour{" "}
        <Link href="/blog/verifier-certificat-ssl-expiration">
          verifier l&apos;expiration de votre certificat SSL
        </Link>
        .
      </p>

      <h2>L&apos;impact reel d&apos;un site hors ligne</h2>

      <h3>Pertes financieres directes</h3>
      <p>
        Pour un site e-commerce, chaque minute d&apos;indisponibilite se
        traduit en ventes perdues. Pour un SaaS, ce sont des utilisateurs qui
        ne peuvent plus acceder au service et qui remettent en question leur
        abonnement. Meme pour un site vitrine, une panne pendant une campagne
        publicitaire gaspille le budget marketing investi.
      </p>

      <h3>Degradation du referencement</h3>
      <p>
        Les robots des moteurs de recherche visitent votre site regulierement.
        S&apos;ils rencontrent des erreurs a repetition, votre classement en
        souffre. Une panne prolongee peut entrainer une desindexation
        temporaire de certaines pages, avec un temps de recuperation parfois
        long.
      </p>

      <h3>Erosion de la confiance</h3>
      <p>
        Les utilisateurs tolerent mal les pannes. Un client qui tombe sur une
        page d&apos;erreur perd confiance et se tourne vers un concurrent.
        Pour les services en ligne, la fiabilite est un argument de vente
        autant que les fonctionnalites.
      </p>

      <h2>Detection manuelle contre monitoring automatise</h2>

      <h3>Le piege de la detection manuelle</h3>
      <p>
        Rafraichir sa page d&apos;accueil de temps en temps n&apos;est pas
        un systeme de surveillance. Les pannes ne choisissent pas leurs
        horaires : elles surviennent la nuit, le week-end, pendant les
        vacances. Sans outil automatise, une panne a 2h du matin peut durer
        jusqu&apos;au lendemain sans que personne ne s&apos;en rende compte.
      </p>

      <h3>La surveillance automatisee comme standard</h3>
      <p>
        Un outil de monitoring envoie des requetes a votre site a intervalles
        reguliers. Des qu&apos;une anomalie est detectee (timeout, code HTTP
        d&apos;erreur, contenu inattendu), une alerte est declenchee. Cette
        approche est la seule qui garantit une detection rapide et
        systematique. Pour choisir le bon outil, consultez notre guide sur{" "}
        <Link href="/blog/surveiller-site-web">
          comment surveiller son site web
        </Link>
        .
      </p>

      <h2>Configurer vos alertes efficacement</h2>

      <h3>Alertes par e-mail</h3>
      <p>
        L&apos;e-mail est le canal d&apos;alerte le plus repandu. Il est
        fiable, universel et ne necessite aucune configuration complexe. Pour
        qu&apos;il soit efficace, configurez des notifications push sur votre
        telephone pour les e-mails de votre outil de monitoring. Creez
        egalement un filtre dedie pour que ces alertes ne se perdent pas dans
        le flux quotidien.
      </p>

      <h3>Alertes par Discord</h3>
      <p>
        Si vous utilisez Discord pour votre equipe, les alertes via webhook
        sont un excellent complement. Elles apparaissent dans un canal dedie,
        visibles par toute l&apos;equipe, et permettent une reaction
        collective rapide. C&apos;est particulierement utile quand plusieurs
        personnes peuvent intervenir sur l&apos;infrastructure.
      </p>

      <h3>Bonnes pratiques pour vos alertes</h3>
      <ul>
        <li>
          <strong>Evitez les faux positifs</strong> : configurez une
          confirmation (double verification avant alerte) pour ne pas etre
          reveille par une micro-coupure reseau de quelques secondes.
        </li>
        <li>
          <strong>Differenciez les niveaux de gravite</strong> : un timeout
          ponctuel n&apos;a pas la meme urgence qu&apos;une erreur 500
          persistante. Adaptez vos canaux d&apos;alerte en consequence.
        </li>
        <li>
          <strong>Incluez les informations utiles</strong> : une bonne alerte
          indique quel site est concerne, depuis combien de temps il est en
          panne et quel est le code d&apos;erreur.
        </li>
        <li>
          <strong>Alertez au retour en ligne</strong> : savoir quand le site
          est revenu est aussi important que savoir quand il est tombe.
        </li>
      </ul>

      <div className="not-prose my-8 rounded-lg bg-indigo-50 p-6 dark:bg-indigo-950/30">
        <h3 className="mb-2 text-lg font-semibold">
          Recevez une alerte des que votre site tombe
        </h3>
        <p className="mb-4 text-muted-foreground">
          Vigie Web detecte les pannes et vous alerte par e-mail ou Discord en
          quelques minutes. Plan gratuit disponible, sans carte bancaire.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Configurer mes alertes gratuitement
        </Link>
      </div>

      <h2>Reagir a une panne : les etapes cles</h2>

      <p>
        Recevoir une alerte ne sert a rien si vous ne savez pas quoi faire
        ensuite. Voici un protocole de reponse aux incidents en 5 etapes :
      </p>

      <ul>
        <li>
          <strong>1. Confirmer la panne</strong> : verifiez manuellement
          depuis un autre reseau ou un autre appareil que le site est bien
          inaccessible. Consultez votre outil de monitoring pour voir les
          details (code d&apos;erreur, temps de reponse).
        </li>
        <li>
          <strong>2. Identifier la cause</strong> : serveur ? DNS ? SSL ?
          Deploiement recent ? Verifiez les logs serveur, le statut de votre
          hebergeur et les derniers changements effectues.
        </li>
        <li>
          <strong>3. Communiquer</strong> : informez votre equipe et, si
          necessaire, vos utilisateurs. C&apos;est la qu&apos;une{" "}
          <Link href="/blog/page-statut-site-web">page de statut</Link>{" "}
          devient precieuse.
        </li>
        <li>
          <strong>4. Corriger</strong> : appliquez le correctif adapte
          (redemarrage serveur, rollback du deploiement, renouvellement SSL,
          correction DNS).
        </li>
        <li>
          <strong>5. Documenter</strong> : une fois la panne resolue, notez
          ce qui s&apos;est passe, pourquoi, et quelles mesures preventives
          mettre en place pour eviter que cela se reproduise.
        </li>
      </ul>

      <h2>Communiquer pendant une panne : la page de statut</h2>

      <p>
        Quand votre site est en panne, vos utilisateurs veulent savoir ce qui
        se passe. Plutot que de repondre individuellement a chaque demande,
        une page de statut publique centralise l&apos;information : quels
        services sont affectes, depuis quand, et quand la resolution est
        prevue. C&apos;est un outil de transparence qui renforce la confiance
        meme en situation de crise. Si vous souhaitez en creer une, notre
        article sur les{" "}
        <Link href="/blog/page-statut-site-web">
          pages de statut pour site web
        </Link>{" "}
        vous guide pas a pas.
      </p>

      <h2>Mieux vaut prevenir que guerir</h2>

      <p>
        La meilleure facon de gerer une panne, c&apos;est de l&apos;eviter.
        Et quand elle survient malgre tout, c&apos;est d&apos;etre le
        premier informe. Un systeme d&apos;alerte bien configure, combine a
        un protocole d&apos;intervention clair, fait la difference entre une
        panne de 5 minutes et une panne de 5 heures. Ne laissez pas vos
        utilisateurs vous signaler vos propres pannes. Meme un{" "}
        <Link href="/blog/monitoring-site-web-gratuit">
          monitoring gratuit
        </Link>{" "}
        vous place dans une bien meilleure position.
      </p>

      <div className="not-prose my-8 rounded-lg bg-indigo-50 p-6 dark:bg-indigo-950/30">
        <h3 className="mb-2 text-lg font-semibold">
          Ne soyez plus le dernier informe
        </h3>
        <p className="mb-4 text-muted-foreground">
          Avec Vigie Web, recevez une alerte instantanee des qu&apos;un de vos
          sites devient inaccessible. Inscrivez-vous gratuitement et protegez
          vos sites en quelques clics.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Commencer la surveillance gratuite
        </Link>
      </div>
    </div>
  );
}
