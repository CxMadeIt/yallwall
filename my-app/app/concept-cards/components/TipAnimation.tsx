import { useEffect } from "react";

export function TipAnimation({ show, onComplete }: { show: boolean; onComplete: () => void }) {
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
