"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  MapPin, Send, Heart, MessageSquare, AlertTriangle, Bell, Menu,
  Home, Compass, User, X, Plus, LogOut
} from "lucide-react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { createClientClient, Profile } from "@/lib/supabase";

// Fonts
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

// Colors
const COLORS = {
  navy: "#0D1B2A",
  navyDark: "#0A1520",
  amber: "#F5A623",
  amberLight: "#F7B84E",
  brickRed: "#C0392B",
  white: "#FFFFFF",
  offWhite: "#F8F7F4",
  gray: {
    100: "#F5F5F0",
    500: "#6B7280",
    600: "#4B5563",
  }
};

// Navigation items - 3 icons only
const NAV_ITEMS = [
  { id: "feed", icon: Home, label: "Feed" },
  { id: "compose", icon: Plus, label: "Post", isSpecial: true },
  { id: "notifications", icon: Bell, label: "Notifications" },
];

// Helper to format time - available globally
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

// Sample messages
const SAMPLE_MESSAGES = [
  { 
    id: 1, 
    user: "Sarah M.", 
    avatar: "SM",
    message: "Storm warning for east side everyone! Stay safe! 🌪️", 
    time: "2m ago",
    likes: 12,
    tips: 3,
    location: "Boyce, LA",
    isHot: true,
    replies: [
      { user: "Mike T.", message: "Thanks for the heads up!", time: "1m ago" },
      { user: "Jessica K.", message: "Staying inside! 🏠", time: "30s ago" },
      { user: "Tom W.", message: "Which part of east side?", time: "45s ago" },
    ]
  },
  { 
    id: 2, 
    user: "Mike T.", 
    avatar: "MT",
    message: "Best tacos I've ever had at Maria's on 6th Street right now! The line is long but worth it 🌮", 
    time: "5m ago",
    likes: 8,
    tips: 5,
    replies: [],
  },
  { 
    id: 3, 
    user: "Jessica K.", 
    avatar: "JK",
    message: "Lost my brown lab near Lamar & 6th, answers to Max! Call (512) 555-0123", 
    time: "12m ago",
    likes: 24,
    tips: 8,
    isImportant: true,
    replies: [
      { user: "Tom W.", message: "What area specifically?", time: "5m ago" },
      { user: "Lisa P.", message: "I saw a brown dog near the park!", time: "2m ago" },
    ]
  },
  { 
    id: 4, 
    user: "Maria's Cantina",
    avatar: "MC", 
    isBusiness: true,
    message: "🎉 GIVEAWAY: First person to name our signature salsa wins dinner for 2! Comment below 👇",
    time: "Sponsored",
    likes: 45,
    tips: 12,
    replies: [
      { user: "David R.", message: "Spicy Verde!", time: "2m ago" },
      { user: "Lisa P.", message: "Mango Habanero?", time: "1m ago" },
      { user: "John D.", message: "Chipotle Lime?", time: "30s ago" },
    ],
  },
  { 
    id: 5, 
    user: "David R.", 
    avatar: "DR",
    message: "Traffic is backed up on I-35 Northbound from Riverside to MLK. Accident cleared but delays remain.", 
    time: "15m ago",
    likes: 15,
    tips: 2,
    replies: [],
  },
  { 
    id: 6, 
    user: "Lisa P.", 
    avatar: "LP",
    message: "Farmers market at Republic Square is open until 2pm! Fresh strawberries and homemade bread 🍓🥖", 
    time: "18m ago",
    likes: 6,
    tips: 1,
    replies: [],
  },
];

// Time filter tabs
const TIME_TABS = [
  { id: "live", label: "Live" },
  { id: "hour", label: "1 Hour" },
  { id: "today", label: "Today" },
  { id: "week", label: "Week" },
];

// Tip Animation Component
function TipAnimation({ show, onComplete }: { show: boolean; onComplete: () => void }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl animate-tip-coin"
          style={{
            animationDelay: `${i * 0.1}s`,
            transform: `rotate(${i * 60}deg) translateY(-30px)`,
          }}
        >
          🪙
        </span>
      ))}
      <div className="absolute w-20 h-20 rounded-full bg-amber-400/30 animate-ripple" />
    </div>
  );
}

// Toast Notification Component
function Toast({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-toast-slide"
      style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '9999px',
        padding: '12px 24px',
        boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-white font-medium text-sm">{message}</span>
      </div>
    </div>
  );
}

// Profile Drawer Component
function ProfileDrawer({ isOpen, onClose, user, onSignOut, router }: { 
  isOpen: boolean; 
  onClose: () => void;
  user: Profile | null;
  onSignOut: () => void;
  router: any;
}) {
  if (!isOpen) return null;

  const menuItems = [
    { label: 'Edit Profile', path: '/profile/edit' },
    { label: 'My Posts', path: '/profile/posts' },
    { label: 'Saved Items', path: '/profile/saved' },
    { label: 'Settings', path: '/profile/settings' },
    { label: 'Help & Support', path: '/profile/help' },
  ];

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        style={{ animationDuration: '0.25s' }}
      />
      <div 
        className="fixed top-0 left-0 bottom-0 w-[300px] z-50 animate-slide-in-left"
        style={{
          background: 'linear-gradient(180deg, rgba(13,27,42,0.98) 0%, rgba(10,21,32,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          animationDuration: '0.3s',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="p-6">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>

          <div className="flex items-center gap-4 mt-10 mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white notification-ring"
              style={{ backgroundColor: COLORS.amber }}>
              {user?.display_name?.[0] || user?.username?.[0] || "U"}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{user?.display_name || user?.username || "User"}</h3>
              <p className="text-white/50 text-sm">{user?.city || "Cenla"}, {user?.state || "LA"}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="text-center p-3 rounded-xl bg-white/5">
              <div className="text-amber-400 font-bold text-lg">{user?.tips_given || 0}</div>
              <div className="text-white/40 text-xs">Tips Given</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <div className="text-amber-400 font-bold text-lg">{user?.tips_received || 0}</div>
              <div className="text-white/40 text-xs">Tips Received</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <div className="text-amber-400 font-bold text-lg">0</div>
              <div className="text-white/40 text-xs">Posts</div>
            </div>
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <button 
                key={item.label} 
                onClick={() => handleNavigate(item.path)}
                className="w-full text-left px-4 py-3.5 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm font-medium active:scale-[0.98]"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="absolute bottom-8 left-6 right-6 space-y-2">
            <button 
              onClick={onSignOut}
              className="w-full py-3.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm font-medium border border-red-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Thread View Modal - CENTERED, no auto keyboard
function ThreadModal({ 
  message, 
  isOpen, 
  onClose, 
  onReply,
  currentUser,
  supabase,
}: { 
  message: typeof SAMPLE_MESSAGES[0] | null; 
  isOpen: boolean; 
  onClose: () => void;
  onReply: (text: string) => void;
  currentUser: Profile | null;
  supabase: any;
}) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Fetch replies when modal opens
  useEffect(() => {
    if (isOpen && message && supabase) {
      const fetchReplies = async () => {
        setLoadingReplies(true);
        // Fetch replies without join (schema cache issue)
        const { data: repliesData, error } = await supabase
          .from('replies')
          .select('*')
          .eq('message_id', message.id)
          .order('created_at', { ascending: true });
        
        if (repliesData && !error) {
          // Get unique user IDs
          const userIds = [...new Set(repliesData.map((r: any) => r.user_id))];
          
          // Fetch profiles separately
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
        setLoadingReplies(false);
      };
      fetchReplies();
    }
  }, [isOpen, message, supabase]);
  
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
      setShowReplyInput(false);
      setReplyText("");
    } else {
      setIsVisible(false);
      setReplies([]);
    }
  }, [isOpen]);

  // Focus input when showReplyInput becomes true
  useEffect(() => {
    if (showReplyInput && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showReplyInput]);
  
  if (!isOpen || !message) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      />
      
      {/* Modal */}
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
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
          <h3 className="font-bold text-white text-lg">Thread</h3>
          <button 
            onClick={onClose} 
            className="p-2.5 hover:bg-white/10 rounded-full transition-colors active:scale-90"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Scrollable content */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar"
          style={{ 
            paddingBottom: showReplyInput ? '0' : '20px',
          }}
        >
          {/* Original Message */}
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

          {/* Replies */}
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
                  {/* X button for own replies - always visible on mobile */}
                  {currentUser?.id === reply.user_id && (
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this reply?')) return;
                        const { error } = await supabase
                          .from('replies')
                          .delete()
                          .eq('id', reply.id);
                        if (error) {
                          alert('Failed to delete reply');
                        } else {
                          setReplies(replies.filter(r => r.id !== reply.id));
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
          
          {/* Spacer for when reply input is shown */}
          {showReplyInput && <div className="h-4" />}
        </div>

        {/* Reply Section - Fixed at bottom */}
        <div className="border-t border-white/10 bg-white/5 shrink-0">
          {!showReplyInput ? (
            // Show Reply Button
            <div className="p-4">
              <button 
                onClick={() => setShowReplyInput(true)}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90"
                style={{ backgroundColor: COLORS.amber }}
              >
                Reply to this thread
              </button>
            </div>
          ) : (
            // Show Input Field
            <div className="p-4 animate-slide-up-fade">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 transition-all"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && replyText.trim()) {
                      e.preventDefault();
                      await onReply(replyText);
                      setReplyText("");
                      setShowReplyInput(false);
                      // Refresh replies
                      const { data: repliesData } = await supabase
                        .from('replies')
                        .select('*')
                        .eq('message_id', message.id)
                        .order('created_at', { ascending: true });
                      
                      if (repliesData) {
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
                    }
                  }}
                />
                <button 
                  onClick={async () => {
                    if (replyText.trim()) {
                      await onReply(replyText);
                      setReplyText("");
                      setShowReplyInput(false);
                      // Refresh replies
                      const { data: repliesData } = await supabase
                        .from('replies')
                        .select('*')
                        .eq('message_id', message.id)
                        .order('created_at', { ascending: true });
                      
                      if (repliesData) {
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
                    }
                  }}
                  className="px-5 py-3 rounded-xl text-white font-semibold text-sm active:scale-95 transition-transform"
                  style={{ backgroundColor: COLORS.amber }}
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

// Glass Message Card
function GlassMessageCard({ 
  message, 
  onTip, 
  onThread,
  onSwipe,
  onDelete,
  onLike,
  isLiked,
  currentUserId,
}: { 
  message: typeof SAMPLE_MESSAGES[0] & { user_id?: string; replyCount?: number }; 
  onTip: () => void;
  onThread: () => void;
  onSwipe: (direction: 'left' | 'right') => void;
  onDelete?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  currentUserId?: string;
}) {
  const [showTipAnim, setShowTipAnim] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStart = useRef(0);
  const isOwnPost = currentUserId && message.user_id === currentUserId;

  const handleTip = () => {
    setShowTipAnim(true);
    onTip();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const diff = e.touches[0].clientX - touchStart.current;
    setSwipeOffset(Math.max(-100, Math.min(100, diff)));
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (swipeOffset > 50) {
      handleTip();
      onSwipe('right');
    } else if (swipeOffset < -50) {
      onSwipe('left');
    }
    setSwipeOffset(0);
  };

  if (message.isBusiness) {
    return (
      <div className="w-full animate-fade-in my-3" style={{ animationDelay: `${message.id * 50}ms` }}>
        <div 
          className="p-3.5 cursor-pointer transition-all duration-200 active:scale-[0.98] relative overflow-hidden"
          onClick={onThread}
          style={{
            background: 'linear-gradient(135deg, rgba(245, 166, 35, 0.18) 0%, rgba(245, 166, 35, 0.08) 100%)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid rgba(245, 166, 35, 0.4)',
            borderRadius: '20px',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.3),
              0 4px 16px rgba(245, 166, 35, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `,
          }}
        >
          {/* Top highlight for 3D effect */}
          <div 
            className="absolute inset-x-0 top-0 h-px rounded-t-[20px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(245, 166, 35, 0.6), transparent)',
            }}
          />
          <div className="flex items-start gap-3">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0"
              style={{ backgroundColor: COLORS.amber }}
            >
              {message.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-white">{message.user}</span>
                <span className="text-[10px] text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30">Sponsored</span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-3">{message.message}</p>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleTip(); }}
                  className="relative flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <TipAnimation show={showTipAnim} onComplete={() => setShowTipAnim(false)} />
                  <span className="text-lg">🪙</span>
                  <span className="font-semibold text-sm">{message.tips}</span>
                  <span className="text-xs text-white/50">tips</span>
                </button>
                <span className="text-white/20">|</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onThread(); }}
                  className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {message.replyCount || 0} replies
                </button>
                {isOwnPost && (
                  <>
                    <span className="text-white/20">|</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                      className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
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
      style={{ animationDelay: `${message.id * 50}ms` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe hints */}
      <div 
        className="absolute inset-y-0 left-0 w-20 flex items-center justify-center rounded-l-2xl transition-opacity"
        style={{ 
          backgroundColor: COLORS.amber,
          opacity: swipeOffset > 30 ? Math.min(1, (swipeOffset - 30) / 40) : 0,
        }}
      >
        <span className="text-white font-bold text-xs">TIP 🪙</span>
      </div>
      <div 
        className="absolute inset-y-0 right-0 w-20 flex items-center justify-center rounded-r-2xl transition-opacity"
        style={{ 
          backgroundColor: 'rgba(107, 114, 128, 0.8)',
          opacity: swipeOffset < -30 ? Math.min(1, (-swipeOffset - 30) / 40) : 0,
        }}
      >
        <span className="text-white font-bold text-xs">HIDE</span>
      </div>

      {/* Glass Card - 3D Liquid Glass Effect */}
      <div 
        className="relative p-3.5 cursor-pointer transition-all duration-200 active:scale-[0.98] group"
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          transform: `translateX(${swipeOffset}px) translateY(0) rotateX(0deg)`,
        }}
        onClick={onThread}
      >
        {/* Top highlight for 3D effect */}
        <div 
          className="absolute inset-x-0 top-0 h-px rounded-t-[20px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {message.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white truncate">{message.user}</span>
              {message.isHot && (
                <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded-full font-bold border border-red-500/30">
                  🔥 Hot
                </span>
              )}
              {message.isImportant && (
                <span className="text-[10px] bg-red-500/30 text-red-200 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 border border-red-500/40">
                  <AlertTriangle className="w-3 h-3" />
                  Alert
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-white/40 font-medium whitespace-nowrap">{message.time}</span>
        </div>

        {/* Message Content */}
        <p className="text-sm leading-relaxed text-white/90 mb-2.5 pl-11.5">
          {message.message}
        </p>

        {/* Location Tag */}
        {message.location && (
          <div className="flex items-center gap-1 text-xs text-white/50 mb-2 pl-11.5">
            <MapPin className="w-3 h-3" />
            <span>{message.location}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pl-11.5">
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); handleTip(); }}
              className="relative flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <TipAnimation show={showTipAnim} onComplete={() => setShowTipAnim(false)} />
              <span className="text-base">🪙</span>
              <span className="font-semibold text-xs">{message.tips || "Tip"}</span>
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onLike?.(); }}
              className={`flex items-center gap-1 transition-colors text-xs ${isLiked ? 'text-red-500' : 'text-white/40 hover:text-red-400'}`}
              disabled={!onLike}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
              <span>{message.likes}</span>
            </button>
            
          </div>
          
          {isOwnPost ? (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (confirm('Delete this post?')) {
                  onDelete?.();
                }
              }}
              className="text-[10px] text-white/30 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          ) : (
            <span className="text-[10px] text-white/30">23h left</span>
          )}
        </div>

        <div className="absolute bottom-1 right-3 text-[8px] text-white/20">
          ← swipe →
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function ConceptCardsPage() {
  const router = useRouter();
  const supabase = createClientClient();
  const [activeTab, setActiveTab] = useState("live");
  const [activeNav, setActiveNav] = useState("feed");
  const [mounted, setMounted] = useState(false);
  const [selectedThread, setSelectedThread] = useState<typeof SAMPLE_MESSAGES[0] | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [showInput, setShowInput] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Message state - MUST be before any useEffect
  const [messages, setMessages] = useState<typeof SAMPLE_MESSAGES>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [likedMessages, setLikedMessages] = useState<Set<string | number>>(new Set());
  const pendingLikes = useRef<Set<string | number>>(new Set());
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const showToast = (message: string) => {
    setToast({ message, visible: true });
  };
  const hideToast = () => {
    setToast({ message: '', visible: false });
  };

  // Auth checking - runs on mount and when auth state changes
  useEffect(() => {
    setMounted(true);
    
    // Check auth status with retry logic
    const checkAuth = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          // Add a timeout to prevent the lock manager from hanging forever
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth check timeout')), 3000)
          );
          
          const sessionPromise = supabase.auth.getSession();
          const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
          
          console.log('Auth check - Session:', session?.user?.email);
          
          if (session) {
            setIsAuthenticated(true);
            // Fetch user profile (handle case where it might not exist yet)
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle(); // Use maybeSingle instead of single to not error if missing
              
            if (error) {
              console.error('Error fetching profile:', error);
            }
            
            if (profile) {
              console.log('Profile loaded:', (profile as any).username);
              setUser(profile);
            } else {
              console.log('No profile found for user, creating basic one...');
              // Create a temporary profile object so UI doesn't break
              setUser({
                id: session.user.id,
                username: session.user.email?.split('@')[0] || 'user',
                display_name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                avatar_url: session.user.user_metadata?.avatar_url || null,
                city: 'Cenla',
                state: 'LA',
                lat: null,
                lng: null,
                tips_given: 0,
                tips_received: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            }
            
            // Fetch liked messages for this user
            const { data: likesData } = await supabase
              .from('user_likes')
              .select('message_id')
              .eq('user_id', session.user.id);
            
            if (likesData) {
              setLikedMessages(new Set(likesData.map((l: any) => l.message_id)));
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
          return; // Success, exit retry loop
        } catch (error) {
          console.error(`Auth check failed (attempt ${i + 1}/${retries}):`, error);
          if (i === retries - 1) {
            // Final attempt failed, treat as not authenticated but don't hang
            setIsAuthenticated(false);
            setUser(null);
          } else {
            // Wait before retry
            await new Promise(r => setTimeout(r, 500));
          }
        }
      }
    };
    
    // Delay auth check slightly to let any stuck locks clear
    setTimeout(() => checkAuth(), 100);
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching profile on sign in:', error);
        }
        
        if (profile) {
          setUser(profile);
        } else {
          // Create temporary profile
          setUser({
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'user',
            display_name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.user_metadata?.avatar_url || null,
            city: 'Cenla',
            state: 'LA',
            lat: null,
            lng: null,
            tips_given: 0,
            tips_received: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
        
        // Fetch liked messages for this user
        const { data: likesData } = await supabase
          .from('user_likes')
          .select('message_id')
          .eq('user_id', session.user.id);
        
        if (likesData) {
          setLikedMessages(new Set(likesData.map((l: any) => l.message_id)));
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleOpenThread = (msg: typeof SAMPLE_MESSAGES[0]) => {
    setSelectedThread(msg);
    setShowInput(false);
  };

  const handleCloseThread = async () => {
    // Refresh reply count for the message that was just viewed
    if (selectedThread) {
      const { count } = await supabase
        .from('replies')
        .select('*', { count: 'exact', head: true })
        .eq('message_id', selectedThread.id);
      
      setMessages(prev => prev.map(m => 
        m.id === selectedThread.id 
          ? { ...m, replyCount: count || 0 }
          : m
      ));
    }
    setSelectedThread(null);
  };

  const handleReply = async (text: string) => {
    console.log('handleReply called with:', text);
    console.log('selectedThread:', selectedThread?.id);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user?.id:', user?.id);
    
    if (!selectedThread || !isAuthenticated || !user?.id) {
      alert('Please sign in to reply');
      return;
    }

    console.log('Inserting reply...');
    const { data, error } = await supabase
      .from('replies')
      .insert({
        message_id: selectedThread.id,
        user_id: user.id,
        content: text,
      } as any)
      .select();

    console.log('Insert result:', { data, error });

    if (error) {
      console.error('Error creating reply:', error);
      alert('Failed to post reply: ' + error.message);
    } else {
      console.log('Reply created successfully:', data);
      showToast('Reply sent!');
    }
  };

  const handleDeleteMessage = async (messageId: string | number) => {
    if (!confirm('Delete this post?')) return;
    
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);
    
    if (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete post');
    } else {
      // Remove from local state
      setMessages(messages.filter(m => m.id !== messageId));
    }
  };

  const handleLikeMessage = async (messageId: string | number) => {
    if (!isAuthenticated || !user?.id) {
      alert('Please sign in to like posts');
      return;
    }

    // Prevent rapid-fire likes (debounce)
    if (pendingLikes.current.has(messageId)) return;
    pendingLikes.current.add(messageId);

    const message = messages.find(m => m.id === messageId);
    if (!message) {
      pendingLikes.current.delete(messageId);
      return;
    }

    const isCurrentlyLiked = likedMessages.has(messageId);

    // Optimistically update UI first
    if (isCurrentlyLiked) {
      setLikedMessages(prev => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, likes: Math.max(0, m.likes - 1) } : m
      ));
    } else {
      setLikedMessages(prev => new Set(prev).add(messageId));
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, likes: m.likes + 1 } : m
      ));
    }

    try {
      if (isCurrentlyLiked) {
        // Unlike: remove from user_likes
        await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('message_id', messageId);
      } else {
        // Like: add to user_likes
        await supabase
          .from('user_likes')
          .insert({ user_id: user.id, message_id: messageId } as any);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      if (isCurrentlyLiked) {
        setLikedMessages(prev => new Set(prev).add(messageId));
        setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, likes: m.likes + 1 } : m
        ));
      } else {
        setLikedMessages(prev => {
          const next = new Set(prev);
          next.delete(messageId);
          return next;
        });
        setMessages(prev => prev.map(m => 
          m.id === messageId ? { ...m, likes: Math.max(0, m.likes - 1) } : m
        ));
      }
    } finally {
      // Remove from pending after a short delay to prevent rapid clicks
      setTimeout(() => {
        pendingLikes.current.delete(messageId);
      }, 500);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleNavClick = (navId: string) => {
    if (navId === 'compose') {
      if (!user) {
        router.push('/login');
        return;
      }
      setShowInput(!showInput);
      if (!showInput) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } else {
      setActiveNav(navId);
    }
  };

  // Fetch real messages from Supabase
  useEffect(() => {
    const fetchMessages = async (retries = 3) => {
      setMessagesLoading(true);
      for (let i = 0; i < retries; i++) {
        try {
          // Add timeout to prevent lock manager hangs
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Messages fetch timeout')), 5000)
          );
          
          // Fetch messages without the join (schema cache issue)
          const fetchPromise = supabase
            .from('messages')
            .select('*')
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(50);
          
          const { data: messagesData, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

          if (error) {
            console.error('Error fetching messages:', error);
            setMessages(SAMPLE_MESSAGES);
          } else if (messagesData && messagesData.length > 0) {
            // Get unique user IDs from messages
            const userIds = [...new Set(messagesData.map((m: any) => m.user_id))];
            const messageIds = messagesData.map((m: any) => m.id);
            
            // Fetch profiles separately
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, username, display_name, avatar_url')
              .in('id', userIds);
            
            // Create a map of user_id -> profile
            const profileMap = new Map();
            profilesData?.forEach((p: any) => profileMap.set(p.id, p));
            
            // Fetch reply counts for each message
            const { data: repliesData } = await supabase
              .from('replies')
              .select('message_id')
              .in('message_id', messageIds);
            
            // Count replies per message
            const replyCountMap = new Map();
            repliesData?.forEach((r: any) => {
              replyCountMap.set(r.message_id, (replyCountMap.get(r.message_id) || 0) + 1);
            });
            
            const formattedMessages = messagesData.map((msg: any) => {
              const profile = profileMap.get(msg.user_id);
              return {
                id: msg.id,
                user_id: msg.user_id, // Keep user_id for delete check
                user: profile?.display_name || profile?.username || 'Anonymous',
                avatar: (profile?.display_name || profile?.username || 'U').substring(0, 2).toUpperCase(),
                message: msg.content,
                time: formatTime(msg.created_at),
                likes: msg.likes || 0,
                tips: msg.tips || 0,
                location: msg.location_name,
                isHot: msg.is_hot,
                isImportant: msg.is_important,
                isBusiness: msg.is_business,
                replies: [],
                replyCount: replyCountMap.get(msg.id) || 0,
              };
            });
            setMessages(formattedMessages);
          } else {
            setMessages(SAMPLE_MESSAGES);
          }
          setMessagesLoading(false);
          return; // Success
        } catch (err: any) {
          console.error(`Fetch error (attempt ${i + 1}/${retries}):`, err);
          if (i === retries - 1) {
            // Final attempt - use sample messages
            setMessages(SAMPLE_MESSAGES);
            setMessagesLoading(false);
          } else {
            await new Promise(r => setTimeout(r, 300));
          }
        }
      }
    };

    if (mounted) {
      // Delay slightly to let auth locks clear first
      setTimeout(() => fetchMessages(), 200);
    }

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [mounted]);

  // Handle creating a new post
  const handleCreatePost = async () => {
    if (!composeText.trim()) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!user?.id) {
      console.error('No user ID available');
      alert('Please sign in again');
      return;
    }

    setIsLoading(true);
    console.log('Creating post with user_id:', user.id);
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: user.id,
        content: composeText,
        location_name: 'Boyce, LA',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      } as any)
      .select();

    if (error) {
      console.error('Error creating message:', error);
      alert('Failed to post: ' + error.message);
    } else {
      console.log('Message created:', data);
      setComposeText('');
      setShowInput(false);
      showToast('Message posted to feed!');
    }
    
    setIsLoading(false);
  };

  // Early return for loading state - MUST be after all hooks
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.navy }}>
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    );
  }

  const isModalOpen = !!selectedThread || isProfileOpen;

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      
      {/* Toast Notification */}
      <Toast 
        message={toast.message} 
        isVisible={toast.visible} 
        onClose={hideToast} 
      />
      
      <div className={`min-h-screen flex flex-col ${jakarta.variable} ${inter.variable} overflow-x-hidden`} 
        style={{ 
          fontFamily: "var(--font-inter), Inter, sans-serif", 
          backgroundColor: COLORS.navy,
          touchAction: 'pan-y',
        }}>
        
        {/* CSS Animations */}
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
            opacity: 0;
          }
          @keyframes slide-in-left {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in-left {
            animation: slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes tip-coin {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
            100% { transform: scale(1) rotate(360deg) translateY(-50px); opacity: 0; }
          }
          .animate-tip-coin {
            animation: tip-coin 0.8s ease-out forwards;
          }
          @keyframes ripple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
          }
          .animate-ripple {
            animation: ripple 0.6s ease-out forwards;
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
            50% { opacity: 0.8; box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          }
          .live-pulse {
            animation: pulse-glow 2s infinite;
          }
          @keyframes slide-up-fade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up-fade {
            animation: slide-up-fade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes nav-slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-nav-slide-up {
            animation: nav-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes toast-slide {
            0% { 
              opacity: 0;
              transform: translateX(-50%) translateY(-20px) scale(0.95);
            }
            100% { 
              opacity: 1;
              transform: translateX(-50%) translateY(0) scale(1);
            }
          }
          .animate-toast-slide {
            animation: toast-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          }
          .animate-heart-burst {
            animation: heart-burst 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-select {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `}</style>

        <ProfileDrawer 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          user={user}
          onSignOut={handleSignOut}
          router={router}
        />
        <ThreadModal 
          message={selectedThread}
          isOpen={!!selectedThread}
          onClose={handleCloseThread}
          onReply={handleReply}
          currentUser={user}
          supabase={supabase}
        />

        {/* Slim Header - PERFECTLY CENTERED CITY NAME */}
        <header 
          className="glass-header sticky top-0 z-40 shrink-0 no-select"
          style={{
            transform: isModalOpen ? 'translateY(-100%)' : 'translateY(0)',
            opacity: isModalOpen ? 0 : 1,
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
          }}
        >
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center relative">
            {/* Left: Profile Picture or Login - ABSOLUTE POSITIONED */}
            <button 
              onClick={() => user ? setIsProfileOpen(true) : router.push('/login')}
              className="absolute left-4 active:scale-95 transition-transform"
            >
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all ${unreadCount > 0 ? 'notification-ring' : ''}`}
                style={{ backgroundColor: COLORS.amber }}
              >
                {user?.display_name?.[0] || user?.username?.[0] || "?"}
              </div>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {unreadCount}
                </div>
              )}
            </button>

            {/* Center: City Name - PERFECTLY CENTERED */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
              <h1 className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "var(--font-jakarta)" }}>
                Cenla
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full live-pulse" />
                <span className="text-[10px] text-white/50">247 neighbors</span>
              </div>
            </div>

            {/* Right: Notifications + Settings - ABSOLUTE POSITIONED */}
            <div className="absolute right-4 flex items-center gap-1">
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative active:scale-90">
                <Bell className="w-5 h-5 text-white/80" />
                {unreadCount > 0 && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
                )}
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-90">
                <Menu className="w-5 h-5 text-white/80" />
              </button>
            </div>
          </div>
        </header>

        {/* Floating Time Filter Tabs */}
        <div 
          className="sticky top-14 z-30 py-3 px-4 shrink-0"
          style={{
            transform: isModalOpen ? 'translateY(-20px)' : 'translateY(0)',
            opacity: isModalOpen ? 0 : 1,
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
            pointerEvents: isModalOpen ? 'none' : 'auto',
          }}
        >
          <div className="max-w-xl mx-auto">
            <div className="glass-tabs p-1.5">
              <div className="grid grid-cols-4 gap-1">
                {TIME_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const isLive = tab.id === "live";
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative active:scale-95 ${
                        isActive 
                          ? "text-white" 
                          : "text-white/50 hover:text-white/80"
                      }`}
                      style={{
                        backgroundColor: isActive ? COLORS.amber : 'transparent',
                        boxShadow: isActive ? '0 2px 12px rgba(245, 166, 35, 0.4)' : 'none',
                      }}
                    >
                      {isLive && isActive && (
                        <span className="absolute left-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      )}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Feed - Adjusted padding for fixed bottom nav */}
        <main 
          className="flex-1 overflow-y-auto no-scrollbar"
          style={{ 
            paddingBottom: showInput ? '140px' : '80px',
          }}
        >
          <div className="max-w-xl mx-auto px-4 py-2">
            <div className="space-y-1">
              {messagesLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/40 text-sm">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/40 text-sm">No messages yet. Be the first!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <GlassMessageCard 
                    key={msg.id} 
                    message={msg}
                    onTip={() => console.log(`Tipped ${msg.user}`)}
                    onThread={() => handleOpenThread(msg)}
                    onSwipe={(dir) => console.log(`Swiped ${dir}`)}
                    onDelete={() => handleDeleteMessage(msg.id)}
                    onLike={() => handleLikeMessage(msg.id)}
                    isLiked={likedMessages.has(msg.id)}
                    currentUserId={user?.id}
                  />
                ))
              )}
            </div>
            
            <div className="text-center py-8">
              <button className="text-xs text-white/30 hover:text-white/50 transition-colors">
                Load more messages...
              </button>
            </div>
          </div>
        </main>

        {/* Floating Input Pill - Above bottom nav */}
        <div 
          className="fixed left-4 right-4 z-40"
          style={{
            bottom: '76px', // Just above the fixed nav bar
            opacity: showInput && !isModalOpen ? 1 : 0,
            transform: showInput && !isModalOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: showInput && !isModalOpen ? 'auto' : 'none',
          }}
        >
          <div className="max-w-xl mx-auto animate-input-expand">
            <div className="glass-input p-1.5">
              <div className="flex items-center gap-2">
                <button className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-white/60 active:scale-90">
                  <MapPin className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                    onFocus={() => setIsComposing(true)}
                    onBlur={() => setIsComposing(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && composeText.trim() && !isLoading) {
                        e.preventDefault();
                        handleCreatePost();
                      }
                    }}
                    placeholder={isComposing ? "What's happening in Cenla?" : "Say something nice..."}
                    className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm py-2.5 px-2"
                  />
                </div>
                
                {isComposing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">{composeText.length}/280</span>
                    <button 
                      className="p-2.5 rounded-full transition-all hover:scale-105 active:scale-90 disabled:opacity-50"
                      style={{ backgroundColor: COLORS.amber }}
                      onClick={handleCreatePost}
                      disabled={isLoading || !composeText.trim()}
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <button 
                    className="p-2.5 rounded-full transition-all hover:scale-105 active:scale-90 disabled:opacity-50"
                    style={{ backgroundColor: COLORS.amber }}
                    onClick={handleCreatePost}
                    disabled={isLoading || !composeText.trim()}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-center text-[10px] text-white/30 mt-2">
              Messages disappear after 24 hours
            </p>
          </div>
        </div>

        {/* FIXED BOTTOM NAVIGATION BAR */}
        <nav 
          className="fixed bottom-0 left-0 right-0 z-50 glass-header border-t border-white/10"
          style={{
            transform: isModalOpen ? 'translateY(100%)' : 'translateY(0)',
            opacity: isModalOpen ? 0 : 1,
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
            height: '64px',
          }}
        >
          <div className="max-w-xl mx-auto h-full grid grid-cols-3 px-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              const isCompose = item.id === 'compose';
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-2 transition-all active:scale-90 relative ${isCompose ? '' : ''}`}
                >
                  {isCompose ? (
                    // Special amber + button - centered
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center transition-transform"
                      style={{ 
                        backgroundColor: COLORS.amber,
                        boxShadow: '0 4px 12px rgba(245, 166, 35, 0.4)',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <>
                      <Icon 
                        className="w-6 h-6 transition-colors duration-200" 
                        style={{ 
                          color: isActive ? COLORS.amber : 'rgba(255,255,255,0.5)',
                        }} 
                      />
                      <span 
                        className="text-[10px] transition-colors duration-200"
                        style={{ 
                          color: isActive ? COLORS.amber : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                  {item.id === 'notifications' && unreadCount > 0 && !isCompose && (
                    <div 
                      className="absolute top-2 w-2.5 h-2.5 bg-red-500 rounded-full"
                      style={{ 
                        boxShadow: '0 0 0 2px #0D1B2A',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
