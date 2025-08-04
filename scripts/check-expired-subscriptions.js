#!/usr/bin/env node

/**
 * Script Node.js pour vérifier les abonnements expirés
 * Peut être utilisé avec un cron job système ou un service comme Vercel Cron
 */

const https = require('https');
const { URL } = require('url');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   - SUPABASE_URL ou VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function checkExpiredSubscriptions() {
  return new Promise((resolve, reject) => {
    const url = new URL('/functions/v1/check-expired-subscriptions', SUPABASE_URL);
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('🔍 Vérification des abonnements expirés...');
    console.log(`📡 URL: ${url.toString()}`);

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          console.log(`📊 Code de réponse HTTP: ${res.statusCode}`);
          
          if (res.statusCode === 200) {
            console.log('✅ Vérification réussie');
            console.log(`📈 Abonnements traités: ${response.processed || 0}`);
            console.log(`📋 Total trouvé: ${response.total_found || 0}`);
            
            if (response.processed > 0) {
              console.log('⚠️ Abonnements expirés désactivés:');
              response.results?.forEach((result, index) => {
                if (result.success) {
                  console.log(`   ${index + 1}. ${result.email} (expiré le ${result.expired_date})`);
                } else {
                  console.log(`   ${index + 1}. ${result.email} - ERREUR: ${result.error}`);
                }
              });
            } else {
              console.log('✅ Aucun abonnement expiré trouvé');
            }
            
            resolve(response);
          } else {
            console.error(`❌ Erreur HTTP ${res.statusCode}`);
            console.error('📋 Réponse:', response);
            reject(new Error(`HTTP ${res.statusCode}: ${response.error || 'Unknown error'}`));
          }
        } catch (error) {
          console.error('❌ Erreur lors du parsing de la réponse:', error);
          console.error('📋 Données brutes:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Erreur de requête:', error);
      reject(error);
    });

    req.setTimeout(30000, () => {
      console.error('❌ Timeout de la requête (30s)');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Fonction principale
async function main() {
  try {
    console.log('🚀 Démarrage de la vérification des abonnements expirés');
    console.log(`📅 Date: ${new Date().toISOString()}`);
    
    const result = await checkExpiredSubscriptions();
    
    console.log('🎯 Vérification terminée avec succès');
    
    // Code de sortie 0 pour succès
    process.exit(0);
    
  } catch (error) {
    console.error('🚨 ERREUR CRITIQUE:', error.message);
    
    // Envoyer une notification (optionnel)
    if (process.env.WEBHOOK_URL) {
      console.log('📧 Envoi de notification d\'erreur...');
      // Ici vous pourriez ajouter l'envoi d'un webhook vers Slack, Discord, etc.
    }
    
    // Code de sortie 1 pour erreur
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { checkExpiredSubscriptions };