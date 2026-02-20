"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, QrCode, Camera, Share2, Download, ScanLine } from "lucide-react";
import { createClientClient, Profile } from "@/lib/supabase";

const COLORS = {
  navy: "#0D1B2A",
  yellow: "#F5A623",
  cream: "#FAF8F5",
};

export default function QRPage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mycode' | 'scan'>('mycode');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchUserAndGenerateQR();
  }, []);

  const fetchUserAndGenerateQR = async () => {
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

    if (profile) {
      const userProfile = profile as Profile;
      setUser(userProfile);
      // Generate QR code
      const QRCode = await import('qrcode');
      const url = `https://yallwall.app/u/${userProfile.username}`;
      const dataUrl = await QRCode.toDataURL(url, { width: 400, margin: 2, color: { dark: COLORS.navy, light: '#FFFFFF' } });
      setQrUrl(dataUrl);
    }
    setLoading(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${user?.display_name || user?.username} on YallWall`,
      text: `Follow me on YallWall!`,
      url: `https://yallwall.app/u/${user?.username}`,
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `yallwall-qr-${user?.username}.png`;
    link.click();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Could not access camera. Please ensure you have granted camera permissions.');
    }
  };

  useEffect(() => {
    if (activeTab === 'scan') {
      startCamera();
    }
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [activeTab]);

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
        <h1 className="text-xl font-bold text-white">QR Code</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-6">
        <div className="flex rounded-xl p-1 gap-1 bg-white/5">
          <button
            onClick={() => setActiveTab('mycode')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: activeTab === 'mycode' ? 'rgba(245,166,35,0.3)' : 'transparent', color: activeTab === 'mycode' ? 'white' : 'rgba(255,255,255,0.5)' }}
          >
            <QrCode className="w-4 h-4" />
            My Code
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: activeTab === 'scan' ? 'rgba(245,166,35,0.3)' : 'transparent', color: activeTab === 'scan' ? 'white' : 'rgba(255,255,255,0.5)' }}
          >
            <ScanLine className="w-4 h-4" />
            Scan
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        {activeTab === 'mycode' ? (
          <div className="flex flex-col items-center">
            {/* Profile Card with QR */}
            <div className="w-full max-w-sm rounded-3xl p-6 mb-6" style={{ backgroundColor: COLORS.cream }}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: COLORS.navy }}>
                  {user?.display_name?.[0] || user?.username?.[0] || "U"}
                </div>
                <h2 className="text-xl font-bold" style={{ color: COLORS.navy }}>{user?.display_name || user?.username}</h2>
                <p className="text-sm opacity-60" style={{ color: COLORS.navy }}>@{user?.username}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {user?.is_verified && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-blue-500">✓ Verified</span>
                  )}
                  {user?.account_type === 'business' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-purple-500">🏢 Business</span>
                  )}
                </div>
              </div>

              {/* QR Code */}
              {qrUrl && (
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <img src={qrUrl} alt="QR Code" className="w-full max-w-[250px] mx-auto" />
                  <p className="text-center text-xs mt-3 opacity-50" style={{ color: COLORS.navy }}>
                    Scan to view profile
                  </p>
                </div>
              )}

              {/* Username for manual entry */}
              <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'rgba(13,27,42,0.05)' }}>
                <p className="text-xs opacity-50" style={{ color: COLORS.navy }}>Or search username</p>
                <p className="text-lg font-bold" style={{ color: COLORS.navy }}>@{user?.username}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: COLORS.yellow }}
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-white/10 hover:bg-white/20 transition-all"
              >
                <Download className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Scanner */}
            <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-black mb-6">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scan overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white/50 rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-yellow-500 -mt-1 -ml-1" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-yellow-500 -mt-1 -mr-1" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-yellow-500 -mb-1 -ml-1" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-yellow-500 -mb-1 -mr-1" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-500/50 animate-pulse" />
                </div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white/70 text-sm">Point camera at a QR code</p>
              </div>
            </div>

            <p className="text-white/50 text-sm text-center max-w-xs">
              Scan a YallWall QR code to quickly view someone's profile and send them YallPoints!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
