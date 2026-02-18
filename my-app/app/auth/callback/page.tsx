"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientClient } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // The Supabase client automatically handles the OAuth callback
        // We just need to check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setTimeout(() => router.push("/login?error=auth_failed"), 2000);
          return;
        }

        if (session) {
          console.log("Auth successful, redirecting...");
          // Successfully authenticated, redirect to home
          router.push("/");
          router.refresh();
        } else {
          // No session yet, wait a bit and check again
          // This handles the case where the callback is still processing
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              router.push("/");
              router.refresh();
            } else {
              setError("Authentication failed. Please try again.");
              setTimeout(() => router.push("/login"), 2000);
            }
          }, 1000);
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Authentication failed");
        setTimeout(() => router.push("/login?error=callback_failed"), 2000);
      }
    };

    handleAuthCallback();
  }, [router, supabase]);

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
          <p className="text-white/70 text-sm mb-2">Authentication Error</p>
          <p className="text-white/50 text-xs">{error}</p>
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
