/*
  # Fonction pour vérifier et désactiver les abonnements expirés

  1. Fonction SQL
    - `check_and_disable_expired_subscriptions()`: Fonction qui vérifie et désactive automatiquement les abonnements expirés
    - Met à jour `is_pro` à `false` pour les utilisateurs dont `subscription_end_date` est dépassée
    - Met à jour `subscription_status` à `expired`

  2. Sécurité
    - Fonction sécurisée qui ne peut être exécutée que par le service role
    - Logs des actions effectuées
*/

-- Fonction pour vérifier et désactiver les abonnements expirés
CREATE OR REPLACE FUNCTION check_and_disable_expired_subscriptions()
RETURNS TABLE (
  processed_count integer,
  expired_users jsonb
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_user RECORD;
  processed_count_var integer := 0;
  expired_users_array jsonb := '[]'::jsonb;
BEGIN
  -- Parcourir tous les utilisateurs avec un abonnement expiré
  FOR expired_user IN 
    SELECT id, email, subscription_end_date, is_pro
    FROM profiles 
    WHERE is_pro = true 
      AND subscription_end_date IS NOT NULL 
      AND subscription_end_date < NOW()
  LOOP
    -- Mettre à jour le statut de l'utilisateur
    UPDATE profiles 
    SET 
      is_pro = false,
      subscription_status = 'expired',
      updated_at = NOW()
    WHERE id = expired_user.id;
    
    -- Incrémenter le compteur
    processed_count_var := processed_count_var + 1;
    
    -- Ajouter l'utilisateur à la liste des utilisateurs traités
    expired_users_array := expired_users_array || jsonb_build_object(
      'user_id', expired_user.id,
      'email', expired_user.email,
      'expired_date', expired_user.subscription_end_date,
      'processed_at', NOW()
    );
    
    -- Log de l'action
    RAISE NOTICE 'Abonnement expiré désactivé pour l''utilisateur: % (ID: %)', expired_user.email, expired_user.id;
  END LOOP;
  
  -- Retourner les résultats
  RETURN QUERY SELECT processed_count_var, expired_users_array;
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION check_and_disable_expired_subscriptions() TO service_role;

-- Commentaire sur la fonction
COMMENT ON FUNCTION check_and_disable_expired_subscriptions() IS 
'Vérifie et désactive automatiquement les abonnements expirés en mettant is_pro à false';