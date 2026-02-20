"use client";

import { COLORS } from "../lib/constants";

interface EmptyStateProps {
  activeTab: string;
  onCreatePost?: () => void;
}

export function EmptyState({ activeTab, onCreatePost }: EmptyStateProps) {
  const getMessage = () => {
    switch (activeTab) {
      case 'hot':
        return {
          emoji: '🔥',
          title: 'Nothing hot right now',
          description: 'Be the first to tip a post and make it hot!',
        };
      case 'alerts':
        return {
          emoji: '✅',
          title: 'All clear!',
          description: 'No active alerts in your area. Stay safe!',
        };
      case 'deals':
        return {
          emoji: '🏪',
          title: 'No local deals',
          description: 'Check back later or post your own deal!',
        };
      default:
        return {
          emoji: '🦝',
          title: 'No messages yet',
          description: 'Be the first to post on the YallWall!',
        };
    }
  };

  const { emoji, title, description } = getMessage();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      {/* Animated Mascot/Emoji */}
      <div 
        className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6"
        style={{ 
          backgroundColor: `${COLORS.yellow}20`,
          border: `2px solid ${COLORS.yellow}40`,
        }}
      >
        <span className="animate-bounce">{emoji}</span>
      </div>

      {/* Title */}
      <h3 
        className="text-xl font-bold mb-2"
        style={{ color: COLORS.cream }}
      >
        {title}
      </h3>

      {/* Description */}
      <p 
        className="text-center text-sm mb-6 max-w-xs"
        style={{ color: 'rgba(250, 248, 245, 0.6)' }}
      >
        {description}
      </p>

      {/* CTA Button */}
      {onCreatePost && (
        <button
          onClick={onCreatePost}
          className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 hover:opacity-90"
          style={{ backgroundColor: COLORS.accent }}
        >
          Create First Post
        </button>
      )}
    </div>
  );
}
