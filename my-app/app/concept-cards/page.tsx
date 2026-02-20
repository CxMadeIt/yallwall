"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { createClientClient } from "@/lib/supabase";

import { COLORS, generateQRCode } from "./utils";
import { MessageDisplay, ContentFilterId } from "./types";
import { Header } from "./components/Header";
import { FilterTabs } from "./components/FilterTabs";
import { GlassMessageCard } from "./components/GlassMessageCard";
import { Composer } from "./components/Composer";
import { ThreadModal } from "./components/ThreadModal";
import { ProfileDrawer } from "./components/ProfileDrawer";
import { TipModal } from "./components/TipModal";
import { QRCodeModal } from "./components/QRCodeModal";
import { Toast } from "./components/Toast";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { EmptyState } from "./components/EmptyState";
import OnboardingModal from "./OnboardingModal"; // Keeping original relative import if it exists

import { useAuth } from "./hooks/useAuth";
import { useMessages } from "./hooks/useMessages";
import { useLikes } from "./hooks/useLikes";
import { useTipping } from "./hooks/useTipping";
import { useNotifications } from "./hooks/useNotifications";

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

export default function ConceptCardsPage() {
  const router = useRouter();
  const supabase = createClientClient();
  
  // State
  const [activeTab, setActiveTab] = useState<ContentFilterId>("live");
  const [selectedThread, setSelectedThread] = useState<MessageDisplay | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [isLoading, setIsLoading] = useState(false);
  
  // Hooks
  const { user, isAuthenticated, loading: authLoading, showOnboarding, setShowOnboarding, signOut, setUser } = useAuth();
  const { messages, loading: messagesLoading, refresh: refreshMessages, setMessages, hasMore, loadMore } = useMessages(isAuthenticated);
  const { likedMessages, toggleLike } = useLikes(user?.id, isAuthenticated);
  const { showTipModal, setShowTipModal, tipRecipient, handleTip, openTipModal } = useTipping(user, setUser);
  const { unreadCount } = useNotifications(user?.id);

  // Infinite Scroll Trigger
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMessageElementRef = useCallback((node: HTMLDivElement) => {
    if (messagesLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [messagesLoading, hasMore, loadMore]);


  // Helper to show toast
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ message: '', visible: false });
  }, []);

  // Update message helper for likes/replies
  const updateMessage = useCallback((id: string | number, updates: Partial<MessageDisplay>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, [setMessages]);

  // Handlers
  const handleOpenThread = useCallback((msg: MessageDisplay) => {
    setSelectedThread(msg);
    setShowInput(false);
  }, []);

  const handleCloseThread = useCallback(async () => {
    if (selectedThread) {
      // Refresh reply count
      const { count } = await supabase
        .from('replies')
        .select('*', { count: 'exact', head: true })
        .eq('message_id', selectedThread.id);
      
      updateMessage(selectedThread.id, { replyCount: count || 0 });
    }
    setSelectedThread(null);
  }, [selectedThread, supabase, updateMessage]);

  const handleCreatePost = async (text: string, manualFlag: 'alert' | 'business' | null, imageUrl?: string | null) => {
    if (!isAuthenticated || !user?.id) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    
    // Categorization logic handled in useMessages or utility, but we need to insert here
    // Re-importing utility to use here
    const { categorizeMessage } = await import("./utils");
    const category = categorizeMessage(text, manualFlag, user?.account_type === 'business');
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: user.id,
        content: text,
        location_name: user?.city || 'Boyce, LA',
        category: category,
        is_alert: category === 'alerts',
        is_business_post: category === 'deals',
        manual_flag: manualFlag,
        image_url: imageUrl || null,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      } as any)
      .select();

    if (error) {
      console.error('Error creating message:', error);
      alert('Failed to post: ' + error.message);
    } else {
      refreshMessages();
      setShowInput(false);
      showToast(`Posted to ${category}!`);
    }
    setIsLoading(false);
  };

  const handleDeleteMessage = async (messageId: string | number) => {
    // Optimistic delete
    setMessages(prev => prev.filter(m => m.id !== messageId));
    
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);
    
    if (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete post');
      refreshMessages(); // Revert
    }
  };

  const handleShowQRCode = async () => {
    if (!user?.username) return;
    const qrUrl = await generateQRCode(user.username);
    setQrCodeDataUrl(qrUrl);
    setShowQRCode(true);
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
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

  const isModalOpen = !!selectedThread || isProfileOpen;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.navy }}>
        <div className="text-white/40 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      
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
        
        {/* Global Styles for Animations */}
        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
          @keyframes tip-coin { 0% { transform: scale(0) rotate(0deg); opacity: 0; } 50% { transform: scale(1.2) rotate(180deg); opacity: 1; } 100% { transform: scale(1) rotate(360deg) translateY(-50px); opacity: 0; } }
          .animate-tip-coin { animation: tip-coin 0.8s ease-out forwards; }
          @keyframes ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
          .animate-ripple { animation: ripple 0.6s ease-out forwards; }
          @keyframes pulse-glow { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); } 50% { opacity: 0.8; box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); } }
          .live-pulse { animation: pulse-glow 2s infinite; }
          @keyframes slide-up-fade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-slide-up-fade { animation: slide-up-fade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes toast-slide { 0% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.95); } 100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
          .animate-toast-slide { animation: toast-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .no-select { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
        `}</style>

        <ProfileDrawer 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          user={user}
          onSignOut={signOut}
          router={router}
        />
        
        <OnboardingModal
          isOpen={showOnboarding}
          onComplete={() => {
            localStorage.setItem('yallwall_onboarding_complete', 'true');
            setShowOnboarding(false);
          }}
          onSkip={() => {
            localStorage.setItem('yallwall_onboarding_complete', 'true');
            setShowOnboarding(false);
          }}
        />
        
        <ThreadModal 
          message={selectedThread}
          isOpen={!!selectedThread}
          onClose={handleCloseThread}
          currentUser={user}
        />

        <Header 
          user={user}
          unreadCount={unreadCount}
          isModalOpen={isModalOpen}
          onProfileClick={() => setIsProfileOpen(true)}
          onLoginClick={() => router.push('/login')}
        />

        <FilterTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isModalOpen={isModalOpen}
        />

        <main 
          className="flex-1 overflow-y-auto no-scrollbar"
          style={{ 
            paddingBottom: showInput ? '140px' : '80px',
          }}
        >
          <div className="max-w-xl mx-auto px-4 py-2">
            <div className="space-y-1">
              {messagesLoading ? (
                <div className="py-4">
                  <LoadingSkeleton count={3} />
                </div>
              ) : filteredMessages.length === 0 ? (
                <EmptyState activeTab={activeTab} onCreatePost={() => setShowInput(true)} />
              ) : (
                filteredMessages.map((msg) => (
                  <GlassMessageCard 
                    key={msg.id} 
                    message={msg}
                    onTip={() => openTipModal({ id: msg.user_id || '', username: msg.user }, String(msg.id))}
                    onThread={() => handleOpenThread(msg)}
                    onDelete={() => handleDeleteMessage(msg.id)}
                    onLike={() => toggleLike(msg.id, msg.likes, updateMessage)}
                    isLiked={likedMessages.has(msg.id)}
                    currentUserId={user?.id}
                  />
                ))
              )}
              {/* Infinite Scroll Trigger */}
              <div ref={lastMessageElementRef} className="h-4 w-full" />
            </div>
            
            <div className="text-center py-8">
              {messagesLoading && messages.length > 0 && (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
              )}
              {!hasMore && messages.length > 0 && (
                <p className="text-white/30 text-xs">You're all caught up! 🎉</p>
              )}
            </div>

            {/* Email Signup - Stay in the loop */}
            <div className="mx-4 mb-8 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
              <div className="text-center mb-4">
                <h3 className="text-white font-semibold text-lg mb-1">Don't Miss the Wall</h3>
                <p className="text-white/50 text-sm">Get the juiciest local drama, events, weather alerts, and free tacos. No spam, just vibes. 🌮</p>
              </div>
              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert('Thanks for signing up! We\'ll keep you posted.'); }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400/50"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 hover:opacity-90"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  Join
                </button>
              </form>
              <p className="text-center text-white/30 text-xs mt-3">We pinky promise not to ghost you... unless you're boring.</p>
            </div>
          </div>
        </main>

        <Composer 
          onPost={handleCreatePost}
          isLoading={isLoading}
          showInput={showInput}
          isModalOpen={isModalOpen}
          onFocus={() => setShowInput(true)}
          // onBlur={() => setShowInput(false)} // Keeping open for better UX
        />
        
        {/* Toggle Composer Button (Floating Action Button) */}
        {!showInput && !isModalOpen && (
          <button
            onClick={() => setShowInput(true)}
            className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 transition-transform hover:scale-105 active:scale-90"
            style={{ backgroundColor: COLORS.yellow }}
          >
            <div className="w-6 h-6 text-white font-bold text-xl flex items-center justify-center">+</div>
          </button>
        )}

        {/* Tip Modal */}
        <TipModal 
          isOpen={showTipModal}
          onClose={() => setShowTipModal(false)}
          onSend={(amount) => handleTip(amount, showToast)}
          recipientName={tipRecipient?.username || 'User'}
          userPoints={user?.yallpoints || 0}
        />
        
        {/* QR Code Modal */}
        <QRCodeModal 
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          qrCodeDataUrl={qrCodeDataUrl}
        />
      </div>
    </>
  );
}
