import { useState, useRef, useEffect } from "react";
import { createClientClient } from "@/lib/supabase";
import { MessageDisplay } from "../types";

export function useLikes(userId: string | undefined, isAuthenticated: boolean) {
  const [likedMessages, setLikedMessages] = useState<Set<string | number>>(new Set());
  const pendingLikes = useRef<Set<string | number>>(new Set());
  const supabase = createClientClient();

  // Fetch initial likes
  useEffect(() => {
    if (userId) {
      const fetchLikes = async () => {
        const { data: likesData } = await supabase
          .from('user_likes')
          .select('message_id')
          .eq('user_id', userId);
        
        if (likesData) {
          setLikedMessages(new Set(likesData.map((l: any) => l.message_id)));
        }
      };
      fetchLikes();
    }
  }, [userId, supabase]);

  const toggleLike = async (messageId: string | number, currentLikes: number, updateMessage: (id: string | number, updates: Partial<MessageDisplay>) => void) => {
    if (!isAuthenticated || !userId) {
      alert('Please sign in to like posts');
      return;
    }

    if (pendingLikes.current.has(messageId)) return;
    pendingLikes.current.add(messageId);

    const isCurrentlyLiked = likedMessages.has(messageId);

    // Optimistic update
    if (isCurrentlyLiked) {
      setLikedMessages(prev => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });
      updateMessage(messageId, { likes: Math.max(0, currentLikes - 1) });
    } else {
      setLikedMessages(prev => new Set(prev).add(messageId));
      updateMessage(messageId, { likes: currentLikes + 1 });
    }

    try {
      if (isCurrentlyLiked) {
        await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', userId)
          .eq('message_id', messageId);
        
        await (supabase
          .from('messages') as any)
          .update({ likes: Math.max(0, currentLikes - 1) })
          .eq('id', messageId);
      } else {
        await supabase
          .from('user_likes')
          .insert({ user_id: userId, message_id: messageId } as any);
        
        await (supabase
          .from('messages') as any)
          .update({ likes: currentLikes + 1 })
          .eq('id', messageId);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      if (isCurrentlyLiked) {
        setLikedMessages(prev => new Set(prev).add(messageId));
        updateMessage(messageId, { likes: currentLikes });
      } else {
        setLikedMessages(prev => {
          const next = new Set(prev);
          next.delete(messageId);
          return next;
        });
        updateMessage(messageId, { likes: currentLikes });
      }
    } finally {
      setTimeout(() => {
        pendingLikes.current.delete(messageId);
      }, 500);
    }
  };

  return { likedMessages, toggleLike };
}
