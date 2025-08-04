/**
 * Endpoint public pour cron-job.org
 * Sécurisé par une clé secrète dans l'URL
 */

export default async function handler(req, res) {
  try {
    // Vérifier la méthode HTTP
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Vérifier la clé secrète
    const secretKey = req.query.secret || req.body?.secret;
    const expectedSecret = process.env.CRON_SECRET_KEY;
    
    if (!expectedSecret) {
      console.error('❌ CRON_SECRET_KEY non configuré');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (secretKey !== expectedSecret) {
      console.log('🚫 Tentative d\'accès non autorisée au cron job');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('🔍 [CRON-JOB.ORG] Démarrage de la vérification des abonnements expirés...');
    
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Variables d\'environnement Supabase manquantes');
    }

    // Appeler l'Edge Function Supabase
    const functionUrl = `${supabaseUrl}/functions/v1/check-expired-subscriptions`;
    
    console.log(`📡 Appel de l'Edge Function: ${functionUrl}`);
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur Edge Function: HTTP ${response.status}`);
      console.error(`📋 Détails: ${errorText}`);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    console.log('✅ [CRON-JOB.ORG] Vérification réussie');
    console.log(`📈 Abonnements traités: ${result.processed || 0}`);
    console.log(`📋 Total trouvé: ${result.total_found || 0}`);
    
    // Log détaillé si des abonnements ont été traités
    if (result.processed > 0) {
      console.log('⚠️ Abonnements expirés désactivés:');
      result.results?.forEach((item, index) => {
        if (item.success) {
          console.log(`   ${index + 1}. ${item.email} (expiré le ${item.expired_date})`);
        } else {
          console.log(`   ${index + 1}. ${item.email} - ERREUR: ${item.error}`);
        }
      });
    } else {
      console.log('✅ Aucun abonnement expiré trouvé');
    }

    // Réponse de succès
    return res.status(200).json({
      success: true,
      message: 'Expired subscriptions check completed successfully',
      processed: result.processed || 0,
      total_found: result.total_found || 0,
      timestamp: new Date().toISOString(),
      details: result.results || []
    });

  } catch (error) {
    console.error('❌ [CRON-JOB.ORG] Erreur critique:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}