"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientClient } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Use the fixed client with disabled LockManager
        const supabase = createClientClient();

        // Wait for Supabase to process the OAuth callback from URL
        await new Promise(r => setTimeout(r, 1500));
        
        // Check if session was established
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("Authentication error");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        if (session) {
          console.log("Auth successful!");
          router.push("/concept-cards");
          router.refresh();
        } else {
          setError("Authentication failed");
          setTimeout(() => router.push("/login"), 2000);
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError("Authentication failed");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (error) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ backgroundColor: "#0D1B2A" }}
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-white/70 text-sm mb-2">{error}</p>
          <p className="text-white/30 text-xs mt-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "#0D1B2A" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div 
          className="w-12 h-12 rounded-full border-3 animate-spin"
          style={{ 
            borderColor: 'rgba(245, 166, 35, 0.3)', 
            borderTopColor: '#F5A623',
            borderWidth: '3px'
          }} 
        />
        <p className="text-white/50 text-sm">Completing sign in...</p>
      </div>
    </div>
  );
}
