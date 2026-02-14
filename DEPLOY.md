# Deploiement Vigie Web

Guide complet pour deployer Vigie Web en production sur Vercel.

---

## 1. Pre-requis

- Compte Vercel (plan Pro requis pour les crons < 1h)
- Projet Supabase (PostgreSQL + Auth)
- Compte Stripe (paiements)
- Compte Resend (emails transactionnels)
- Domaine vigieweb.fr

---

## 2. Variables d'environnement

Configurer ces variables dans Vercel > Settings > Environment Variables :

### Supabase

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase (ex: https://xxx.supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cle publique anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Cle service role (jamais exposee cote client) |

### Base de donnees

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion pooling (port 6543, ?pgbouncer=true) |
| `DIRECT_URL` | URL de connexion directe (port 5432, pour les migrations) |

### Stripe

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Cle secrete API (sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook (whsec_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Cle publique (pk_live_...) |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | ID prix Pro mensuel (price_...) |
| `STRIPE_PRO_YEARLY_PRICE_ID` | ID prix Pro annuel (price_...) |
| `STRIPE_AGENCY_MONTHLY_PRICE_ID` | ID prix Agence mensuel (price_...) |
| `STRIPE_AGENCY_YEARLY_PRICE_ID` | ID prix Agence annuel (price_...) |

### Resend

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Cle API Resend (re_...) |
| `EMAIL_FROM` | Adresse d'envoi (noreply@vigieweb.fr) |

### Application

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | URL de production (https://vigieweb.fr) |
| `NEXT_PUBLIC_APP_NAME` | Nom de l'app (Vigie Web) |
| `CRON_SECRET` | Secret pour securiser les cron jobs |

---

## 3. Configuration Supabase

### 3.1 Projet

1. Creer un nouveau projet Supabase
2. Copier l'URL, la cle anon et la cle service role
3. Copier les URLs de connexion PostgreSQL (pooling + directe)

### 3.2 Authentification

1. Aller dans Authentication > URL Configuration
2. Configurer les URLs de redirect :
   - Site URL : `https://vigieweb.fr`
   - Redirect URLs :
     - `https://vigieweb.fr/auth/callback`
     - `https://vigieweb.fr/auth/confirm`

3. Activer les providers voulus :
   - Email (actif par defaut)
   - Google OAuth (optionnel)

### 3.3 RLS Policies

Les donnees sont gerees via Prisma, pas directement via Supabase. Aucune RLS policy specifique n'est requise si les tables sont accedees uniquement via l'API Next.js.

---

## 4. Configuration Stripe

### 4.1 Creer les produits

Dans le dashboard Stripe (mode Live) :

**Produit "Pro"** :
- Nom : Vigie Web Pro
- Prix mensuel : 9,99 EUR / mois (recurrence mensuelle)
- Prix annuel : 99,99 EUR / an (recurrence annuelle)
- Copier les price_id des deux prix

**Produit "Agence"** :
- Nom : Vigie Web Agence
- Prix mensuel : 29,99 EUR / mois
- Prix annuel : 299,99 EUR / an
- Copier les price_id des deux prix

### 4.2 Configurer le webhook

1. Aller dans Developers > Webhooks
2. Ajouter un endpoint : `https://vigieweb.fr/api/webhooks/stripe`
3. Evenements a ecouter :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copier le signing secret (whsec_...)

---

## 5. Configuration Resend

### 5.1 Domaine d'envoi

1. Ajouter le domaine `vigieweb.fr` dans Resend
2. Configurer les enregistrements DNS :
   - SPF (TXT)
   - DKIM (CNAME x3)
   - DMARC (TXT, optionnel mais recommande)
3. Verifier le domaine dans Resend

### 5.2 Configuration DNS complete

| Type | Nom | Valeur |
|------|-----|--------|
| A | vigieweb.fr | IP Vercel (76.76.21.21) |
| CNAME | www | cname.vercel-dns.com |
| TXT | @ | SPF (fourni par Resend) |
| CNAME | (3 entrees) | DKIM (fourni par Resend) |
| TXT | _dmarc | v=DMARC1; p=quarantine; rua=mailto:admin@vigieweb.fr |

---

## 6. Migration base de donnees

```bash
# Si premiere installation (pas de migrations existantes)
npx prisma db push

# Si migrations existantes
npx prisma migrate deploy

# Generer le client Prisma
npx prisma generate
```

---

## 7. Deploiement Vercel

### 7.1 Import du projet

1. Connecter le repo GitHub a Vercel
2. Framework preset : Next.js (detecte automatiquement)
3. Root directory : `.` (racine du projet vigieweb)
4. Ajouter toutes les variables d'environnement

### 7.2 Configuration du domaine

1. Aller dans Settings > Domains
2. Ajouter `vigieweb.fr` et `www.vigieweb.fr`
3. Configurer les DNS chez le registrar (voir section 5.2)

### 7.3 Cron jobs

Le fichier `vercel.json` configure un cron toutes les minutes :
```json
{
  "crons": [
    {
      "path": "/api/cron/monitor",
      "schedule": "* * * * *"
    }
  ]
}
```

**Important** : Les crons avec intervalle < 1h necessitent le plan Vercel Pro.

---

## 8. Verification post-deploiement

### Checklist

- [ ] Le site charge sur https://vigieweb.fr
- [ ] L'inscription fonctionne (email + confirmation)
- [ ] La connexion fonctionne
- [ ] Ajout d'un site a surveiller fonctionne
- [ ] Le cron de monitoring s'execute (verifier dans Vercel > Cron Jobs)
- [ ] Les alertes email sont envoyees (verifier dans Resend)
- [ ] Le paiement Stripe fonctionne (checkout + webhook)
- [ ] Le portail client Stripe fonctionne
- [ ] Les rapports sont generes pour les plans Pro/Agence
- [ ] Le certificat SSL est valide (HTTPS)

### Commandes utiles

```bash
# Verifier le build
npm run build

# Verifier les logs Vercel
vercel logs vigieweb.fr

# Tester le cron manuellement
curl -H "Authorization: Bearer $CRON_SECRET" https://vigieweb.fr/api/cron/monitor
```
