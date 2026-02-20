"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Building2, BadgeCheck, TrendingUp, Users, 
  Megaphone, Sparkles, ChevronRight, Lock
} from "lucide-react";
import { createClientClient, Profile } from "@/lib/supabase";

const COLORS = {
  navy: "#0D1B2A",
  yellow: "#F5A623",
  purple: "#8B5CF6",
};

// Business features
const BUSINESS_FEATURES = [
  { icon: BadgeCheck, title: "Verified Badge", desc: "Blue checkmark on your profile" },
  { icon: Megaphone, title: "Promoted Posts", desc: "Boost your deals to the top" },
  { icon: TrendingUp, title: "Analytics", desc: "See who engages with your content" },
  { icon: Users, title: "Customer Insights", desc: "Demographics of your followers" },
];

export default function BusinessPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const supabase = createClientClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) setUser(profile);
    setLoading(false);
  };

  const handleUpgrade = () => {
    alert('Business account upgrade coming soon! Contact us at business@yallwall.app');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.navy }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.yellow }} />
      </div>
    );
  }

  const isBusiness = user?.account_type === 'business';

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.navy }}>
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-4 flex items-center gap-4" style={{ backgroundColor: COLORS.navy }}>
        <button onClick={() => router.push('/concept-cards')} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Business Portal</h1>
      </div>

      {/* Status Card */}
      <div className="px-4 pb-6">
        <div className={`rounded-3xl p-6 relative overflow-hidden ${
          isBusiness ? 'bg-gradient-to-br from-purple-600 to-purple-800' : 'bg-white/5'
        }`}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isBusiness ? 'bg-white/20' : 'bg-white/10'
              }`}>
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isBusiness ? 'Business Account' : 'Regular Account'}
                </h2>
                <p className="text-white/60 text-sm">
                  {isBusiness ? 'Verified & Active' : 'Upgrade to unlock features'}
                </p>
              </div>
            </div>

            {isBusiness ? (
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Verified Business</span>
              </div>
            ) : (
              <button 
                onClick={handleUpgrade}
                className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{ backgroundColor: COLORS.yellow }}
              >
                <Sparkles className="w-5 h-5" />
                Upgrade to Business
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 pb-6">
        <h3 className="font-bold text-white mb-4">Business Features</h3>
        <div className="grid grid-cols-2 gap-3">
          {BUSINESS_FEATURES.map((feature) => (
            <div 
              key={feature.title}
              className={`p-4 rounded-2xl ${isBusiness ? 'bg-white/10' : 'bg-white/5 opacity-60'}`}
            >
              <feature.icon className="w-6 h-6 mb-3" style={{ color: isBusiness ? COLORS.yellow : 'rgba(255,255,255,0.5)' }} />
              <p className="font-semibold text-white text-sm">{feature.title}</p>
              <p className="text-xs text-white/50 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      {!isBusiness && (
        <div className="px-4 pb-6">
          <h3 className="font-bold text-white mb-4">Pricing</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl border-2 border-yellow-500/50 bg-yellow-500/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">Business Starter</span>
                <span className="text-2xl font-bold" style={{ color: COLORS.yellow }}>$29/mo</span>
              </div>
              <ul className="text-sm text-white/70 space-y-1">
                <li>✓ Verified badge</li>
                <li>✓ 5 promoted posts/month</li>
                <li>✓ Basic analytics</li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">Business Pro</span>
                <span className="text-2xl font-bold text-white">$79/mo</span>
              </div>
              <ul className="text-sm text-white/70 space-y-1">
                <li>✓ Everything in Starter</li>
                <li>✓ Unlimited promoted posts</li>
                <li>✓ Advanced analytics & insights</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Stats (if business) */}
      {isBusiness && (
        <div className="px-4 pb-6">
          <h3 className="font-bold text-white mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 text-center">
              <p className="text-3xl font-bold" style={{ color: COLORS.yellow }}>1.2k</p>
              <p className="text-xs text-white/50">Profile Views</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 text-center">
              <p className="text-3xl font-bold" style={{ color: COLORS.yellow }}>89</p>
              <p className="text-xs text-white/50">New Followers</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 text-center">
              <p className="text-3xl font-bold" style={{ color: COLORS.yellow }}>456</p>
              <p className="text-xs text-white/50">Post Engagement</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 text-center">
              <p className="text-3xl font-bold" style={{ color: COLORS.yellow }}>23</p>
              <p className="text-xs text-white/50">Tips Received</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="px-4 pb-24">
        <div className="p-4 rounded-2xl text-center bg-white/5">
          <p className="text-white/60 text-sm">
            Questions about business accounts?
          </p>
          <a 
            href="mailto:business@yallwall.app" 
            className="text-sm font-medium mt-2 inline-block"
            style={{ color: COLORS.yellow }}
          >
            business@yallwall.app
          </a>
        </div>
      </div>
    </div>
  );
}
