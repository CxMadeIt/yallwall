import { useState, useEffect, useCallback } from "react";
import { createClientClient } from "@/lib/supabase";
import { MessageDisplay, ReplyDisplay } from "../types";
import { formatTime } from "../utils";

export function useThread(message: MessageDisplay | null) {
  const [replies, setReplies] = useState<ReplyDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClientClient();

  const fetchReplies = useCallback(async () => {
    if (!message) return;
    
    setLoading(true);
    const { data: repliesData, error } = await supabase
      .from('replies')
      .select('*')
      .eq('message_id', message.id)
      .order('created_at', { ascending: true });
    
    if (repliesData && !error) {
      const userIds = [...new Set(repliesData.map((r: any) => r.user_id))];
      
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
    setLoading(false);
  }, [message, supabase]);

  useEffect(() => {
    if (message) {
      fetchReplies();
    } else {
      setReplies([]);
    }
  }, [message, fetchReplies]);

  const addReply = async (text: string, userId: string) => {
    if (!message) return null;

    const { data, error } = await supabase
      .from('replies')
      .insert({
        message_id: message.id,
        user_id: userId,
        content: text,
      } as any)
      .select();

    if (!error) {
      await fetchReplies();
      return data;
    }
    throw error;
  };

  const deleteReply = async (replyId: string | number) => {
    const { error } = await supabase
      .from('replies')
      .delete()
      .eq('id', replyId);
    
    if (!error) {
      setReplies(prev => prev.filter(r => r.id !== replyId));
    } else {
      throw error;
    }
  };

  return { replies, loading, addReply, deleteReply, refresh: fetchReplies };
}
