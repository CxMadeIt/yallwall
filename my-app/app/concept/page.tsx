"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, MessageCircle, Zap } from "lucide-react";

// Sample messages
const SAMPLE_MESSAGES = [
  { id: 1, user: "Sarah M.", avatar: "SM", message: "Storm warning for east side!", time: "2m", hoursLeft: 23, location: "East Austin", size: "normal" },
  { id: 2, user: "Mike T.", avatar: "MT", message: "Best tacos at Maria's right now 🌮", time: "5m", hoursLeft: 23, size: "normal" },
  { id: 3, user: "Jessica K.", avatar: "JK", message: "Lost dog near Lamar & 6th - brown lab, answers to Max", time: "12m", hoursLeft: 23, size: "wide" },
  { id: 4, user: "ACME Plumbing", avatar: "AP", message: "24/7 Emergency Service Available", time: "Sponsored", hoursLeft: null, size: "ad", isAd: true },
  { id: 5, user: "David R.", avatar: "DR", message: "Traffic backed up on 35, avoid if possible", time: "15m", hoursLeft: 23, size: "normal" },
  { id: 6, user: "Lisa P.", avatar: "LP", message: "Farmers market open until 2pm!", time: "18m", hoursLeft: 23, size: "normal" },
  { id: 7, user: "Tom W.", avatar: "TW", message: "Anyone know a good electrician?", time: "22m", hoursLeft: 23, size: "normal" },
];

interface MessageCardProps {
  message: typeof SAMPLE_MESSAGES[0];
  isVisible: boolean;
}

function MessageCard({ message, isVisible }: MessageCardProps) {
  const getCardClass = () => {
    if (message.isAd) return "col-span-1 md:col-span-2 bg-gradient-to-br from-[#FF6B4A]/20 to-[#FFD93D]/20 border-[#FF6B4A]/50";
    if (message.size === "wide") return "col-span-1 md:col-span-2 bg-[#141414]";
    return "col-span-1 bg-[#141414]";
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        ${getCardClass()}
        rounded-2xl p-4 border border-[#262626]
        cursor-pointer relative overflow-hidden
        hover:border-[#404040] hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1
        transition-all duration-300 ease-out
        animate-fade-in-up
      `}
      style={{ animationDelay: `${message.id * 100}ms` }}
    >
      {/* Progress bar for 24hr countdown */}
      {message.hoursLeft && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#262626]">
          <div 
            className="h-full bg-[#FF6B4A]/50 transition-all duration-1000"
            style={{ width: `${(message.hoursLeft / 24) * 100}%` }}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
          ${message.isAd ? "bg-[#FF6B4A] text-white" : "bg-[#262626] text-white"}
        `}>
          {message.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-semibold truncate ${message.isAd ? "text-[#FF6B4A]" : "text-white"}`}>
              {message.user}
            </span>
            {message.isAd && (
              <span className="text-[10px] bg-[#FFD93D] text-black px-2 py-0.5 rounded-full font-bold">
                AD
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#737373]">
            <Clock className="w-3 h-3" />
            <span>{message.time}</span>
          </div>
        </div>
      </div>

      {/* Message */}
      <p className={`leading-relaxed ${message.isAd ? "text-[#FAFAFA] text-lg" : "text-[#FAFAFA]"}`}>
        {message.message}
      </p>

      {/* Location tag */}
      {message.location && (
        <div className="mt-3 flex items-center gap-1 text-xs text-[#737373]">
          <MapPin className="w-3 h-3" />
          <span>{message.location}</span>
        </div>
      )}

      {/* Time remaining badge */}
      {message.hoursLeft && (
        <div className="absolute top-3 right-3 text-[10px] text-[#737373] bg-[#0A0A0A]/80 px-2 py-1 rounded-full">
          {message.hoursLeft}h left
        </div>
      )}
    </div>
  );
}

export default function ConceptPage() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show messages one by one
    const interval = setInterval(() => {
      setVisibleCount(prev => {
        if (prev < SAMPLE_MESSAGES.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Don't render until mounted (prevent hydration issues)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-[#737373]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Add custom animation styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B4A] rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-wider">YALLWALL</span>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse-slow" />
                <span className="text-sm text-[#737373]">AUSTIN, TX</span>
              </div>
              <div className="text-sm text-[#737373]">
                <span className="text-white font-semibold">247</span> online
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-40">
        {/* Tagline */}
        <div className="text-center mb-8">
          <p className="text-[#737373] text-lg">
            Your city&apos;s living conversation. Messages disappear in 24 hours.
          </p>
        </div>

        {/* The Floating Wall */}
        <div className="relative">
          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_MESSAGES.map((message) => (
              <MessageCard 
                key={message.id} 
                message={message} 
                isVisible={message.id <= visibleCount}
              />
            ))}
          </div>

          {/* Loading indicator */}
          {visibleCount < SAMPLE_MESSAGES.length && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2 text-[#737373]">
                <Zap className="w-5 h-5 animate-pulse-slow" />
                <span className="text-sm">Loading more messages...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#262626] p-4 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#262626] rounded-xl flex items-center justify-center text-sm font-bold">
              YOU
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Join the conversation..."
                className="w-full bg-[#141414] border border-[#262626] rounded-2xl px-4 py-3 text-white placeholder-[#737373] focus:outline-none focus:border-[#404040] transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="p-2 text-[#737373] hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button className="bg-[#FF6B4A] hover:bg-[#E55A3B] text-white px-6 py-3 rounded-2xl font-semibold transition-colors">
              Send
            </button>
          </div>
          <p className="text-center text-xs text-[#737373] mt-2">
            Your message will disappear in 24 hours
          </p>
        </div>
      </div>

      {/* Legend / Info */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-t border-[#262626] mb-32">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#737373]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#22C55E] rounded-full animate-pulse-slow" />
            <span>Live updates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-[#FF6B4A]/50 rounded-full" />
            <span>24h countdown</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FFD93D] rounded-full" />
            <span>Premium posts last longer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
