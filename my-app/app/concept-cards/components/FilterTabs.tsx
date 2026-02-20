import { COLORS, CONTENT_FILTERS } from "../utils";
import { ContentFilterId } from "../types";

interface FilterTabsProps {
  activeTab: ContentFilterId;
  onTabChange: (tab: ContentFilterId) => void;
  isModalOpen: boolean;
}

export function FilterTabs({ activeTab, onTabChange, isModalOpen }: FilterTabsProps) {
  return (
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
        <div className="flex justify-center">
          <div 
            className="inline-flex p-1 rounded-2xl bg-white/5 backdrop-blur-sm"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {CONTENT_FILTERS.map((filter) => {
              const isActive = activeTab === filter.id;
              
              return (
                <button
                  key={filter.id}
                  onClick={() => onTabChange(filter.id as ContentFilterId)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                    isActive 
                      ? "text-white shadow-lg" 
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                  style={{
                    backgroundColor: isActive ? COLORS.accent : undefined,
                    boxShadow: isActive ? `0 2px 12px ${COLORS.accent}66` : 'none',
                  }}
                >
                  {filter.isLive && (
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  )}
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full live-pulse" />
          <span className="text-xs text-white/60">333 Neighbors Online</span>
        </div>
      </div>
    </div>
  );
}
