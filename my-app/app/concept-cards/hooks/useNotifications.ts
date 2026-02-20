import { useState, useEffect } from "react";
import { createClientClient } from "@/lib/supabase";

export function useNotifications(userId: string | undefined) {
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClientClient();

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      
      setUnreadCount(count || 0);
    };

    fetchNotifications();

    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, () => {
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, supabase]);

  return { unreadCount };
}
