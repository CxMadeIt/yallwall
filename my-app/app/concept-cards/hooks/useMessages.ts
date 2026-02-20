import { useState, useEffect, useCallback } from "react";
import { createClientClient } from "@/lib/supabase";
import { MessageDisplay } from "../types";
import { formatTime, SAMPLE_MESSAGES } from "../utils";

const PAGE_SIZE = 20;

export function useMessages(isAuthenticated: boolean) {
  const [messages, setMessages] = useState<MessageDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const supabase = createClientClient();

  const fetchMessages = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const from = reset ? 0 : page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (!messagesData || messagesData.length === 0) {
        setHasMore(false);
        if (reset) {
           if (!isAuthenticated) setMessages(SAMPLE_MESSAGES as MessageDisplay[]);
           else setMessages([]);
        }
        setLoading(false);
        return;
      }

      // Check if we reached the end
      if (messagesData.length < PAGE_SIZE) {
        setHasMore(false);
      }

      // 1. Get unique user IDs
      const userIds = [...new Set(messagesData.map((m: any) => m.user_id))];
      const messageIds = messagesData.map((m: any) => m.id);
      
      // 2. Fetch profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);
      
      const profileMap = new Map();
      profilesData?.forEach((p: any) => profileMap.set(p.id, p));
      
      // 3. Fetch reply counts
      const { data: repliesData } = await supabase
        .from('replies')
        .select('message_id')
        .in('message_id', messageIds);
      
      const replyCountMap = new Map();
      repliesData?.forEach((r: any) => {
        replyCountMap.set(r.message_id, (replyCountMap.get(r.message_id) || 0) + 1);
      });
      
      // 4. Format messages
      const formattedMessages = messagesData.map((msg: any) => {
        const profile = profileMap.get(msg.user_id);
        return {
          id: msg.id,
          user_id: msg.user_id,
          user: profile?.display_name || profile?.username || 'Anonymous',
          avatar: (profile?.display_name || profile?.username || 'U').substring(0, 2).toUpperCase(),
          message: msg.content,
          time: formatTime(msg.created_at),
          likes: msg.likes || 0,
          tips: msg.tips || 0,
          location: msg.location_name,
          isHot: msg.is_hot,
          isImportant: msg.is_important,
          isBusiness: msg.is_business_post,
          category: msg.category,
          manual_flag: msg.manual_flag,
          replies: [],
          replyCount: replyCountMap.get(msg.id) || 0,
        };
      });

      if (reset) {
        setMessages(formattedMessages);
        setPage(1);
      } else {
        setMessages(prev => {
          // De-duplicate just in case
          const existingIds = new Set(prev.map(m => m.id));
          const newUnique = formattedMessages.filter(m => !existingIds.has(m.id));
          return [...prev, ...newUnique];
        });
        setPage(prev => prev + 1);
      }

    } catch (err) {
      console.error('Error fetching messages:', err);
      if (reset && !isAuthenticated) {
        setMessages(SAMPLE_MESSAGES as MessageDisplay[]);
      }
    } finally {
      setLoading(false);
    }
  }, [page, loading, isAuthenticated, supabase]);

  // Initial load
  useEffect(() => {
    fetchMessages(true);
  }, []); // Run once on mount

  // Realtime subscription
  useEffect(() => {
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        // Optimistically add the new message to the top
        // In a real app, we'd fetch the full profile, but for now we might just reload
        // or handle it gracefully. Let's trigger a refresh for now to keep it consistent.
        console.log('New message received!', payload);
        fetchMessages(true);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchMessages, supabase]);

  const refresh = useCallback(() => {
    setPage(0);
    setHasMore(true);
    fetchMessages(true);
  }, [fetchMessages]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchMessages(false);
    }
  }, [hasMore, loading, fetchMessages]);

  return { messages, loading, refresh, loadMore, hasMore, setMessages };
}
