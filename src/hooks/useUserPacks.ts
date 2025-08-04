import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type UserPack = Database['public']['Tables']['user_packs']['Row'];
type SearchUsage = Database['public']['Tables']['search_usage']['Row'];

interface UserSearchStatus {
  canSearch: boolean;
  searchType: 'free' | 'pack' | 'subscription';
  remainingSearches: number | 'unlimited';
  currentPack?: UserPack;
  freeSearchesUsed: number;
  packExpiresAt?: string;
}

export const useUserPacks = () => {
  const { user, profile } = useAuth();
  const [userPacks, setUserPacks] = useState<UserPack[]>([]);
  const [searchUsage, setSearchUsage] = useState<SearchUsage[]>([]);
  const [searchStatus, setSearchStatus] = useState<UserSearchStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les packs de l'utilisateur
  const fetchUserPacks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_packs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPacks(data || []);
    } catch (err: any) {
      console.error('Error fetching user packs:', err);
      setError(err.message);
    }
  };

  // Récupérer l'historique des recherches
  const fetchSearchUsage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('search_usage')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSearchUsage(data || []);
    } catch (err: any) {
      console.error('Error fetching search usage:', err);
      setError(err.message);
    }
  };

  // Vérifier le statut de recherche de l'utilisateur
  const checkSearchStatus = async () => {
    if (!user || !profile) return;

    try {
      // Appeler la fonction Supabase pour vérifier si l'utilisateur peut rechercher
      const { data, error } = await supabase.rpc('can_user_search', {
        user_uuid: user.id
      });

      if (error) throw error;

      // Récupérer le pack actif
      const activePack = userPacks.find(pack => 
        pack.status === 'active' && 
        (!pack.expires_at || new Date(pack.expires_at) > new Date())
      );

      let searchType: 'free' | 'pack' | 'subscription' = 'free';
      let remainingSearches: number | 'unlimited' = 2 - (profile.search_count || 0);

      if (profile.is_pro) {
        searchType = 'subscription';
        remainingSearches = 'unlimited';
      } else if (activePack) {
        searchType = 'pack';
        remainingSearches = activePack.total_searches - activePack.used_searches;
      }

      setSearchStatus({
        canSearch: data,
        searchType,
        remainingSearches,
        currentPack: activePack,
        freeSearchesUsed: profile.search_count || 0,
        packExpiresAt: activePack?.expires_at || undefined
      });
    } catch (err: any) {
      console.error('Error checking search status:', err);
      setError(err.message);
    }
  };

  // Consommer une recherche
  const consumeSearch = async (
    codePostal: string,
    commune?: string,
    surfaceMin?: number,
    surfaceMax?: number,
    resultCount: number = 0
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.rpc('consume_search', {
        user_uuid: user.id,
        postal_code: codePostal,
        commune_name: commune,
        min_surface: surfaceMin,
        max_surface: surfaceMax,
        result_count: resultCount
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.message || 'Failed to consume search');
      }

      // Rafraîchir les données
      await Promise.all([
        fetchUserPacks(),
        fetchSearchUsage(),
        checkSearchStatus()
      ]);

      return data;
    } catch (err: any) {
      console.error('Error consuming search:', err);
      throw err;
    }
  };

  // Activer un pack après achat
  const activatePack = async (
    packType: 'packDecouverte' | 'packStandard' | 'packIntensif' | 'abonnementIllimite',
    stripePaymentIntent?: string,
    stripeSubscription?: string
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase.rpc('activate_user_pack', {
        user_uuid: user.id,
        pack_type_param: packType,
        stripe_payment_intent: stripePaymentIntent,
        stripe_subscription: stripeSubscription
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error('Failed to activate pack');
      }

      // Rafraîchir les données
      await Promise.all([
        fetchUserPacks(),
        checkSearchStatus()
      ]);

      return data;
    } catch (err: any) {
      console.error('Error activating pack:', err);
      throw err;
    }
  };

  // Récupérer le pack actuel de l'utilisateur
  const getCurrentPack = () => {
    return userPacks.find(pack => 
      pack.status === 'active' && 
      (!pack.expires_at || new Date(pack.expires_at) > new Date())
    );
  };

  // Vérifier si un pack est expiré
  const isPackExpired = (pack: UserPack) => {
    return pack.expires_at && new Date(pack.expires_at) < new Date();
  };

  // Vérifier si un pack est consommé
  const isPackConsumed = (pack: UserPack) => {
    return pack.used_searches >= pack.total_searches;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await Promise.all([
          fetchUserPacks(),
          fetchSearchUsage()
        ]);
      } catch (err) {
        console.error('Error loading user pack data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (userPacks.length > 0 && profile) {
      checkSearchStatus();
    }
  }, [userPacks, profile]);

  return {
    userPacks,
    searchUsage,
    searchStatus,
    loading,
    error,
    consumeSearch,
    activatePack,
    getCurrentPack,
    isPackExpired,
    isPackConsumed,
    refreshData: () => Promise.all([fetchUserPacks(), fetchSearchUsage(), checkSearchStatus()])
  };
};