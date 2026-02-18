"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Moon, Shield, LogOut } from "lucide-react";
import { createClientClient } from "@/lib/supabase";

const COLORS = {
  navy: "#0D1B2A",
  amber: "#F5A623",
};

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClientClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
    };
    fetchUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const SettingRow = ({ icon: Icon, label, value, onClick }: any) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors"
      style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-white/60" />
        <span className="text-white/90">{label}</span>
      </div>
      {value && <span className="text-white/40 text-sm">{value}</span>}
    </button>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.navy }}>
      <header className="sticky top-0 z-50 px-4 h-14 flex items-center gap-4" style={{ backgroundColor: COLORS.navy, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => router.back()} className="p-2 -ml-2 text-white/70 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-semibold text-lg">Settings</h1>
      </header>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-white/40 text-xs uppercase tracking-wider px-1">Preferences</h2>
          <SettingRow icon={Bell} label="Notifications" value="On" />
          <SettingRow icon={Moon} label="Dark Mode" value="Always" />
        </div>

        <div className="space-y-2">
          <h2 className="text-white/40 text-xs uppercase tracking-wider px-1">Account</h2>
          <SettingRow icon={Shield} label="Privacy" />
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 transition-colors text-red-400"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="pt-8 text-center">
          <p className="text-white/30 text-sm">YallWall v1.0</p>
          {user?.email && <p className="text-white/20 text-xs mt-1">{user.email}</p>}
        </div>
      </div>
    </div>
  );
}
