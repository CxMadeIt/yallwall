"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Bell, Moon, Shield, LogOut, MapPin, 
  MessageSquare, Heart, Zap, ToggleLeft, ToggleRight,
  Smartphone, Globe
} from "lucide-react";
import { createClientClient } from "@/lib/supabase";

const COLORS = {
  navy: "#0D1B2A",
  yellow: "#F5A623",
};

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: any;
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClientClient();
  const [user, setUser] = useState<any>(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { id: 'replies', label: 'Replies', description: 'When someone replies to your post', enabled: true, icon: MessageSquare },
    { id: 'tips', label: 'Tips', description: 'When you receive YallPoints', enabled: true, icon: Heart },
    { id: 'alerts', label: 'Emergency Alerts', description: 'Severe weather and emergencies', enabled: true, icon: Zap },
    { id: 'deals', label: 'Local Deals', description: 'New deals from businesses', enabled: false, icon: Globe },
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      
      // Check location permission
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setLocationEnabled(result.state === 'granted');
      }
    };
    fetchUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support push notifications');
      return;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setPushEnabled(true);
      // Register service worker for push
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      }
    }
  };

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationEnabled(true),
        () => setLocationEnabled(false),
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.navy }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 flex items-center gap-4" style={{ backgroundColor: COLORS.navy }}>
        <button onClick={() => router.push('/concept-cards')} className="p-2 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </header>

      <div className="px-4 pb-24 space-y-6">
        {/* Push Notifications */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5" style={{ color: COLORS.yellow }} />
              <span className="font-semibold text-white">Push Notifications</span>
            </div>
            <button 
              onClick={pushEnabled ? () => setPushEnabled(false) : requestPushPermission}
              className="transition-colors"
            >
              {pushEnabled ? (
                <ToggleRight className="w-8 h-8" style={{ color: COLORS.yellow }} />
              ) : (
                <ToggleLeft className="w-8 h-8 text-white/30" />
              )}
            </button>
          </div>
          <p className="text-sm text-white/60">
            {pushEnabled 
              ? "You'll receive notifications even when the app is closed" 
              : "Enable to get real-time alerts on your device"}
          </p>
        </div>

        {/* Notification Types */}
        <div className="space-y-3">
          <h2 className="text-white/40 text-xs uppercase tracking-wider font-semibold">Notification Types</h2>
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className="flex items-center justify-between p-4 rounded-2xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-3">
                <notif.icon className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white font-medium">{notif.label}</p>
                  <p className="text-xs text-white/50">{notif.description}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleNotification(notif.id)}
                className="transition-colors"
              >
                {notif.enabled ? (
                  <ToggleRight className="w-8 h-8" style={{ color: COLORS.yellow }} />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-white/30" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h2 className="text-white/40 text-xs uppercase tracking-wider font-semibold">Location</h2>
          <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white/60" />
                <span className="font-semibold text-white">Location Services</span>
              </div>
              <button onClick={requestLocation}>
                {locationEnabled ? (
                  <ToggleRight className="w-8 h-8" style={{ color: COLORS.yellow }} />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-white/30" />
                )}
              </button>
            </div>
            <p className="text-sm text-white/60">
              {locationEnabled 
                ? "You're verified in Cenla/Boyce area" 
                : "Enable to verify you're local and post"}
            </p>
          </div>
        </div>

        {/* Appearance */}
        <div className="space-y-3">
          <h2 className="text-white/40 text-xs uppercase tracking-wider font-semibold">Appearance</h2>
          <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-white/60" />
              <span className="font-semibold text-white">Dark Mode</span>
            </div>
            <span className="text-sm text-white/40">Always On</span>
          </div>
        </div>

        {/* Account */}
        <div className="space-y-3">
          <h2 className="text-white/40 text-xs uppercase tracking-wider font-semibold">Account</h2>
          <button 
            className="w-full flex items-center justify-between p-4 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-white/60" />
              <span className="font-semibold text-white">Privacy</span>
            </div>
            <span className="text-sm text-white/40">Public</span>
          </button>
        </div>

        {/* Sign Out */}
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Sign Out</span>
        </button>

        {/* Version */}
        <div className="text-center pt-4">
          <p className="text-white/30 text-sm">YallWall v1.0</p>
          <p className="text-white/20 text-xs mt-1">Built with 💛 in Cenla</p>
        </div>
      </div>
    </div>
  );
}
