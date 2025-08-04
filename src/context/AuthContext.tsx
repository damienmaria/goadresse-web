import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer le profil avec retry logic amélioré
  const fetchProfile = async (userId: string, retryCount = 0): Promise<Profile | null> => {
    const maxRetries = 5; // Augmenté pour plus de résilience
    
    try {
      console.log(`🔄 Tentative ${retryCount + 1} de récupération du profil pour:`, userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Erreur lors de la récupération du profil:', error);
        
        // Si c'est une erreur de permission et qu'on n'a pas encore essayé plusieurs fois
        if (error.code === '42501' && retryCount < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 8000); // Exponential backoff avec max 8s
          console.log(`⏳ Retry dans ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchProfile(userId, retryCount + 1);
        }
        
        return null;
      }

      if (data) {
        console.log('✅ Profil récupéré avec succès:', data.email);
        return data;
      }

      // Si pas de données mais pas d'erreur, retry avec backoff exponentiel
      if (retryCount < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
        console.log(`⏳ Aucune donnée trouvée, retry dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchProfile(userId, retryCount + 1);
      }

      return null;
    } catch (error) {
      console.error('❌ Erreur critique lors de la récupération du profil:', error);
      
      if (retryCount < maxRetries) {
        const delay = Math.min(2000 * Math.pow(2, retryCount), 10000); // Délai plus long pour erreurs critiques
        console.log(`⏳ Retry dans ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchProfile(userId, retryCount + 1);
      }
      
      return null;
    }
  };

  // Fonction pour créer un profil avec gestion améliorée des doublons
  const createProfile = async (user: User): Promise<Profile | null> => {
    try {
      console.log('📝 Création d\'un nouveau profil pour:', user.email);
      
      const profileData = {
        id: user.id,
        email: user.email || '',
        is_pro: false,
        search_count: 0
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de la création du profil:', error);
        
        // Si le profil existe déjà (erreur de contrainte unique)
        if (error.code === '23505') {
          console.log('📋 Profil existe déjà, récupération avec retry...');
          // Attendre un peu avant de récupérer pour laisser le temps à la DB de se synchroniser
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await fetchProfile(user.id);
        }
        
        return null;
      }

      if (data) {
        console.log('✅ Nouveau profil créé avec succès:', data.email);
        return data;
      }

      return null;
    } catch (error) {
      console.error('❌ Erreur critique lors de la création du profil:', error);
      
      // En cas d'erreur critique, essayer quand même de récupérer le profil existant
      console.log('🔄 Tentative de récupération du profil existant après erreur...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return await fetchProfile(user.id);
    }
  };

  // Fonction principale pour gérer le profil avec logique améliorée
  const handleUserProfile = async (user: User) => {
    try {
      // D'abord essayer de récupérer le profil existant avec retry
      let userProfile = await fetchProfile(user.id);
      
      // Si pas de profil trouvé, essayer de le créer
      if (!userProfile) {
        console.log('📝 Aucun profil trouvé, création en cours...');
        userProfile = await createProfile(user);
      }
      
      // Si on a toujours pas de profil, faire une dernière tentative de récupération
      if (!userProfile) {
        console.log('⏳ Dernière tentative de récupération...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        userProfile = await fetchProfile(user.id);
      }
      
      if (userProfile) {
        setProfile(userProfile);
      } else {
        console.error('❌ Impossible de récupérer ou créer le profil après toutes les tentatives');
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ Erreur dans handleUserProfile:', error);
      setProfile(null);
    }
  };

  // Fonction publique pour rafraîchir le profil
  const refreshProfile = async () => {
    if (!user) {
      console.log('❌ Pas d\'utilisateur pour rafraîchir le profil');
      setProfile(null);
      return;
    }

    try {
      console.log('🔄 Rafraîchissement du profil pour:', user.email);
      await handleUserProfile(user);
    } catch (error) {
      console.error('❌ Erreur lors du refresh du profil:', error);
    }
  };

  // Gestionnaire des changements d'état d'authentification
  const handleAuthStateChange = async (event: string, session: any) => {
    console.log('🔄 Auth state changed:', event, session?.user?.email);
    
    try {
      if (session?.user) {
        console.log('👤 Utilisateur connecté:', session.user.email);
        setUser(session.user);
        
        // Attendre un peu plus pour que les permissions RLS soient bien en place
        setTimeout(async () => {
          await handleUserProfile(session.user);
        }, 1000); // Augmenté de 500ms à 1000ms
      } else {
        console.log('👤 Utilisateur déconnecté');
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ Erreur lors du changement d\'état d\'auth:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialisation de l'authentification
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initialisation de l\'authentification...');
        
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Erreur lors de la récupération de la session:', error);
          if (mounted) setLoading(false);
          return;
        }

        if (!mounted) return;

        if (session?.user) {
          console.log('✅ Session active trouvée pour:', session.user.email);
          setUser(session.user);
          
          // Attendre plus longtemps pour que les permissions soient en place
          setTimeout(async () => {
            if (mounted) {
              await handleUserProfile(session.user);
            }
          }, 1500); // Augmenté de 1000ms à 1500ms
        } else {
          console.log('ℹ️ Aucune session active');
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de l\'auth:', error);
        setUser(null);
        setProfile(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Écouter les changements d'état d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Écouter les changements de stockage pour synchroniser entre les onglets
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' || e.key?.startsWith('sb-')) {
        console.log('🔄 Changement de stockage détecté');
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted) {
              handleAuthStateChange('STORAGE_CHANGE', session);
            }
          }).catch(error => {
            console.error('❌ Erreur lors de la vérification de session:', error);
          });
        }, 500); // Délai augmenté pour plus de stabilité
      }
    };

    // Écouter les changements de visibilité de la page
    const handleVisibilityChange = () => {
      if (!document.hidden && mounted) {
        console.log('🔄 Page redevenue visible');
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user && (!user || !profile)) {
              console.log('🔄 Rechargement nécessaire après retour');
              handleAuthStateChange('VISIBILITY_CHANGE', session);
            }
          }).catch(error => {
            console.error('❌ Erreur lors de la vérification de session:', error);
          });
        }, 1000); // Délai augmenté
      }
    };

    // Écouter les événements de focus de la fenêtre
    const handleWindowFocus = () => {
      if (mounted) {
        console.log('🔄 Fenêtre refocalisée');
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user && (!user || !profile)) {
              console.log('🔄 Rechargement nécessaire après focus');
              handleAuthStateChange('WINDOW_FOCUS', session);
            }
          }).catch(error => {
            console.error('❌ Erreur lors de la vérification de session:', error);
          });
        }, 1000); // Délai augmenté
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};