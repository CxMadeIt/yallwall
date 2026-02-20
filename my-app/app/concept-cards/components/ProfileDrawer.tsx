import { useState, useEffect } from "react";
import { X, LogOut, QrCode } from "lucide-react";
import { Profile } from "../types";
import { COLORS } from "../utils";

interface ProfileDrawerProps { 
  isOpen: boolean; 
  onClose: () => void;
  user: Profile | null;
  onSignOut: () => void;
  router: any;
}

export function ProfileDrawer({ 
  isOpen, 
  onClose, 
  user, 
  onSignOut, 
  router 
}: ProfileDrawerProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setShouldRender(true);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  const menuItems = [
    { label: '💰 YallPoints Wallet', path: '/profile/wallet' },
    { label: '👤 Edit Profile', path: '/profile/edit' },
    { label: '📝 My Posts', path: '/profile/posts' },
    { label: '💛 Good Deeds', path: '/profile/good-deeds' },
    { label: '🏪 Business Portal', path: '/profile/business' },
    { label: '🔖 Saved Items', path: '/profile/saved' },
    { label: '⚙️ Settings', path: '/profile/settings' },
    { label: '❓ Help & Support', path: '/profile/help' },
  ];

  const handleNavigate = (path: string) => {
    handleClose();
    setTimeout(() => {
      window.location.href = path;
    }, 350);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-50 backdrop-blur-sm transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[300px] z-50 transition-transform duration-300 ease-out ${
          isClosing ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(13,27,42,0.98) 0%, rgba(10,21,32,0.98) 100%)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="p-6">
          <button 
            onClick={handleClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mt-4 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="../images/logo.png" 
              alt="YallWall" 
              className="w-12 h-12 object-contain"
            />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white notification-ring"
              style={{ backgroundColor: COLORS.accent }}>
              {user?.display_name?.[0] || user?.username?.[0] || "U"}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{user?.display_name || user?.username || "User"}</h3>
              <p className="text-white/50 text-sm">{user?.city || "Cenla"}, {user?.state || "LA"}</p>
            </div>
          </div>

          {/* YallPoints Display */}
          <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
            <div className="flex items-center justify-between">
              <div 
                className="cursor-pointer"
                onClick={() => handleNavigate('/profile/wallet')}
              >
                <p className="text-white/50 text-xs">Your Balance</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.yellow }}>
                  {user?.yallpoints || 250} 🪙
                </p>
              </div>
              <button
                onClick={() => handleNavigate('/profile/qr')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <QrCode className="w-5 h-5 text-white/60" />
                <span className="text-[10px] text-white/40">My QR</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="text-center p-3 rounded-xl bg-white/5">
              <div className="font-bold text-lg" style={{ color: COLORS.yellow }}>{user?.tips_given || 0}</div>
              <div className="text-white/40 text-xs">Tips Given</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <div className="font-bold text-lg" style={{ color: COLORS.yellow }}>{user?.tips_received || 0}</div>
              <div className="text-white/40 text-xs">Tips Received</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <div className="font-bold text-lg" style={{ color: COLORS.yellow }}>0</div>
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
