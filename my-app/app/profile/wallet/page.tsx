"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Wallet, History, Gift, Zap, Crown, 
  Plus, Sparkles, TrendingUp, ArrowUpRight, ArrowDownLeft
} from "lucide-react";
import { createClientClient, Profile, Transaction } from "@/lib/supabase";

// Colors
const COLORS = {
  navy: "#0D1B2A",
  yellow: "#F5A623",
};

// Purchase packages
const POINT_PACKAGES = [
  { id: 'starter', points: 500, price: 4.99, popular: false, bonus: 0 },
  { id: 'popular', points: 1200, price: 9.99, popular: true, bonus: 100 },
  { id: 'pro', points: 3000, price: 19.99, popular: false, bonus: 500 },
];

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'buy' | 'history'>('overview');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
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

    const { data: txns } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (txns) setTransactions(txns);
    setLoading(false);
  };

  const handlePurchase = async (pkg: typeof POINT_PACKAGES[0]) => {
    alert(`Purchase ${pkg.points} YallPoints for $${pkg.price} - Stripe integration coming soon!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.navy }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.yellow }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.navy }}>
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-4 flex items-center gap-4" style={{ backgroundColor: COLORS.navy }}>
        <button onClick={() => router.push('/concept-cards')} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">YallPoints Wallet</h1>
      </div>

      {/* Balance Card */}
      <div className="px-4 pb-6">
        <div className="rounded-3xl p-6 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLORS.yellow} 0%, #D4891A 100%)` }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-white/80 text-sm mb-2">Available Balance</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-bold text-white">{user?.yallpoints || 0}</span>
              <span className="text-2xl">🪙</span>
            </div>
            <p className="text-white/70 text-sm mt-2">{user?.account_type === 'business' ? 'Business Account' : 'Free Tier'}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-4 text-center bg-white/5">
          <TrendingUp className="w-5 h-5 mx-auto mb-2" style={{ color: COLORS.yellow }} />
          <p className="text-xl font-bold text-white">{user?.tips_received || 0}</p>
          <p className="text-xs text-white/50">Tips Received</p>
        </div>
        <div className="rounded-2xl p-4 text-center bg-white/5">
          <Gift className="w-5 h-5 mx-auto mb-2" style={{ color: COLORS.yellow }} />
          <p className="text-xl font-bold text-white">{user?.yallpoints_earned || 0}</p>
          <p className="text-xs text-white/50">Points Earned</p>
        </div>
        <div className="rounded-2xl p-4 text-center bg-white/5">
          <Zap className="w-5 h-5 mx-auto mb-2" style={{ color: COLORS.yellow }} />
          <p className="text-xl font-bold text-white">{user?.tips_given || 0}</p>
          <p className="text-xs text-white/50">Tips Given</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-4">
        <div className="flex rounded-xl p-1 gap-1 bg-white/5">
          {[
            { id: 'overview', label: 'Overview', icon: Wallet },
            { id: 'buy', label: 'Buy Points', icon: Plus },
            { id: 'history', label: 'History', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ backgroundColor: activeTab === tab.id ? 'rgba(245,166,35,0.3)' : 'transparent', color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.5)' }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="rounded-2xl p-4 bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5" style={{ color: COLORS.yellow }} />
                <span className="font-semibold text-white">Free Monthly Points</span>
              </div>
              <p className="text-sm text-white/60">You get 250 free YallPoints every month! Resets on the 1st.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveTab('buy')} className="p-4 rounded-2xl text-left bg-white/5 hover:bg-white/10">
                <Plus className="w-6 h-6 mb-3" style={{ color: COLORS.yellow }} />
                <p className="font-semibold text-white">Buy Points</p>
                <p className="text-xs text-white/50">Get more to tip</p>
              </button>
              <button onClick={() => router.push('/profile/qr')} className="p-4 rounded-2xl text-left bg-white/5 hover:bg-white/10">
                <Crown className="w-6 h-6 mb-3" style={{ color: COLORS.yellow }} />
                <p className="font-semibold text-white">My QR Code</p>
                <p className="text-xs text-white/50">Share to receive</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'buy' && (
          <div className="space-y-4">
            <p className="text-white/60 text-sm text-center">Purchase YallPoints to tip your favorite locals!</p>
            {POINT_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="relative rounded-2xl p-5 border-2 border-transparent hover:border-yellow-500/50 transition-all cursor-pointer bg-white/5" onClick={() => handlePurchase(pkg)}>
                {pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-yellow-500">MOST POPULAR</div>}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-white">{pkg.points.toLocaleString()}</span>
                      <span className="text-xl">🪙</span>
                    </div>
                    {pkg.bonus > 0 && <span className="text-xs font-medium text-yellow-500">+{pkg.bonus} bonus!</span>}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">${pkg.price}</p>
                    <button className="mt-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-yellow-500">Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 mx-auto mb-4 text-white/20" />
                <p className="text-white/50">No transactions yet</p>
                <p className="text-sm text-white/30">Start tipping to see your history!</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'tip_received' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {tx.type === 'tip_received' ? <ArrowDownLeft className="w-5 h-5 text-green-500" /> : <ArrowUpRight className="w-5 h-5 text-red-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-white capitalize">{tx.type.replace(/_/g, ' ')}</p>
                      {tx.description && <p className="text-xs text-white/50">{tx.description}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'tip_received' ? 'text-green-400' : 'text-white'}`}>
                      {tx.type === 'tip_received' ? '+' : '-'}{tx.amount} 🪙
                    </p>
                    <p className="text-xs text-white/40">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
