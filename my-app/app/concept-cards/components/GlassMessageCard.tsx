import { useState, memo } from "react";
import { MapPin, MessageSquare, Heart } from "lucide-react";
import { COLORS } from "../utils";
import { MessageDisplay } from "../types";
import { TipAnimation } from "./TipAnimation";
import { useHaptics } from "../hooks/useHaptics";

interface GlassMessageCardProps {
  message: MessageDisplay;
  onTip: () => void;
  onThread: () => void;
  onDelete?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  currentUserId?: string;
}

export const GlassMessageCard = memo(function GlassMessageCard({ 
  message, 
  onTip, 
  onThread,
  onDelete,
  onLike,
  isLiked,
  currentUserId,
}: GlassMessageCardProps) {
  const [showTipAnim, setShowTipAnim] = useState(false);
  const { light, success } = useHaptics();
  const isOwnPost = currentUserId && message.user_id === currentUserId;

  const handleTip = () => {
    setShowTipAnim(true);
    success();
    onTip();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    light();
    onLike?.();
  };


  if (message.isBusiness) {
    return (
      <div className="w-full animate-fade-in my-4" style={{ animationDelay: `${Number(message.id) * 50}ms` }}>
        <div 
          className="p-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden"
          onClick={onThread}
          style={{
            background: '#FAF8F5',
            borderRadius: '18px',
            border: 'none',
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
                <span className="font-bold" style={{ color: COLORS.navyText }}>{message.user}</span>
                <span 
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
                  style={{ color: COLORS.accent, backgroundColor: `${COLORS.accent}15`, borderColor: `${COLORS.accent}30` }}
                >
                  Sponsored
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.navyText }}>{message.message}</p>
              
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
                      onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
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

  return (
    <div 
      className="w-full animate-fade-in my-2 relative"
      style={{ animationDelay: `${Number(message.id) * 50}ms` }}
    >
      {/* Cream Card - Premium 3D Effect */}
      <div 
        className="relative p-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group"
        style={{ 
          background: '#FAF8F5',
          borderRadius: '18px',
          border: 'none',
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
            style={{ backgroundColor: COLORS.accent, border: 'none' }}
          >
            {message.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm truncate" style={{ color: COLORS.navyText }}>{message.user}</span>
              {message.category === 'alerts' && (
                <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 border border-red-500/20">
                  🚨 Alert
                </span>
              )}
              {message.category === 'deals' && (
                <span className="text-[10px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 border border-green-500/20">
                  🏪 Deal
                </span>
              )}
              {(message.tips > 0 || message.likes >= 5) && (
                <span className="text-[10px] bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded-full font-bold border border-orange-500/20">
                  🔥 Hot
                </span>
              )}
            </div>
          </div>
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: COLORS.navyMuted }}>{message.time}</span>
        </div>

        {/* Message Content */}
        <p className="text-sm leading-relaxed mb-2.5 pl-11.5" style={{ color: COLORS.navyText }}>
          {message.message}
        </p>

        {/* Message Image */}
        {message.image_url && (
          <div className="mb-3 pl-11.5">
            <div className="rounded-xl overflow-hidden relative bg-black/10 min-h-[200px]">
              <img 
                src={message.image_url} 
                alt="Message attachment" 
                className="w-full h-auto object-cover max-h-[400px]"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Location Tag */}
        {message.location && (
          <div className="flex items-center gap-1 text-xs mb-2 pl-11.5" style={{ color: COLORS.navyMuted }}>
            <MapPin className="w-3 h-3" />
            <span>{message.location}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pl-11.5">
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
              onClick={handleLike}
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
              onClick={(e) => { 
                e.stopPropagation(); 
                if (confirm('Delete this post?')) {
                  onDelete?.();
                }
              }}
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
    </div>
  );
});
