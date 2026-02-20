"use client";

import { Home, Plus, Menu } from "lucide-react";
import { COLORS } from "../lib/constants";
import { triggerHaptic } from "../lib/utils";

interface BottomNavProps {
  activeNav: string;
  onNavClick: (navId: string) => void;
  isModalOpen?: boolean;
  unreadCount?: number;
}

const NAV_ITEMS = [
  { id: "feed", icon: Home, label: "Feed" },
  { id: "compose", icon: Plus, label: "Post", isSpecial: true },
  { id: "menu", icon: Menu, label: "Menu" },
];

export function BottomNav({ 
  activeNav, 
  onNavClick, 
  isModalOpen,
  unreadCount = 0 
}: BottomNavProps) {
  const handleClick = (navId: string) => {
    triggerHaptic(30);
    onNavClick(navId);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10"
      style={{
        backgroundColor: `${COLORS.navy}E6`, // 90% opacity
        backdropFilter: 'blur(12px)',
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
              onClick={() => handleClick(item.id)}
              className="flex flex-col items-center justify-center gap-1 py-2 transition-all active:scale-90 relative"
            >
              {isCompose ? (
                // Special yellow + button
                <div 
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-transform"
                  style={{ 
                    backgroundColor: COLORS.yellow,
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
                      color: isActive ? COLORS.cream : 'rgba(250,248,245,0.6)' 
                    }}
                  />
                  <span 
                    className="text-[10px] transition-colors duration-200"
                    style={{ 
                      color: isActive ? COLORS.cream : 'rgba(250,248,245,0.6)',
                    }}
                  >
                    {item.label}
                  </span>
                </>
              )}
              {item.id === 'menu' && unreadCount > 0 && !isCompose && (
                <div 
                  className="absolute top-2 w-2.5 h-2.5 bg-red-500 rounded-full"
                  style={{ boxShadow: `0 0 0 2px ${COLORS.navy}` }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
