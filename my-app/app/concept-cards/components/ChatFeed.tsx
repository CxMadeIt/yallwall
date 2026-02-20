"use client";

import { useMemo } from "react";
import { MessageCard } from "./MessageCard";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Message } from "../hooks/useMessages";
import { triggerHaptic } from "../lib/utils";

interface ChatFeedProps {
  messages: Message[];
  isLoading: boolean;
  activeTab: string;
  likedMessages: Set<string>;
  currentUserId?: string;
  newPostsCount: number;
  onTip: (recipient: { id: string; username: string }, messageId: string) => void;
  onThread: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onLike: (messageId: string, currentLikes: number) => void;
  onDismissNewPosts: () => void;
  onCreatePost?: () => void;
}

export function ChatFeed({
  messages,
  isLoading,
  activeTab,
  likedMessages,
  currentUserId,
  newPostsCount,
  onTip,
  onThread,
  onDelete,
  onLike,
  onDismissNewPosts,
  onCreatePost,
}: ChatFeedProps) {
  // Filter messages based on active tab
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      switch (activeTab) {
        case 'hot':
          return (msg.tips || 0) > 0 || (msg.likes || 0) >= 5;
        case 'alerts':
          return msg.category === 'alerts' || msg.isImportant;
        case 'deals':
          return msg.category === 'deals' || msg.isBusiness;
        case 'live':
        default:
          return true;
      }
    });
  }, [messages, activeTab]);

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-2">
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  if (filteredMessages.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-2">
        <EmptyState activeTab={activeTab} onCreatePost={onCreatePost} />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-2">
      {/* New Posts Indicator */}
      {newPostsCount > 0 && (
        <button
          onClick={() => {
            triggerHaptic(30);
            onDismissNewPosts();
          }}
          className="sticky top-20 z-20 w-full py-2 px-4 mb-4 rounded-full text-sm font-medium text-white animate-bounce"
          style={{ backgroundColor: '#F5A623' }}
        >
          {newPostsCount} new post{newPostsCount > 1 ? 's' : ''} - Tap to refresh
        </button>
      )}

      {/* Messages */}
      <div className="space-y-1">
        {filteredMessages.map((msg) => (
          <MessageCard
            key={msg.id}
            message={msg}
            onTip={() => onTip({ id: msg.user_id, username: msg.user }, msg.id)}
            onThread={() => {
              triggerHaptic(30);
              onThread(msg);
            }}
            onDelete={() => onDelete(msg.id)}
            onLike={() => onLike(msg.id, msg.likes)}
            isLiked={likedMessages.has(msg.id)}
            currentUserId={currentUserId}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <button className="text-xs text-white/30 hover:text-white/50 transition-colors">
          Load more messages...
        </button>
      </div>

      {/* Email Signup */}
      <div 
        className="mx-4 mb-8 p-6 rounded-2xl"
        style={{ 
          backgroundColor: 'rgba(245,166,35,0.08)', 
          border: '1px solid rgba(245,166,35,0.2)' 
        }}
      >
        <div className="text-center mb-4">
          <h3 className="text-white font-semibold text-lg mb-1">Don&apos;t Miss the Wall</h3>
          <p className="text-white/50 text-sm">
            Get the juiciest local drama, events, weather alerts, and free tacos. 
            No spam, just vibes. 🌮
          </p>
        </div>
        <form 
          className="flex gap-2" 
          onSubmit={(e) => { 
            e.preventDefault(); 
            alert('Thanks for signing up! We\'ll keep you posted.'); 
          }}
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400/50"
            required
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 hover:opacity-90"
            style={{ backgroundColor: '#64748B' }}
          >
            Join
          </button>
        </form>
        <p className="text-center text-white/30 text-xs mt-3">
          We pinky promise not to ghost you... unless you&apos;re boring.
        </p>
      </div>
    </div>
  );
}
