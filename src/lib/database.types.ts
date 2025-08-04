export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_packs: {
        Row: {
          id: string
          user_id: string
          pack_type: 'packDecouverte' | 'packSerenite' | 'packLiberte'
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          total_searches: number
          used_searches: number
          purchased_at: string
          expires_at: string | null
          status: 'active' | 'expired' | 'consumed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pack_type: 'packDecouverte' | 'packSerenite' | 'packLiberte'
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          total_searches?: number
          used_searches?: number
          purchased_at?: string
          expires_at?: string | null
          status?: 'active' | 'expired' | 'consumed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pack_type?: 'packDecouverte' | 'packSerenite' | 'packLiberte'
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          total_searches?: number
          used_searches?: number
          purchased_at?: string
          expires_at?: string | null
          status?: 'active' | 'expired' | 'consumed'
          created_at?: string
          updated_at?: string
        }
      }
      search_usage: {
        Row: {
          id: string
          user_id: string
          user_pack_id: string | null
          code_postal: string
          commune: string | null
          surface_min: number | null
          surface_max: number | null
          results_count: number
          created_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          user_id: string
          user_pack_id?: string | null
          code_postal: string
          commune?: string | null
          surface_min?: number | null
          surface_max?: number | null
          results_count?: number
          created_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          user_pack_id?: string | null
          code_postal?: string
          commune?: string | null
          surface_min?: number | null
          surface_max?: number | null
          results_count?: number
          created_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          is_pro: boolean
          stripe_customer_id: string | null
          created_at: string
          updated_at: string | null
          subscription_start_date: string | null
          subscription_end_date: string | null
          subscription_status: 'active' | 'canceled' | 'past_due' | 'unpaid' | null
          search_count: number
          current_pack_type: 'packDecouverte' | 'packSerenite' | 'packLiberte' | null
          remaining_searches: number
          pack_expires_at: string | null
        }
        Insert: {
          id: string
          email: string
          is_pro?: boolean
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | null
          search_count?: number
          current_pack_type?: 'packDecouverte' | 'packSerenite' | 'packLiberte' | null
          remaining_searches?: number
          pack_expires_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          is_pro?: boolean
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | null
          search_count?: number
          current_pack_type?: 'packDecouverte' | 'packSerenite' | 'packLiberte' | null
          remaining_searches?: number
          pack_expires_at?: string | null
        }
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          code_postal: string
          commune: string
          surface_min: number
          surface_max: number
          results_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code_postal: string
          commune: string
          surface_min: number
          surface_max: number
          results_count: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          code_postal?: string
          commune?: string
          surface_min?: number
          surface_max?: number
          results_count?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}