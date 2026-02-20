import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { MessageDisplay, Profile } from "../types";
import { COLORS } from "../utils";
import { useThread } from "../hooks/useThread";

interface ThreadModalProps {
  message: MessageDisplay | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile | null;
}

export function ThreadModal({ 
  message, 
  isOpen, 
  onClose, 
  currentUser,
}: ThreadModalProps) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { replies, loading: loadingReplies, addReply, deleteReply } = useThread(message);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
      setShowReplyInput(false);
      setReplyText("");
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (showReplyInput && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showReplyInput]);

  const handleReplySubmit = async () => {
    if (!currentUser || !replyText.trim()) return;
    try {
      await addReply(replyText, currentUser.id);
      setReplyText("");
      setShowReplyInput(false);
    } catch (err) {
      console.error(err);
      alert('Failed to post reply');
    }
  };

  if (!isOpen || !message) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      />
      
      <div 
        className="relative w-full max-w-md flex flex-col transition-all duration-300"
        style={{ 
          maxHeight: '85vh',
          background: 'rgba(13, 27, 42, 0.95)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
          <h3 className="font-bold text-white text-lg">Thread</h3>
          <button 
            onClick={onClose} 
            className="p-2.5 hover:bg-white/10 rounded-full transition-colors active:scale-90"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar"
          style={{ 
            paddingBottom: showReplyInput ? '0' : '20px',
          }}
        >
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {message.avatar}
              </div>
              <div>
                <div className="font-semibold text-white">{message.user}</div>
                <div className="text-xs text-white/40">{message.time}</div>
              </div>
            </div>
            <p className="text-white/90 text-[15px] leading-relaxed pl-[52px]">{message.message}</p>
          </div>

          <div className="p-5 space-y-4">
            {loadingReplies ? (
              <p className="text-center text-white/40 text-sm py-8">Loading replies...</p>
            ) : replies.length === 0 ? (
              <p className="text-center text-white/40 text-sm py-8">No replies yet. Be the first!</p>
            ) : (
              replies.map((reply, idx) => (
                <div key={reply.id || idx} className="flex gap-3 animate-fade-in group relative" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white/80 shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    {reply.avatar}
                  </div>
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-white">{reply.user}</span>
                      <span className="text-xs text-white/40">{reply.time}</span>
                    </div>
                    <p className="text-sm text-white/80">{reply.message}</p>
                  </div>
                  {currentUser?.id === reply.user_id && (
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this reply?')) return;
                        try {
                          await deleteReply(reply.id);
                        } catch (err) {
                          alert('Failed to delete reply');
                        }
                      }}
                      className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center rounded-full text-white/30 hover:text-red-400 transition-all"
                      style={{ touchAction: 'manipulation' }}
                      title="Delete reply"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          
          {showReplyInput && <div className="h-4" />}
        </div>

        <div className="border-t border-white/10 bg-white/5 shrink-0">
          {!showReplyInput ? (
            <div className="p-4">
              <button 
                onClick={() => setShowReplyInput(true)}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
                style={{ backgroundColor: COLORS.accent }}
              >
                Reply to this thread
              </button>
            </div>
          ) : (
            <div className="p-4 animate-slide-up-fade">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleReplySubmit();
                    }
                  }}
                />
                <button 
                  onClick={handleReplySubmit}
                  className="px-5 py-3 rounded-xl text-white font-semibold text-sm active:scale-95 transition-transform"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  Reply
                </button>
              </div>
              <button 
                onClick={() => setShowReplyInput(false)}
                className="w-full mt-2 text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
