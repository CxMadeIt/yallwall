"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClientClient, Profile } from '@/lib/supabase';
import { formatTime } from '../lib/utils';

export interface Reply {
  id: string;
  user_id: string;
  user: string;
  avatar: string;
  message: string;
  time: string;
}

interface UseRepliesReturn {
  replies: Reply[];
  isLoading: boolean;
  createReply: (messageId: string, content: string) => Promise<boolean>;
  deleteReply: (replyId: string) => Promise<boolean>;
  refreshReplies: (messageId: string) => Promise<void>;
  replyCount: number;
}

export function useReplies(
  isAuthenticated: boolean,
  user: Profile | null
): UseRepliesReturn {
  const supabase = createClientClient();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyCount, setReplyCount] = useState(0);

  // Fetch replies for a message
  const refreshReplies = useCallback(async (messageId: string) => {
    if (!messageId) return;

    setIsLoading(true);
    
    try {
      // Fetch replies
      const { data: repliesData, error } = await supabase
        .from('replies')
        .select('*')
        .eq('message_id', messageId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (repliesData) {
        setReplyCount(repliesData.length);

        // Get unique user IDs
        const userIds = [...new Set(repliesData.map((r: any) => r.user_id))];

        // Fetch profiles
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url')
          .in('id', userIds);

        const profileMap = new Map();
        profilesData?.forEach((p: any) => profileMap.set(p.id, p));

        const formatted = repliesData.map((reply: any) => {
          const profile = profileMap.get(reply.user_id);
          return {
            id: reply.id,
            user_id: reply.user_id,
            user: profile?.display_name || profile?.username || 'Anonymous',
            avatar: (profile?.display_name || profile?.username || 'U').substring(0, 2).toUpperCase(),
            message: reply.content,
            time: formatTime(reply.created_at),
          };
        });

        setReplies(formatted);
      }
    } catch (err) {
      console.error('Error fetching replies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // Create a new reply
  const createReply = useCallback(async (
    messageId: string,
    content: string
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.id || !messageId || !content.trim()) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('replies')
        .insert({
          message_id: messageId,
          user_id: user.id,
          content: content.trim(),
        });

      if (error) throw error;

      // Refresh replies
      await refreshReplies(messageId);
      return true;
    } catch (err) {
      console.error('Error creating reply:', err);
      return false;
    }
  }, [supabase, isAuthenticated, user?.id, refreshReplies]);

  // Delete a reply
  const deleteReply = useCallback(async (replyId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;

      // Remove from local state
      setReplies(prev => prev.filter(r => r.id !== replyId));
      setReplyCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      console.error('Error deleting reply:', err);
      return false;
    }
  }, [supabase]);

  return {
    replies,
    isLoading,
    createReply,
    deleteReply,
    refreshReplies,
    replyCount,
  };
}
