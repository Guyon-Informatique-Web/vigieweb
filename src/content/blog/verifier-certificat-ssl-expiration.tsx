import Link from "next/link";

export default function VerifierCertificatSslExpiration() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p>
        Un certificat SSL expire est l&apos;un des problemes les plus courants
        et les plus faciles a eviter en matiere de gestion de site web.
        Pourtant, chaque annee, des milliers de sites se retrouvent
        inaccessibles ou affichent un avertissement de securite parce que leur
        certificat n&apos;a pas ete renouvele a temps. Ce guide vous explique
        ce qu&apos;est un certificat SSL, comment{" "}
        <strong>verifier sa date d&apos;expiration</strong> et comment
        automatiser cette surveillance pour ne plus jamais etre pris au
        depourvu.
      </p>

      <h2>Qu&apos;est-ce qu&apos;un certificat SSL et pourquoi est-il essentiel</h2>

      <p>
        SSL (Secure Sockets Layer), aujourd&apos;hui remplace par TLS
        (Transport Layer Security), est le protocole qui chiffre les echanges
        entre le navigateur de vos visiteurs et votre serveur. C&apos;est ce
        qui transforme le <code>http://</code> en <code>https://</code> dans
        la barre d&apos;adresse et affiche le cadenas de securite.
      </p>
      <p>
        Un certificat SSL remplit trois fonctions fondamentales :
      </p>
      <ul>
        <li>
          <strong>Chiffrement</strong> : les donnees echangees (mots de passe,
          informations de paiement, donnees personnelles) sont illisibles pour
          un tiers qui intercepterait le trafic.
        </li>
        <li>
          <strong>Authentification</strong> : le certificat prouve que le site
          appartient bien a son proprietaire legitime, protegeant contre le
          phishing.
        </li>
        <li>
          <strong>Integrite</strong> : il garantit que les donnees n&apos;ont
          pas ete modifiees pendant le transfert.
        </li>
      </ul>
      <p>
        Depuis 2018, Google Chrome marque tous les sites en HTTP comme
        &quot;Non securise&quot;. Un site sans SSL valide perd la confiance de
        ses visiteurs et voit son referencement penalise.
      </p>

      <h2>Comment verifier l&apos;expiration de votre certificat SSL</h2>

      <h3>Methode 1 : via le navigateur</h3>
      <p>
        La methode la plus simple ne necessite aucun outil technique. Dans
        Chrome, Firefox ou Edge :
      </p>
      <ul>
        <li>Rendez-vous sur votre site en HTTPS.</li>
        <li>
          Cliquez sur l&apos;icone du cadenas (ou l&apos;icone de securite) a
          gauche de l&apos;URL.
        </li>
        <li>
          Accedez aux details du certificat (le chemin varie selon le
          navigateur).
        </li>
        <li>
          Repererez le champ &quot;Valide jusqu&apos;au&quot; ou &quot;Not
          After&quot; qui indique la date d&apos;expiration.
        </li>
      </ul>
      <p>
        Cette methode fonctionne bien pour une verification ponctuelle, mais
        elle n&apos;est pas pratique si vous gerez plusieurs sites.
      </p>

      <h3>Methode 2 : avec la commande openssl</h3>
      <p>
        Pour les developpeurs et administrateurs systeme, la commande{" "}
        <code>openssl</code> permet de recuperer les informations du
        certificat directement depuis le terminal :
      </p>
      <pre>
        <code>
{`openssl s_client -connect vigieweb.fr:443 -servername vigieweb.fr 2>/dev/null | openssl x509 -noout -dates`}
        </code>
      </pre>
      <p>
        Cette commande affiche deux dates :
      </p>
      <ul>
        <li>
          <code>notBefore</code> : date de debut de validite du certificat.
        </li>
        <li>
          <code>notAfter</code> : date d&apos;expiration. C&apos;est celle qui
          vous interesse.
        </li>
      </ul>
      <p>
        Vous pouvez integrer cette commande dans un script cron pour une
        verification periodique, mais cela demande de la maintenance et ne
        couvre pas tous les cas (plusieurs domaines, sous-domaines, etc.).
      </p>

      <h3>Methode 3 : avec un outil de monitoring en ligne</h3>
      <p>
        C&apos;est la methode la plus fiable et la moins contraignante. Un
        outil de surveillance comme Vigie Web verifie automatiquement la date
        d&apos;expiration de votre certificat et vous envoie une alerte
        plusieurs jours avant l&apos;echeance. Pas de script a maintenir, pas
        de verification manuelle a planifier. Pour comprendre l&apos;ensemble
        des elements a surveiller, consultez notre guide sur{" "}
        <Link href="/blog/surveiller-site-web">
          comment surveiller son site web
        </Link>
        .
      </p>

      <h2>Les consequences d&apos;un certificat SSL expire</h2>

      <h3>Avertissement de securite dans le navigateur</h3>
      <p>
        Quand votre certificat expire, les navigateurs affichent une page
        d&apos;avertissement plein ecran avec un message du type &quot;Votre
        connexion n&apos;est pas privee&quot;. La quasi-totalite des
        visiteurs quittent le site a ce stade. Certains navigateurs bloquent
        meme completement l&apos;acces, rendant impossible toute
        interaction.
      </p>

      <h3>Perte de referencement</h3>
      <p>
        Google utilise le HTTPS comme signal de classement. Un site dont le
        certificat expire peut subir une baisse de positionnement rapide. De
        plus, si le robot de Google rencontre l&apos;erreur de certificat
        lors d&apos;un crawl, il peut desindexer temporairement certaines
        pages.
      </p>

      <h3>Perte de confiance des utilisateurs</h3>
      <p>
        Meme si vous renouvelez le certificat rapidement, l&apos;image de
        marque en prend un coup. Les utilisateurs qui ont vu l&apos;avertissement
        de securite associeront votre site a un risque potentiel. Pour un
        e-commerce ou un service en ligne, c&apos;est particulierement
        dommageable.
      </p>

      <h3>Interruption des services dependants</h3>
      <p>
        Si votre site utilise des API, des webhooks ou des integrations
        tierces, un certificat expire peut interrompre ces connexions. Les
        services qui communiquent en HTTPS refuseront les connexions vers un
        certificat invalide, ce qui peut provoquer des pannes en cascade.
      </p>

      <div className="not-prose my-8 rounded-lg bg-indigo-50 p-6 dark:bg-indigo-950/30">
        <h3 className="mb-2 text-lg font-semibold">
          Ne laissez plus votre certificat SSL expirer
        </h3>
        <p className="mb-4 text-muted-foreground">
          Vigie Web surveille automatiquement la date d&apos;expiration de votre
          certificat SSL et vous alerte avant qu&apos;il ne soit trop tard.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Activer la surveillance SSL gratuite
        </Link>
      </div>

      <h2>Automatiser la surveillance de vos certificats SSL</h2>

      <h3>Pourquoi le renouvellement automatique ne suffit pas</h3>
      <p>
        Si vous utilisez Let&apos;s Encrypt, votre certificat est
        normalement renouvele automatiquement via Certbot ou un mecanisme
        equivalent. Mais &quot;normalement&quot; n&apos;est pas
        &quot;toujours&quot;. Un serveur mal configure, une migration qui
        casse le processus de renouvellement, un changement de DNS non
        propage : les raisons d&apos;un echec de renouvellement automatique
        sont nombreuses.
      </p>
      <p>
        C&apos;est pourquoi meme avec un renouvellement automatique en place,
        une couche de surveillance independante est indispensable. Elle agit
        comme un filet de securite.
      </p>

      <h3>La surveillance SSL avec Vigie Web</h3>
      <p>
        Lorsque vous ajoutez un site a Vigie Web, la surveillance SSL est
        activee automatiquement. Le systeme verifie regulierement la validite
        de votre certificat et vous envoie une alerte si l&apos;expiration
        approche. Vous etes ainsi prevenu plusieurs jours a l&apos;avance,
        ce qui vous laisse largement le temps d&apos;intervenir. En cas
        d&apos;expiration soudaine, vous recevez une{" "}
        <Link href="/blog/alerte-site-hors-ligne">
          alerte de site hors ligne
        </Link>{" "}
        dans les minutes qui suivent.
      </p>

      <h2>Bonnes pratiques pour la gestion de vos certificats SSL</h2>

      <ul>
        <li>
          <strong>Centralisez la gestion</strong> : si vous gerez plusieurs
          domaines, utilisez un tableau de bord unique pour suivre toutes les
          dates d&apos;expiration.
        </li>
        <li>
          <strong>Privilegiez les certificats a renouvellement automatique</strong>{" "}
          : Let&apos;s Encrypt est gratuit et se renouvelle tous les 90 jours.
          C&apos;est la solution la plus simple pour la majorite des sites.
        </li>
        <li>
          <strong>Ajoutez une surveillance independante</strong> : ne faites
          jamais confiance a un seul mecanisme. Un outil de monitoring
          externe detectera les problemes que votre serveur ne voit pas.
        </li>
        <li>
          <strong>Documentez votre processus</strong> : notez ou sont
          configures vos certificats, quel fournisseur vous utilisez et
          quelle est la procedure de renouvellement manuel en cas d&apos;urgence.
        </li>
        <li>
          <strong>Testez apres chaque renouvellement</strong> : verifiez que
          le nouveau certificat est bien installe et que la chaine de
          certificats est complete.
        </li>
      </ul>

      <h2>En resume</h2>

      <p>
        Verifier l&apos;expiration d&apos;un certificat SSL est une operation
        simple mais critique. Que vous utilisiez la methode du navigateur, la
        commande <code>openssl</code> ou un outil automatise, l&apos;essentiel
        est de ne jamais laisser un certificat expirer sans le savoir. Avec
        des consequences allant de l&apos;avertissement de securite a la perte
        de referencement, le risque est trop important pour etre ignore.
      </p>

      <div className="not-prose my-8 rounded-lg bg-indigo-50 p-6 dark:bg-indigo-950/30">
        <h3 className="mb-2 text-lg font-semibold">
          Protegez votre site avec la surveillance SSL automatique
        </h3>
        <p className="mb-4 text-muted-foreground">
          Inscrivez-vous gratuitement sur Vigie Web et recevez une alerte
          avant l&apos;expiration de votre certificat SSL. Configuration en
          moins de 2 minutes.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Surveiller mon certificat SSL
        </Link>
      </div>
    </div>
  );
}
