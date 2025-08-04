/**
 * Vercel Cron Job pour vérifier les abonnements expirés
 * Se déclenche automatiquement tous les jours à 2h00 UTC
 */

export default async function handler(req, res) {
  // Vérifier que c'est bien un appel de cron job Vercel
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔍 [CRON] Vérification des abonnements expirés...');
    
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Variables d\'environnement Supabase manquantes');
    }

    const functionUrl = `${supabaseUrl}/functions/v1/check-expired-subscriptions`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    console.log('✅ [CRON] Vérification réussie');
    console.log(`📈 [CRON] Abonnements traités: ${result.processed || 0}`);
    
    // Log détaillé si des abonnements ont été traités
    if (result.processed > 0) {
      console.log('⚠️ [CRON] Abonnements expirés désactivés:');
      result.results?.forEach((item, index) => {
        if (item.success) {
          console.log(`   ${index + 1}. ${item.email}`);
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Expired subscriptions check completed',
      processed: result.processed || 0,
      total_found: result.total_found || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [CRON] Erreur:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}