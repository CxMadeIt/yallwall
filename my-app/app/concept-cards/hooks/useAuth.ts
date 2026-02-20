import { useState, useEffect } from "react";
import { createClientClient, Profile } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const supabase = createClientClient();

  useEffect(() => {
    const checkAuth = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth check timeout')), 3000)
          );
          
          const sessionPromise = supabase.auth.getSession();
          const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
          
          if (session) {
            setIsAuthenticated(true);
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (profile) {
              setUser(profile);
              const createdAt = new Date((profile as any).created_at);
              const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
              const hasSeenOnboarding = localStorage.getItem('yallwall_onboarding_complete');
              if (createdAt > oneHourAgo && !hasSeenOnboarding) {
                setShowOnboarding(true);
              }
            } else {
              // Create temporary profile
              setUser({
                id: session.user.id,
                username: session.user.email?.split('@')[0] || 'user',
                display_name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                avatar_url: session.user.user_metadata?.avatar_url || null,
                city: 'Cenla',
                state: 'LA',
                lat: null,
                lng: null,
                tips_given: 0,
                tips_received: 0,
                yallpoints: 250,
                yallpoints_earned: 0,
                last_points_reset: new Date().toISOString(),
                account_type: 'regular',
                business_name: null,
                is_verified: false,
                qr_code_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              } as any);
              setShowOnboarding(true);
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
          setLoading(false);
          return;
        } catch (error) {
          if (i === retries - 1) {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
          } else {
            await new Promise(r => setTimeout(r, 500));
          }
        }
      }
    };
    
    setTimeout(() => checkAuth(), 100);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profile) {
          setUser(profile);
        } else {
          setUser({
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'user',
            display_name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.user_metadata?.avatar_url || null,
            city: 'Cenla',
            state: 'LA',
            lat: null,
            lng: null,
            tips_given: 0,
            tips_received: 0,
            yallpoints: 250,
            yallpoints_earned: 0,
            last_points_reset: new Date().toISOString(),
            account_type: 'regular',
            business_name: null,
            is_verified: false,
            qr_code_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as any);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  return { user, isAuthenticated, loading, showOnboarding, setShowOnboarding, signOut, setUser };
}
