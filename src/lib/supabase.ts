import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    debug: false
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

export const loginUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
};

export const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://goadresse.fr',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  
  if (error) throw error;
};

export const registerUser = async (email: string, password: string) => {
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (signUpError) throw signUpError;

  // Le profil sera créé automatiquement par le AuthContext
  return user;
};

export const logoutUser = async () => {
  try {
    console.log('🚪 Début de la déconnexion...');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      throw error;
    }
    
    console.log('✅ Déconnexion réussie');
    
  } catch (error) {
    console.error('❌ Erreur critique lors de la déconnexion:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  const redirectTo = `https://goadresse.fr/reset-password`;
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo
  });
  if (error) throw error;
};

export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
};

export const getUserPayment = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('stripe_customer_id, is_pro, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error) throw error;

  return {
    stripeCustomerId: data.stripe_customer_id,
    isPro: data.is_pro,
    startDate: data.created_at,
    updatedAt: data.updated_at
  };
};