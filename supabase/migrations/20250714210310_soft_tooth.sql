/*
# Migration pour la gestion des packs de recherche

1. Nouvelles tables
   - `user_packs` : Gestion des packs achetés par les utilisateurs
   - `search_usage` : Historique détaillé des recherches effectuées

2. Colonnes ajoutées à profiles
   - `current_pack_type` : Type de pack actuel de l'utilisateur
   - `remaining_searches` : Nombre de recherches restantes
   - `pack_expires_at` : Date d'expiration du pack actuel

3. Fonctions
   - `can_user_search` : Vérifier si l'utilisateur peut effectuer une recherche
   - `consume_search` : Consommer une recherche et mettre à jour les compteurs
   - `activate_user_pack` : Activer un pack après achat

4. Sécurité
   - RLS activé sur toutes les nouvelles tables
   - Politiques pour limiter l'accès aux données de l'utilisateur
*/

-- Créer le type enum pour les packs
DO $$ BEGIN
    CREATE TYPE pack_type AS ENUM (
        'pack_decouverte',
        'pack_serenite', 
        'pack_projet_maison',
        'abonnement_liberte'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Créer le type enum pour les statuts de pack
DO $$ BEGIN
    CREATE TYPE pack_status AS ENUM ('active', 'expired', 'consumed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table pour gérer les packs utilisateur
CREATE TABLE IF NOT EXISTS user_packs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    pack_type pack_type NOT NULL,
    stripe_payment_intent_id text,
    stripe_subscription_id text,
    total_searches integer NOT NULL DEFAULT 0,
    used_searches integer NOT NULL DEFAULT 0,
    purchased_at timestamptz DEFAULT now(),
    expires_at timestamptz,
    status pack_status DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Table pour l'historique des recherches
CREATE TABLE IF NOT EXISTS search_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_pack_id uuid REFERENCES user_packs(id),
    code_postal text NOT NULL,
    commune text,
    surface_min integer,
    surface_max integer,
    results_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    ip_address inet,
    user_agent text
);

-- Ajouter les nouvelles colonnes à la table profiles (seulement si elles n'existent pas)
DO $$ 
BEGIN
    -- Ajouter current_pack_type
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'current_pack_type'
    ) THEN
        ALTER TABLE profiles ADD COLUMN current_pack_type pack_type;
    END IF;

    -- Ajouter remaining_searches
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'remaining_searches'
    ) THEN
        ALTER TABLE profiles ADD COLUMN remaining_searches integer DEFAULT 0;
    END IF;

    -- Ajouter pack_expires_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'pack_expires_at'
    ) THEN
        ALTER TABLE profiles ADD COLUMN pack_expires_at timestamptz;
    END IF;
END $$;

-- Activer RLS sur les nouvelles tables
ALTER TABLE user_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_usage ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour user_packs
CREATE POLICY "Users can view their own packs"
    ON user_packs FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own packs"
    ON user_packs FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own packs"
    ON user_packs FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- Politiques RLS pour search_usage
CREATE POLICY "Users can view their own search usage"
    ON search_usage FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own search usage"
    ON search_usage FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_user_packs_user_id ON user_packs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_packs_status ON user_packs(status);
CREATE INDEX IF NOT EXISTS idx_user_packs_expires_at ON user_packs(expires_at);
CREATE INDEX IF NOT EXISTS idx_search_usage_user_id ON search_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_search_usage_created_at ON search_usage(created_at);

-- Fonction pour vérifier si un utilisateur peut effectuer une recherche
CREATE OR REPLACE FUNCTION can_user_search(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_profile profiles%ROWTYPE;
    active_pack user_packs%ROWTYPE;
BEGIN
    -- Récupérer le profil utilisateur
    SELECT * INTO user_profile FROM profiles WHERE id = user_uuid;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Si l'utilisateur est Pro (abonnement), il peut toujours rechercher
    IF user_profile.is_pro THEN
        RETURN true;
    END IF;
    
    -- Chercher un pack actif et non expiré
    SELECT * INTO active_pack 
    FROM user_packs 
    WHERE user_id = user_uuid 
        AND status = 'active'
        AND (expires_at IS NULL OR expires_at > now())
        AND used_searches < total_searches
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Si un pack actif existe
    IF FOUND THEN
        RETURN true;
    END IF;
    
    -- Sinon, vérifier les recherches gratuites (max 2)
    RETURN COALESCE(user_profile.search_count, 0) < 2;
END;
$$;

-- Fonction pour consommer une recherche
CREATE OR REPLACE FUNCTION consume_search(
    user_uuid uuid,
    postal_code text,
    commune_name text DEFAULT NULL,
    min_surface integer DEFAULT NULL,
    max_surface integer DEFAULT NULL,
    result_count integer DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_profile profiles%ROWTYPE;
    active_pack user_packs%ROWTYPE;
    search_type text;
    remaining integer;
    pack_found boolean := false;
BEGIN
    -- Récupérer le profil utilisateur
    SELECT * INTO user_profile FROM profiles WHERE id = user_uuid;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'User not found');
    END IF;
    
    -- Vérifier si l'utilisateur peut rechercher
    IF NOT can_user_search(user_uuid) THEN
        RETURN json_build_object('success', false, 'message', 'Search limit reached');
    END IF;
    
    -- Si l'utilisateur est Pro
    IF user_profile.is_pro THEN
        search_type := 'subscription';
        remaining := -1; -- Illimité
    ELSE
        -- Chercher un pack actif
        SELECT * INTO active_pack 
        FROM user_packs 
        WHERE user_id = user_uuid 
            AND status = 'active'
            AND (expires_at IS NULL OR expires_at > now())
            AND used_searches < total_searches
        ORDER BY created_at DESC
        LIMIT 1;
        
        IF FOUND THEN
            pack_found := true;
            search_type := 'pack';
            
            -- Incrémenter les recherches utilisées du pack
            UPDATE user_packs 
            SET used_searches = used_searches + 1,
                updated_at = now()
            WHERE id = active_pack.id;
            
            -- Marquer comme consommé si toutes les recherches sont utilisées
            IF active_pack.used_searches + 1 >= active_pack.total_searches THEN
                UPDATE user_packs 
                SET status = 'consumed'
                WHERE id = active_pack.id;
            END IF;
            
            remaining := active_pack.total_searches - (active_pack.used_searches + 1);
        ELSE
            -- Utiliser les recherches gratuites
            search_type := 'free';
            
            -- Incrémenter le compteur de recherches gratuites
            UPDATE profiles 
            SET search_count = COALESCE(search_count, 0) + 1,
                updated_at = now()
            WHERE id = user_uuid;
            
            remaining := 2 - (COALESCE(user_profile.search_count, 0) + 1);
        END IF;
    END IF;
    
    -- Enregistrer l'usage de la recherche
    INSERT INTO search_usage (
        user_id, 
        user_pack_id, 
        code_postal, 
        commune, 
        surface_min, 
        surface_max, 
        results_count
    ) VALUES (
        user_uuid,
        CASE WHEN pack_found THEN active_pack.id ELSE NULL END,
        postal_code,
        commune_name,
        min_surface,
        max_surface,
        result_count
    );
    
    RETURN json_build_object(
        'success', true,
        'search_type', search_type,
        'remaining_searches', remaining,
        'pack_id', CASE WHEN pack_found THEN active_pack.id ELSE NULL END
    );
END;
$$;

-- Fonction pour activer un pack après achat
CREATE OR REPLACE FUNCTION activate_user_pack(
    user_uuid uuid,
    pack_type_param pack_type,
    stripe_payment_intent text DEFAULT NULL,
    stripe_subscription text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    pack_config record;
    new_pack_id uuid;
    expires_date timestamptz;
BEGIN
    -- Configuration des packs
    CASE pack_type_param
        WHEN 'pack_decouverte' THEN
            pack_config := ROW(5, 30); -- 5 recherches, 30 jours
        WHEN 'pack_serenite' THEN
            pack_config := ROW(20, 90); -- 20 recherches, 90 jours
        WHEN 'pack_projet_maison' THEN
            pack_config := ROW(100, 365); -- 100 recherches, 365 jours
        WHEN 'abonnement_liberte' THEN
            pack_config := ROW(-1, NULL); -- Illimité, géré par l'abonnement
        ELSE
            RETURN json_build_object('success', false, 'message', 'Invalid pack type');
    END CASE;
    
    -- Calculer la date d'expiration
    IF pack_config.f2 IS NOT NULL THEN
        expires_date := now() + (pack_config.f2 || ' days')::interval;
    END IF;
    
    -- Créer le pack
    INSERT INTO user_packs (
        user_id,
        pack_type,
        stripe_payment_intent_id,
        stripe_subscription_id,
        total_searches,
        expires_at
    ) VALUES (
        user_uuid,
        pack_type_param,
        stripe_payment_intent,
        stripe_subscription,
        CASE WHEN pack_config.f1 = -1 THEN 999999 ELSE pack_config.f1 END,
        expires_date
    ) RETURNING id INTO new_pack_id;
    
    -- Mettre à jour le profil utilisateur
    UPDATE profiles 
    SET current_pack_type = pack_type_param,
        remaining_searches = CASE WHEN pack_config.f1 = -1 THEN 999999 ELSE pack_config.f1 END,
        pack_expires_at = expires_date,
        updated_at = now()
    WHERE id = user_uuid;
    
    -- Si c'est l'abonnement liberté, activer le statut Pro
    IF pack_type_param = 'abonnement_liberte' THEN
        UPDATE profiles 
        SET is_pro = true
        WHERE id = user_uuid;
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'pack_id', new_pack_id,
        'expires_at', expires_date
    );
END;
$$;

-- Fonction pour nettoyer les packs expirés
CREATE OR REPLACE FUNCTION cleanup_expired_packs()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    expired_count integer;
BEGIN
    -- Marquer les packs expirés
    UPDATE user_packs 
    SET status = 'expired',
        updated_at = now()
    WHERE status = 'active' 
        AND expires_at IS NOT NULL 
        AND expires_at < now();
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    
    -- Mettre à jour les profils des utilisateurs avec des packs expirés
    UPDATE profiles 
    SET current_pack_type = NULL,
        remaining_searches = 0,
        pack_expires_at = NULL,
        updated_at = now()
    WHERE id IN (
        SELECT DISTINCT user_id 
        FROM user_packs 
        WHERE status = 'expired' 
            AND updated_at > now() - interval '1 minute'
    );
    
    RETURN json_build_object(
        'success', true,
        'expired_packs', expired_count
    );
END;
$$;

-- Créer une vue pour le statut utilisateur
CREATE OR REPLACE VIEW user_search_status AS
SELECT 
    p.id as user_id,
    p.email,
    p.is_pro,
    p.search_count,
    p.current_pack_type,
    p.remaining_searches,
    p.pack_expires_at,
    up.id as active_pack_id,
    up.total_searches,
    up.used_searches,
    up.expires_at as pack_expires_at_detailed,
    up.status as pack_status,
    can_user_search(p.id) as can_search
FROM profiles p
LEFT JOIN user_packs up ON p.id = up.user_id 
    AND up.status = 'active' 
    AND (up.expires_at IS NULL OR up.expires_at > now());