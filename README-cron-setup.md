# Configuration des Cron Jobs pour GoAdresse

Ce document explique comment configurer la vérification automatique des abonnements expirés.

## 🎯 Objectif

Vérifier quotidiennement les abonnements expirés et mettre automatiquement `is_pro = false` pour les utilisateurs concernés.

## 🔧 Options de Configuration

### Option 1: GitHub Actions (Recommandée)

**Avantages:**
- ✅ Gratuit
- ✅ Logs détaillés
- ✅ Notifications en cas d'erreur
- ✅ Exécution fiable

**Configuration:**
1. Le fichier `.github/workflows/check-expired-subscriptions.yml` est déjà créé
2. Ajoutez ces secrets dans votre repository GitHub :
   - `SUPABASE_URL` : Votre URL Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` : Votre clé service role

**Pour ajouter les secrets:**
1. Allez dans Settings > Secrets and variables > Actions
2. Cliquez sur "New repository secret"
3. Ajoutez `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

### Option 2: Vercel Cron Jobs

**Avantages:**
- ✅ Intégré à votre déploiement
- ✅ Configuration simple
- ✅ Monitoring intégré

**Configuration:**
1. Les fichiers `vercel.json` et `api/cron/check-expired-subscriptions.js` sont créés
2. Ajoutez ces variables d'environnement dans Vercel :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET` : Une clé secrète pour sécuriser l'endpoint

### Option 3: Script Node.js + Cron système

**Avantages:**
- ✅ Contrôle total
- ✅ Peut tourner sur votre serveur

**Configuration:**
1. Utilisez le script `scripts/check-expired-subscriptions.js`
2. Configurez un cron job système :

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne pour exécuter tous les jours à 2h00
0 2 * * * cd /path/to/your/project && node scripts/check-expired-subscriptions.js >> /var/log/subscription-check.log 2>&1
```

## 🚀 Test Manuel

### Via l'Edge Function directement:
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  "https://your-project.supabase.co/functions/v1/check-expired-subscriptions"
```

### Via le script Node.js:
```bash
SUPABASE_URL="https://your-project.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" \
node scripts/check-expired-subscriptions.js
```

### Via la fonction SQL:
```sql
SELECT * FROM check_and_disable_expired_subscriptions();
```

## 📊 Monitoring

### GitHub Actions
- Consultez l'onglet "Actions" de votre repository
- Les logs détaillés sont disponibles pour chaque exécution

### Vercel
- Consultez la section "Functions" de votre dashboard Vercel
- Les logs sont disponibles en temps réel

### Logs Supabase
- Consultez les logs de vos Edge Functions dans le dashboard Supabase

## 🔔 Notifications

### En cas d'erreur GitHub Actions:
Le workflow échouera et vous recevrez une notification par email (si activé).

### Pour ajouter des notifications personnalisées:
Vous pouvez modifier les scripts pour envoyer des webhooks vers:
- Slack
- Discord  
- Email
- SMS

## 📅 Planification

**Horaire actuel:** Tous les jours à 2h00 UTC

**Pour modifier l'horaire:**
- GitHub Actions: Modifiez le cron dans `.github/workflows/check-expired-subscriptions.yml`
- Vercel: Modifiez le schedule dans `vercel.json`
- Cron système: Modifiez votre crontab

## 🛡️ Sécurité

- ✅ Utilisation de la clé service role (accès complet mais sécurisé)
- ✅ Variables d'environnement pour les secrets
- ✅ Validation des autorisations dans les endpoints Vercel
- ✅ Logs détaillés pour l'audit

## 🔍 Dépannage

### "Variables d'environnement manquantes"
Vérifiez que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont bien configurés.

### "Unauthorized"
Vérifiez que votre clé service role est correcte et a les bonnes permissions.

### "Function not found"
Assurez-vous que l'Edge Function `check-expired-subscriptions` est bien déployée sur Supabase.

## 📈 Métriques

Le système retourne ces informations à chaque exécution:
- Nombre d'abonnements expirés trouvés
- Nombre d'abonnements traités avec succès
- Liste détaillée des utilisateurs affectés
- Timestamp de l'exécution