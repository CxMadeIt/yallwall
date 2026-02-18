"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Mail, ExternalLink } from "lucide-react";

const COLORS = {
  navy: "#0D1B2A",
  amber: "#F5A623",
};

const faqs = [
  {
    q: "What is YallWall?",
    a: "YallWall is a hyper-local, real-time chat platform for communities. Think of it as your city&apos;s 24/7 live-chat room where locals can share updates, ask questions, and connect with neighbors."
  },
  {
    q: "Who can see my posts?",
    a: "Your posts are visible to everyone in your local area. We prioritize showing posts to people nearby, creating a true community feel."
  },
  {
    q: "How do likes work?",
    a: "Double-tap any post to like it! Likes help surface the most engaging content to the top of the feed."
  },
  {
    q: "Can I delete my posts?",
    a: "Yes! Tap the delete button (bottom right of your own posts) to remove them."
  },
];

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.navy }}>
      <header className="sticky top-0 z-50 px-4 h-14 flex items-center gap-4" style={{ backgroundColor: COLORS.navy, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => router.back()} className="p-2 -ml-2 text-white/70 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-semibold text-lg">Help & Support</h1>
      </header>

      <div className="p-4 space-y-6">
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-5 h-5" style={{ color: COLORS.amber }} />
            <span className="text-amber-300 font-medium">Need help? Chat with Yall-e</span>
          </div>
          <p className="text-white/50 text-sm">Our AI moderator is here to help with local events, weather, and community questions.</p>
        </div>

        <div>
          <h2 className="text-white/40 text-xs uppercase tracking-wider mb-3">Frequently Asked</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <h3 className="text-white/90 font-medium mb-1">{faq.q}</h3>
                <p className="text-white/50 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-white/40 text-xs uppercase tracking-wider mb-3">Contact</h2>
          <a 
            href="mailto:support@yallwall.app"
            className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-white/60" />
              <span className="text-white/90">Email Support</span>
            </div>
            <ExternalLink className="w-4 h-4 text-white/40" />
          </a>
        </div>
      </div>
    </div>
  );
}
