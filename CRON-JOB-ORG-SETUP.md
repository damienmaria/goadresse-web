# Configuration Cron Job avec cron-job.org

## 🎯 Objectif
Configurer un cron job gratuit sur https://console.cron-job.org/ pour vérifier automatiquement les abonnements expirés tous les jours.

## 🔧 Étapes de Configuration

### 1. Préparer l'endpoint sécurisé

L'endpoint `/api/public-cron-endpoint` a été créé avec une sécurité par clé secrète.

### 2. Configurer les variables d'environnement

Dans votre plateforme de déploiement (Vercel, Netlify, etc.), ajoutez ces variables :

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
CRON_SECRET_KEY=votre_cle_secrete_unique
```

**⚠️ Important:** Générez une clé secrète unique et complexe pour `CRON_SECRET_KEY`
Exemple: `cron_secret_2024_goadresse_xyz789abc`

### 3. Créer le cron job sur cron-job.org

1. **Inscription:**
   - Allez sur https://console.cron-job.org/
   - Créez un compte gratuit

2. **Créer un nouveau cron job:**
   - Cliquez sur "Create cronjob"
   - Remplissez les informations suivantes :

**Configuration recommandée:**

```
Title: GoAdresse - Vérification abonnements expirés
URL: https://goadresse.fr/api/public-cron-endpoint?secret=votre_cle_secrete_unique
Schedule: 0 2 * * * (tous les jours à 2h00 UTC)
Request method: GET
Timeout: 30 seconds
```

**Exemple d'URL complète:**
```
https://goadresse.fr/api/public-cron-endpoint?secret=cron_secret_2024_goadresse_xyz789abc
```

3. **Configuration avancée (optionnelle):**
   - **Retry on failure:** 3 fois
   - **Notification email:** Votre email pour être alerté en cas d'erreur
   - **Expected HTTP status:** 200
   - **Expected response:** `"success":true`

### 4. Tester le cron job

#### Test manuel via navigateur:
```
https://goadresse.fr/api/public-cron-endpoint?secret=votre_cle_secrete
```

#### Test via curl:
```bash
curl "https://goadresse.fr/api/public-cron-endpoint?secret=votre_cle_secrete"
```

#### Test depuis cron-job.org:
- Cliquez sur "Execute now" dans votre cron job

## 📅 Planification

**Format cron utilisé:** `0 2 * * *`
- `0` : minute (0)
- `2` : heure (2h00 UTC)
- `*` : jour du mois (tous)
- `*` : mois (tous)
- `*` : jour de la semaine (tous)

**Autres exemples de planification:**
- `0 1 * * *` : Tous les jours à 1h00 UTC
- `0 */6 * * *` : Toutes les 6 heures
- `0 2 * * 1` : Tous les lundis à 2h00 UTC

## 🔒 Sécurité

### Protection par clé secrète
L'endpoint est protégé par une clé secrète dans l'URL. Sans cette clé, l'accès est refusé.

### Bonnes pratiques:
- ✅ Utilisez une clé secrète longue et complexe
- ✅ Ne partagez jamais cette clé
- ✅ Changez la clé si elle est compromise
- ✅ Surveillez les logs pour détecter les tentatives d'accès non autorisées

## 📊 Monitoring et Logs

### Sur cron-job.org:
- **Execution History:** Voir l'historique des exécutions
- **Response Time:** Temps de réponse de votre endpoint
- **Success Rate:** Taux de réussite
- **Error Notifications:** Alertes par email en cas d'échec

### Dans vos logs d'application:
```
✅ [CRON-JOB.ORG] Vérification réussie
📈 Abonnements traités: 2
📋 Total trouvé: 2
⚠️ Abonnements expirés désactivés:
   1. user1@example.com (expiré le 2024-01-15)
   2. user2@example.com (expiré le 2024-01-20)
```

## 🚨 Gestion des Erreurs

### Types d'erreurs possibles:

1. **401 Unauthorized:** Clé secrète incorrecte
2. **500 Server Error:** Problème avec Supabase ou variables d'environnement
3. **Timeout:** L'endpoint met trop de temps à répondre

### Actions en cas d'erreur:
- Vérifiez les variables d'environnement
- Testez l'endpoint manuellement
- Consultez les logs de votre application
- Vérifiez que l'Edge Function Supabase fonctionne

## 🔄 Réponse de l'endpoint

### Succès (200):
```json
{
  "success": true,
  "message": "Expired subscriptions check completed successfully",
  "processed": 2,
  "total_found": 2,
  "timestamp": "2024-01-25T02:00:00.000Z",
  "details": [
    {
      "user_id": "uuid",
      "email": "user@example.com",
      "success": true,
      "expired_date": "2024-01-20T00:00:00.000Z"
    }
  ]
}
```

### Erreur (401/500):
```json
{
  "success": false,
  "error": "Unauthorized",
  "timestamp": "2024-01-25T02:00:00.000Z"
}
```

## 🎯 Avantages de cron-job.org

- ✅ **Gratuit** jusqu'à 5 cron jobs
- ✅ **Interface simple** et intuitive
- ✅ **Monitoring intégré** avec historique
- ✅ **Notifications email** en cas d'erreur
- ✅ **Retry automatique** en cas d'échec
- ✅ **Logs détaillés** de chaque exécution
- ✅ **Timezone support** (UTC recommandé)

## 🔧 Dépannage

### "Unauthorized" (401)
- Vérifiez que la clé secrète dans l'URL est correcte
- Vérifiez que `CRON_SECRET_KEY` est bien configuré

### "Server configuration error" (500)
- Vérifiez que toutes les variables d'environnement sont configurées
- Testez l'Edge Function Supabase directement

### Timeout
- Augmentez le timeout dans cron-job.org (max 60s)
- Optimisez l'Edge Function si nécessaire

### Pas de réponse
- Vérifiez que votre application est bien déployée
- Testez l'URL manuellement dans un navigateur

## 📞 Support

En cas de problème avec cron-job.org:
- Documentation: https://cron-job.org/en/documentation/
- Support: contact@cron-job.org