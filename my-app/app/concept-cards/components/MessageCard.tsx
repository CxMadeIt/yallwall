"use client";

import { memo, useState } from "react";
import { MapPin, Heart, MessageSquare } from "lucide-react";
import { COLORS } from "../lib/constants";
import { triggerHaptic } from "../lib/utils";
import { Message } from "../hooks/useMessages";

// Tip Animation Component
function TipAnimation({ show, onComplete }: { show: boolean; onComplete: () => void }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl"
          style={{
            animation: `tip-coin 0.8s ease-out forwards`,
            animationDelay: `${i * 0.1}s`,
            transform: `rotate(${i * 60}deg) translateY(-30px)`,
          }}
        >
          🪙
        </span>
      ))}
      <div 
        className="absolute w-20 h-20 rounded-full"
        style={{ 
          backgroundColor: `${COLORS.yellow}4D`,
          animation: 'ripple 0.6s ease-out forwards'
        }}
      />
    </div>
  );
}

interface MessageCardProps {
  message: Message;
  onTip: () => void;
  onThread: () => void;
  onDelete?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  currentUserId?: string;
}

function MessageCardComponent({
  message,
  onTip,
  onThread,
  onDelete,
  onLike,
  isLiked,
  currentUserId,
}: MessageCardProps) {
  const [showTipAnim, setShowTipAnim] = useState(false);
  const isOwnPost = currentUserId && message.user_id === currentUserId;

  const handleTip = () => {
    setShowTipAnim(true);
    triggerHaptic(30);
    onTip();
  };

  const handleLike = () => {
    triggerHaptic(30);
    onLike?.();
  };

  const handleDelete = () => {
    if (confirm('Delete this post?')) {
      triggerHaptic(50);
      onDelete?.();
    }
  };

  // Business/Sponsored Card
  if (message.isBusiness) {
    return (
      <div 
        className="w-full my-4 animate-fade-in"
        style={{ animationDelay: `${Math.random() * 100}ms` }}
      >
        <div 
          className="p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] relative overflow-hidden rounded-[18px]"
          onClick={onThread}
          style={{
            backgroundColor: COLORS.cream,
            boxShadow: `
              0 4px 6px rgba(0, 0, 0, 0.07),
              0 10px 20px rgba(0, 0, 0, 0.12),
              0 20px 40px rgba(0, 0, 0, 0.08),
              inset 0 0 0 2px ${COLORS.accent}30
            `,
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0"
              style={{ backgroundColor: COLORS.accent }}
            >
              {message.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold" style={{ color: COLORS.navyText }}>
                  {message.user}
                </span>
                <span 
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
                  style={{ 
                    color: COLORS.accent, 
                    backgroundColor: `${COLORS.accent}15`, 
                    borderColor: `${COLORS.accent}30` 
                  }}
                >
                  Sponsored
                </span>
              </div>
              
              {/* Image */}
              {message.image_url && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={message.image_url} 
                    alt="Post" 
                    className="w-full h-auto max-h-48 object-cover"
                  />
                </div>
              )}
              
              <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.navyText }}>
                {message.message}
              </p>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleTip(); }}
                  className="relative flex items-center gap-1.5 transition-colors"
                  style={{ color: COLORS.accent }}
                >
                  <TipAnimation show={showTipAnim} onComplete={() => setShowTipAnim(false)} />
                  <span className="text-lg">🪙</span>
                  <span className="font-semibold text-sm">{message.tips}</span>
                  <span className="text-xs" style={{ color: COLORS.navyMuted }}>tips</span>
                </button>
                <span style={{ color: COLORS.navyMuted }}>|</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onThread(); }}
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{ color: COLORS.navyMuted }}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {message.replyCount || 0} replies
                </button>
                {isOwnPost && (
                  <>
                    <span style={{ color: COLORS.navyMuted }}>|</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                      className="text-xs hover:text-red-400 transition-colors"
                      style={{ color: COLORS.navyMuted }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular Message Card
  return (
    <div 
      className="w-full my-2 animate-fade-in"
      style={{ animationDelay: `${Math.random() * 100}ms` }}
    >
      <div 
        className="relative p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] rounded-[18px]"
        style={{ 
          backgroundColor: COLORS.cream,
          boxShadow: `
            0 4px 6px rgba(0, 0, 0, 0.07),
            0 10px 20px rgba(0, 0, 0, 0.12),
            0 20px 40px rgba(0, 0, 0, 0.08)
          `,
        }}
        onClick={onThread}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: COLORS.accent }}
          >
            {message.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm truncate" style={{ color: COLORS.navyText }}>
                {message.user}
              </span>
              {message.category === 'alerts' && (
                <span 
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 border"
                  style={{ 
                    backgroundColor: `${COLORS.coral}1A`,
                    color: COLORS.coral,
                    borderColor: `${COLORS.coral}33`
                  }}
                >
                  🚨 Alert
                </span>
              )}
              {message.category === 'deals' && (
                <span 
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 border"
                  style={{ 
                    backgroundColor: `${COLORS.green}1A`,
                    color: COLORS.green,
                    borderColor: `${COLORS.green}33`
                  }}
                >
                  🏪 Deal
                </span>
              )}
              {(message.tips > 0 || message.likes >= 5) && (
                <span 
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold border"
                  style={{ 
                    backgroundColor: `${COLORS.yellow}1A`,
                    color: COLORS.yellow,
                    borderColor: `${COLORS.yellow}33`
                  }}
                >
                  🔥 Hot
                </span>
              )}
            </div>
          </div>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: COLORS.navyMuted }}>
            {message.time}
          </span>
        </div>

        {/* Image */}
        {message.image_url && (
          <div className="mb-3 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={message.image_url} 
              alt="Post" 
              className="w-full h-auto max-h-64 object-cover"
            />
          </div>
        )}

        {/* Message Content */}
        <p className="text-sm leading-relaxed mb-2.5" style={{ color: COLORS.navyText, paddingLeft: '44px' }}>
          {message.message}
        </p>

        {/* Location Tag */}
        {message.location && (
          <div 
            className="flex items-center gap-1 text-xs mb-2"
            style={{ color: COLORS.navyMuted, paddingLeft: '44px' }}
          >
            <MapPin className="w-3 h-3" />
            <span>{message.location}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between" style={{ paddingLeft: '44px' }}>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); handleTip(); }}
              className="relative flex items-center gap-1 transition-colors"
              style={{ color: COLORS.accent }}
            >
              <TipAnimation show={showTipAnim} onComplete={() => setShowTipAnim(false)} />
              <span className="text-base">🪙</span>
              <span className="font-semibold text-xs">{message.tips || "Tip"}</span>
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); handleLike(); }}
              className={`flex items-center gap-1 transition-colors text-xs ${isLiked ? 'text-red-500' : ''}`}
              style={!isLiked ? { color: COLORS.navyMuted } : undefined}
              disabled={!onLike}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
              <span>{message.likes}</span>
            </button>
            
            {(message.replyCount || 0) > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); onThread(); }}
                className="flex items-center gap-1 text-xs transition-colors"
                style={{ color: COLORS.navyMuted }}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{message.replyCount}</span>
              </button>
            )}
          </div>
          
          {isOwnPost ? (
            <button 
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              className="text-[10px] hover:text-red-400 transition-colors"
              style={{ color: COLORS.navyMuted }}
            >
              Delete
            </button>
          ) : (
            <span className="text-[10px]" style={{ color: COLORS.navyMuted }}>23h left</span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes tip-coin {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg) translateY(-50px); opacity: 0; }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const MessageCard = memo(MessageCardComponent);
MessageCard.displayName = 'MessageCard';
