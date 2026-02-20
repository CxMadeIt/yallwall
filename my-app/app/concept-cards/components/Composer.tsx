import { useState, useRef } from "react";
import { MapPin, Send, AlertTriangle, Gift, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { COLORS } from "../utils";
import { useImageUpload } from "../hooks/useImageUpload";

interface ComposerProps {
  onPost: (text: string, manualFlag: 'alert' | 'business' | null, imageUrl?: string | null) => Promise<void>;
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
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, isUploading } = useImageUpload();

  const handleCreatePost = async () => {
    if ((!composeText.trim() && !uploadedUrl) || isUploading) return;
    
    await onPost(composeText, manualFlag, uploadedUrl);
    
    // Reset state
    setComposeText("");
    setManualFlag(null);
    setUploadedUrl(null);
    setIsComposing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = await uploadImage(file);
      if (url) {
        setUploadedUrl(url);
      }
    }
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
          className="p-1.5 rounded-2xl transition-all duration-300"
          style={{ 
            backgroundColor: COLORS.navyDark,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          {/* Image Preview Area */}
          {(uploadedUrl || isUploading) && (
            <div className="relative mx-2 mt-2 mb-2 rounded-xl overflow-hidden bg-black/20" style={{ maxHeight: '200px' }}>
              {isUploading ? (
                <div className="flex items-center justify-center h-32 w-full">
                  <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                </div>
              ) : (
                <div className="relative">
                  <img src={uploadedUrl!} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  <button 
                    onClick={() => {
                      setUploadedUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Image Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-full hover:bg-white/10 transition-colors active:scale-90"
              style={{ color: uploadedUrl ? COLORS.yellow : COLORS.cream }}
              disabled={isUploading}
            >
              <ImageIcon className="w-5 h-5" />
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
                  if (e.key === 'Enter' && (composeText.trim() || uploadedUrl) && !isLoading && !isUploading) {
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
            
            <div className="flex items-center gap-2">
              {(isComposing || composeText.length > 0) && (
                <span className="text-xs" style={{ color: 'rgba(250,248,245,0.5)' }}>{composeText.length}/280</span>
              )}
              <button 
                className="p-2.5 rounded-full transition-all hover:scale-105 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: (composeText.trim() || uploadedUrl) ? COLORS.yellow : 'rgba(255,255,255,0.1)' }}
                onClick={handleCreatePost}
                disabled={isLoading || isUploading || (!composeText.trim() && !uploadedUrl)}
              >
                {isLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
              </button>
            </div>
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
