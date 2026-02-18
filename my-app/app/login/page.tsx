"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { createClientClient } from "@/lib/supabase";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const COLORS = {
  navy: "#0D1B2A",
  amber: "#F5A623",
};

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientClient();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the correct redirect URL based on current domain
  const getRedirectUrl = () => {
    // Use current window location, fallback to deployed domain
    const origin = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://yallwall.com';
    return `${origin}/auth/callback`;
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    const redirectUrl = getRedirectUrl();
    console.log('Redirecting to:', redirectUrl);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
    // Otherwise, user is redirected to Google
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: getRedirectUrl(),
          },
        });

        if (error) throw error;
        
        // Show success message for sign up
        alert("Check your email to confirm your account!");
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Redirect to main app on success
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 ${jakarta.variable} ${inter.variable}`}
      style={{ 
        fontFamily: "var(--font-inter), Inter, sans-serif",
        background: `linear-gradient(180deg, ${COLORS.navy} 0%, #0A1520 100%)`,
      }}
    >
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
      `}</style>

      {/* Logo & Brand */}
      <div className="text-center mb-10 animate-fade-in-up">
        <div 
          className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ 
            backgroundColor: COLORS.amber,
            boxShadow: '0 8px 32px rgba(245, 166, 35, 0.3)',
          }}
        >
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
        <h1 
          className="text-3xl font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-jakarta)" }}
        >
          Yall<span style={{ color: COLORS.amber }}>Wall</span>
        </h1>
        <p className="text-white/50 text-sm">
          {isSignUp ? "Create an account to join your community" : "Sign in to connect with your neighbors"}
        </p>
      </div>

      {/* Auth Card */}
      <div 
        className="w-full max-w-sm animate-fade-in-up animate-delay-100"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="p-6 space-y-5">
          
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          {/* Google Sign In - Primary */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: '#fff',
              color: '#333',
            }}
          >
            {/* Google Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-white/70 text-sm font-medium ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-colors text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-white/70 text-sm font-medium ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-colors text-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              style={{ backgroundColor: COLORS.amber }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="text-center pt-2">
            <p className="text-white/50 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <button
        onClick={() => router.push("/")}
        className="mt-8 text-white/40 hover:text-white/70 text-sm transition-colors animate-fade-in-up animate-delay-200"
      >
        ← Back to home
      </button>

      {/* Terms */}
      <p className="mt-6 text-white/30 text-xs text-center max-w-xs animate-fade-in-up animate-delay-300">
        By continuing, you agree to our{" "}
        <button className="text-white/50 hover:text-white/70 underline">Terms</button>
        {" "}and{" "}
        <button className="text-white/50 hover:text-white/70 underline">Privacy Policy</button>
      </p>
    </div>
  );
}
