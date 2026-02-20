import { Bell } from "lucide-react";
import { Profile } from "../types";
import { COLORS } from "../utils";

interface HeaderProps {
  user: Profile | null;
  unreadCount: number;
  isModalOpen: boolean;
  onProfileClick: () => void;
  onLoginClick: () => void;
}

export function Header({ 
  user, 
  unreadCount, 
  isModalOpen,
  onProfileClick,
  onLoginClick
}: HeaderProps) {
  return (
    <header 
      className="glass-header sticky top-0 z-40 shrink-0 no-select"
      style={{
        transform: isModalOpen ? 'translateY(-100%)' : 'translateY(0)',
        opacity: isModalOpen ? 0 : 1,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
      }}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center relative">
        <button 
          onClick={user ? onProfileClick : onLoginClick}
          className="absolute left-4 active:scale-95 transition-transform"
        >
          <div 
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all ring-2 ring-offset-2 ring-offset-[#0D1B2A] ${unreadCount > 0 ? 'notification-ring' : ''}`}
            style={{ 
              backgroundColor: COLORS.accent,
              '--tw-ring-color': COLORS.yellow,
            } as React.CSSProperties}
          >
            {user?.display_name?.[0] || user?.username?.[0] || "?"}
          </div>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              {unreadCount}
            </div>
          )}
        </button>

        <div className="absolute" style={{ right: 'calc(50% + 40px)' }}>
          <span className="font-bold text-xl tracking-tight whitespace-nowrap" style={{ fontFamily: "var(--font-jakarta)" }}>
            <span className="text-white">Yall</span>
            <span style={{ color: COLORS.yellow }}>Wall</span>
          </span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="../images/logo.png" 
            alt="YallWall" 
            className="w-12 h-12 object-contain"
          />
        </div>

        <div className="absolute" style={{ left: 'calc(50% + 40px)' }}>
          <h1 className="text-white font-bold text-xl tracking-tight whitespace-nowrap" style={{ fontFamily: "var(--font-jakarta)" }}>
            Cenla
          </h1>
        </div>

        <div className="absolute right-4">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative active:scale-90">
            <Bell className="w-5 h-5 text-white/80" />
            {unreadCount > 0 && (
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.accent }} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
