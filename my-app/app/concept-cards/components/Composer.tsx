import { useState, useRef } from "react";
import { MapPin, Send, AlertTriangle, Gift } from "lucide-react";
import { COLORS } from "../utils";

interface ComposerProps {
  onPost: (text: string, manualFlag: 'alert' | 'business' | null) => Promise<void>;
  isLoading: boolean;
  showInput: boolean;
  isModalOpen: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function Composer({ 
  onPost, 
  isLoading, 
  showInput, 
  isModalOpen,
  onFocus,
  onBlur 
}: ComposerProps) {
  const [composeText, setComposeText] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [manualFlag, setManualFlag] = useState<'alert' | 'business' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = async () => {
    if (!composeText.trim()) return;
    await onPost(composeText, manualFlag);
    setComposeText("");
    setManualFlag(null);
    setIsComposing(false);
  };

  return (
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
        <div 
          className="p-1.5 rounded-2xl"
          style={{ 
            backgroundColor: COLORS.navyDark,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          <div className="flex items-center gap-2">
            <button 
              className="p-2.5 rounded-full hover:bg-white/10 transition-colors active:scale-90"
              style={{ color: COLORS.cream }}
            >
              <MapPin className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
                onFocus={() => {
                  setIsComposing(true);
                  onFocus?.();
                }}
                onBlur={() => {
                  setIsComposing(false);
                  onBlur?.();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && composeText.trim() && !isLoading) {
                    e.preventDefault();
                    handleCreatePost();
                  }
                }}
                placeholder={isComposing ? "What's happening in Cenla?" : "Say something nice..."}
                className="w-full bg-transparent focus:outline-none text-sm py-2.5 px-2 placeholder:text-white/40"
                style={{ 
                  color: COLORS.cream,
                }}
              />
            </div>
            
            {isComposing || composeText.length > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'rgba(250,248,245,0.5)' }}>{composeText.length}/280</span>
                <button 
                  className="p-2.5 rounded-full transition-all hover:scale-105 active:scale-90 disabled:opacity-50"
                  style={{ backgroundColor: COLORS.yellow }}
                  onClick={handleCreatePost}
                  disabled={isLoading || !composeText.trim()}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button 
                className="p-2.5 rounded-full transition-all hover:scale-105 active:scale-90 disabled:opacity-50"
                style={{ backgroundColor: COLORS.yellow }}
                onClick={handleCreatePost}
                disabled={isLoading || !composeText.trim()}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
        {/* Manual Flag Buttons */}
        <div className="flex gap-2 mt-2 px-1">
          <button
            onClick={() => setManualFlag(manualFlag === 'alert' ? null : 'alert')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              manualFlag === 'alert' ? 'bg-red-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Alert
          </button>
          <button
            onClick={() => setManualFlag(manualFlag === 'business' ? null : 'business')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              manualFlag === 'business' ? 'bg-green-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            Business/Deal
          </button>
          {manualFlag && (
            <button
              onClick={() => setManualFlag(null)}
              className="text-white/40 text-xs hover:text-white/60 px-2"
            >
              Clear
            </button>
          )}
        </div>
        
        <p className="text-center text-[10px] text-white/30 mt-2">
          Messages disappear after 24 hours
        </p>
      </div>
    </div>
  );
}
