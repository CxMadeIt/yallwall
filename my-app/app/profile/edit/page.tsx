"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, MapPin } from "lucide-react";
import { createClientClient, Profile } from "@/lib/supabase";

const COLORS = {
  navy: "#0D1B2A",
  amber: "#F5A623",
};

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClientClient();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");


  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      const profile = data as Profile | null;
      
      if (profile) {
        setUser(profile);
        setDisplayName(profile.display_name || '');
        setUsername(profile.username || '');
        setCity(profile.city || 'Cenla');
        setState(profile.state || 'LA');

      }
      setLoading(false);
    };
    fetchUser();
  }, [router, supabase]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    
    const updateData: Partial<Profile> = {
      display_name: displayName || null,
      username: username,
      city: city,
      state: state,
      updated_at: new Date().toISOString(),
    };
    
    const { error } = await (supabase
      .from('profiles') as any)
      .update(updateData)
      .eq('id', user.id);
    
    if (error) {
      alert('Failed to save: ' + error.message);
    } else {
      router.push('/concept-cards');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.navy }}>
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.navy }}>
      <header className="sticky top-0 z-50 px-4 h-14 flex items-center gap-4" style={{ backgroundColor: COLORS.navy, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => router.back()} className="p-2 -ml-2 text-white/70 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-semibold text-lg">Edit Profile</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="ml-auto text-amber-400 font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </header>

      <div className="p-4 space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.2)' }}
            >
              {displayName?.[0] || user?.username?.[0] || "U"}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.amber }}>
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-white/40 text-sm mt-2">Change Photo</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-1 block">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-white/60 text-sm mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
              placeholder="@username"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/60 text-sm mb-1 block">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
                  placeholder="City"
                />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50"
                placeholder="State"
              />
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
