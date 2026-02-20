import { createClient } from '@supabase/supabase-js';

// Singleton pattern to prevent multiple instances
let clientInstance: ReturnType<typeof createClient> | null = null;

// Client-side client (for React components)
export const createClientClient = () => {
  if (clientInstance) return clientInstance;
  
  clientInstance = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // DISABLE Navigator LockManager completely!
        // Use simple async function instead of browser locks
        lock: async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
          return await fn();
        },
        // Auto-refresh tokens
        autoRefreshToken: true,
        // Persist session
        persistSession: true,
        // Detect session in URL (for OAuth)
        detectSessionInUrl: true,
      },
    }
  );
  
  return clientInstance;
};

// Server-side client (for API routes, Server Components)
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
};

// Hook for React components - ensures singleton
export const useSupabase = () => {
  return createClientClient();
};

// Types for our database tables
export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  tips_given: number;
  tips_received: number;
  yallpoints: number;
  yallpoints_earned: number;
  last_points_reset: string;
  account_type: 'regular' | 'business';
  business_name: string | null;
  is_verified: boolean;
  qr_code_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  user_id: string;
  content: string;
  location_name: string | null;
  lat: number | null;
  lng: number | null;
  likes: number;
  tips: number;
  category: 'live' | 'hot' | 'alerts' | 'deals';
  is_hot: boolean;
  is_important: boolean;
  is_business: boolean;
  is_alert: boolean;
  manual_flag: string | null;
  expires_at: string;
  created_at: string;
};

export type MessageWithUser = Message & {
  profiles: Profile;
};

export type Reply = {
  id: string;
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type ReplyWithUser = Reply & {
  profiles: Profile;
};

export type Tip = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message_id: string | null;
  amount: number;
  reason: string | null;
  is_profile_tip: boolean;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: 'tip_sent' | 'tip_received' | 'purchase' | 'monthly_reset';
  amount: number;
  related_user_id: string | null;
  related_message_id: string | null;
  description: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: 'reply' | 'tip' | 'alert' | 'mention';
  title: string;
  body: string;
  related_user_id: string | null;
  related_message_id: string | null;
  is_read: boolean;
  created_at: string;
};
