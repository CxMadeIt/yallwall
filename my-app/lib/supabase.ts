import { createClient } from '@supabase/supabase-js';

// Singleton pattern to prevent multiple instances
let clientInstance: ReturnType<typeof createClient> | null = null;

// Client-side client (for React components)
export const createClientClient = () => {
  if (clientInstance) return clientInstance;
  
  clientInstance = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  return clientInstance;
};

// Server-side client (for API routes, Server Components)
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
  is_hot: boolean;
  is_important: boolean;
  is_business: boolean;
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
  tipper_id: string;
  recipient_id: string;
  message_id: string | null;
  amount: number;
  created_at: string;
};
