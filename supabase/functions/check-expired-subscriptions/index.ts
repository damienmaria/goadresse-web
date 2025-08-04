import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '', 
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse({}, 204);
    }

    console.log('🔍 Vérification des abonnements expirés...');

    // Récupérer tous les profils avec un abonnement actif mais une date de fin dépassée
    const now = new Date().toISOString();
    
    const { data: expiredProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, subscription_end_date, is_pro')
      .eq('is_pro', true)
      .not('subscription_end_date', 'is', null)
      .lt('subscription_end_date', now);

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération des profils expirés:', fetchError);
      return corsResponse({ error: 'Failed to fetch expired profiles' }, 500);
    }

    if (!expiredProfiles || expiredProfiles.length === 0) {
      console.log('✅ Aucun abonnement expiré trouvé');
      return corsResponse({ 
        message: 'No expired subscriptions found',
        processed: 0 
      });
    }

    console.log(`📋 ${expiredProfiles.length} abonnement(s) expiré(s) trouvé(s)`);

    let processedCount = 0;
    const results = [];

    // Traiter chaque profil expiré
    for (const profile of expiredProfiles) {
      try {
        console.log(`⏰ Traitement de l'expiration pour l'utilisateur: ${profile.email}`);

        // Mettre à jour le profil pour désactiver le statut Pro
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            is_pro: false,
            subscription_status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error(`❌ Erreur lors de la mise à jour du profil ${profile.email}:`, updateError);
          results.push({
            user_id: profile.id,
            email: profile.email,
            success: false,
            error: updateError.message
          });
          continue;
        }

        console.log(`✅ Abonnement expiré traité pour: ${profile.email}`);
        processedCount++;
        
        results.push({
          user_id: profile.id,
          email: profile.email,
          success: true,
          expired_date: profile.subscription_end_date
        });

      } catch (error) {
        console.error(`❌ Erreur lors du traitement de ${profile.email}:`, error);
        results.push({
          user_id: profile.id,
          email: profile.email,
          success: false,
          error: error.message
        });
      }
    }

    console.log(`🎯 Traitement terminé: ${processedCount}/${expiredProfiles.length} abonnements expirés traités`);

    return corsResponse({
      message: `Successfully processed ${processedCount} expired subscriptions`,
      processed: processedCount,
      total_found: expiredProfiles.length,
      results: results
    });

  } catch (error: any) {
    console.error('❌ Erreur critique lors de la vérification des abonnements expirés:', error);
    return corsResponse({ error: error.message }, 500);
  }
});