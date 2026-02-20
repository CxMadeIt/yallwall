import { useEffect } from "react";

export function Toast({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) {
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
