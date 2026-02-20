"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Trophy, Users, Star, ArrowUpRight } from "lucide-react";
import { createClientClient, Profile } from "@/lib/supabase";

const COLORS = {
  navy: "#0D1B2A",
  yellow: "#F5A623",
};

// Mock data for top contributors
const TOP_GIVERS = [
  { rank: 1, username: "sarah_helpful", display_name: "Sarah M.", tips_given: 2450, avatar: null },
  { rank: 2, username: "mike_community", display_name: "Mike T.", tips_given: 1890, avatar: null },
  { rank: 3, username: "jenny_cares", display_name: "Jenny L.", tips_given: 1560, avatar: null },
];

const GOOD_DEEDS = [
  { id: 1, user: "sarah_helpful", action: "tipped 50 points to", recipient: "lost_puppy_poster", message: "Thanks for helping find my dog! 🐕", time: "2 hours ago" },
  { id: 2, user: "community_hero", action: "tipped 100 points to", recipient: "flood_volunteer", message: "Amazing work helping during the flood! 💙", time: "4 hours ago" },
  { id: 3, user: "local_supporter", action: "tipped 25 points to", recipient: "new_biz_owner", message: "Welcome to the neighborhood! 🎉", time: "6 hours ago" },
];

export default function GoodDeedsPage() {
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
        <h1 className="text-xl font-bold text-white">Good Deeds 💛</h1>
      </div>

      {/* Hero */}
      <div className="px-4 pb-6">
        <div className="rounded-3xl p-6 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5A623 0%, #D4891A 100%)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <Heart className="w-12 h-12 mx-auto mb-3 text-white" />
          <h2 className="text-2xl font-bold text-white mb-2">Spread the Love</h2>
          <p className="text-white/80 text-sm">
            See who's making YallWall a better place through tipping and kindness
          </p>
        </div>
      </div>

      {/* Your Stats */}
      <div className="px-4 pb-6">
        <div className="rounded-2xl p-4 bg-white/5">
          <p className="text-white/50 text-sm mb-3">Your Impact</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: COLORS.yellow }}>{user?.tips_given || 0}</p>
              <p className="text-xs text-white/50">Tips Given</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: COLORS.yellow }}>{user?.tips_received || 0}</p>
              <p className="text-xs text-white/50">Tips Received</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: COLORS.yellow }}>#{user?.tips_given ? Math.max(1, 1000 - (user.tips_given * 10)) : '-'}</p>
              <p className="text-xs text-white/50">Local Rank</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Givers Leaderboard */}
      <div className="px-4 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5" style={{ color: COLORS.yellow }} />
          <h3 className="font-bold text-white">Top Givers This Month</h3>
        </div>
        
        <div className="space-y-3">
          {TOP_GIVERS.map((giver, idx) => (
            <div key={giver.username} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                idx === 0 ? 'bg-yellow-500 text-white' : 
                idx === 1 ? 'bg-gray-400 text-white' : 
                idx === 2 ? 'bg-orange-400 text-white' : 'bg-white/10 text-white'
              }`}>
                {giver.rank}
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold text-white">
                {giver.display_name[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{giver.display_name}</p>
                <p className="text-xs text-white/50">@{giver.username}</p>
              </div>
              <div className="text-right">
                <p className="font-bold" style={{ color: COLORS.yellow }}>{giver.tips_given.toLocaleString()} 🪙</p>
                <p className="text-xs text-white/50">given</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Good Deeds Feed */}
      <div className="px-4 pb-24">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5" style={{ color: COLORS.yellow }} />
          <h3 className="font-bold text-white">Recent Good Deeds</h3>
        </div>

        <div className="space-y-3">
          {GOOD_DEEDS.map((deed) => (
            <div key={deed.id} className="p-4 rounded-2xl bg-white/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-semibold">@{deed.user}</span>{' '}
                    <span className="text-white/60">{deed.action}</span>{' '}
                    <span className="font-semibold">@{deed.recipient}</span>
                  </p>
                  <p className="text-sm text-white/80 mt-1 italic">"{deed.message}"</p>
                  <p className="text-xs text-white/40 mt-2">{deed.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6 p-4 rounded-2xl text-center" style={{ backgroundColor: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
          <p className="text-white/70 text-sm mb-3">
            Every tip helps build a stronger community. Who will you appreciate today?
          </p>
          <button 
            onClick={() => router.push('/concept-cards')}
            className="px-6 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ backgroundColor: COLORS.yellow }}
          >
            Back to Feed
          </button>
        </div>
      </div>
    </div>
  );
}
