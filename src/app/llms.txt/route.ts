// Route GEO : fichier llms.txt pour les crawlers IA
// Fournit une description structuree du service pour les moteurs generatifs

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://vigieweb.fr";

const content = `# Vigie Web
> La sentinelle de vos sites internet

## Description
Vigie Web est un service francais de monitoring de sites web concu pour les freelances, petites agences web et PME. Il surveille en continu la disponibilite (uptime), les certificats SSL et les noms de domaine de vos sites web, et vous alerte instantanement en cas de probleme.

## Fonctionnalites principales
- Monitoring uptime : verification de la disponibilite de vos sites toutes les 1 a 30 minutes
- Surveillance SSL : detection de l'expiration des certificats SSL avec alertes preventives
- Surveillance domaine : suivi de l'expiration des noms de domaine
- Alertes instantanees : notifications par email et Discord
- Tableau de bord : graphiques d'uptime, historique des checks, statistiques
- Rapports PDF : rapports mensuels de performance (plans payants)
- Page de statut publique : page personnalisable pour informer vos clients
- Badge uptime : badge SVG integrable sur vos sites

## Plans tarifaires
### Gratuit (0 EUR/mois)
- 1 site surveille
- Verification toutes les 30 minutes
- Historique 7 jours
- Alertes email
- Monitoring uptime + SSL

### Pro (9,99 EUR/mois ou 99,99 EUR/an)
- 10 sites surveilles
- Verification toutes les 5 minutes
- Historique 90 jours
- Alertes email + Discord
- Rapports PDF mensuels
- Monitoring SSL + domaine

### Agence (29,99 EUR/mois ou 299,99 EUR/an)
- 50 sites surveilles
- Verification toutes les minutes
- Historique 1 an
- Alertes email + Discord
- Rapports PDF personnalises
- Support prioritaire

## Pages principales
- Page d'accueil : ${BASE_URL}
- Tarifs : ${BASE_URL}/pricing
- Blog : ${BASE_URL}/blog
- Inscription : ${BASE_URL}/register
- Connexion : ${BASE_URL}/login

## Articles du blog
- Comment surveiller son site web efficacement en 2026 : ${BASE_URL}/blog/surveiller-site-web
- Monitoring de site web gratuit : guide complet : ${BASE_URL}/blog/monitoring-site-web-gratuit
- Verifier l'expiration d'un certificat SSL : ${BASE_URL}/blog/verifier-certificat-ssl-expiration
- Site hors ligne : detecter et reagir rapidement : ${BASE_URL}/blog/alerte-site-hors-ligne
- Page de statut pour votre site web : le guide : ${BASE_URL}/blog/page-statut-site-web

## Informations techniques
- Application web responsive (desktop, tablette, mobile)
- Interface en francais
- Paiement securise via Stripe
- Donnees hebergees en Europe
- Support par email : support@vigieweb.fr

## Editeur
Guyon Informatique & Web
Site : ${BASE_URL}
Contact : support@vigieweb.fr
`;

export async function GET() {
  return new Response(content.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
