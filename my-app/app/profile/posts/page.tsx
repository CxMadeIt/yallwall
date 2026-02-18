"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { createClientClient } from "@/lib/supabase";

const COLORS = {
  navy: "#0D1B2A",
  amber: "#F5A623",
};

interface Message {
  id: string;
  content: string;
  created_at: string;
  replies_count: number;
  likes_count: number;
}

export default function MyPostsPage() {
  const router = useRouter();
  const supabase = createClientClient();
  const [posts, setPosts] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select('id, content, created_at, replies_count, likes_count')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [router, supabase]);

  const formatTime = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diff = Math.floor((now.getTime() - posted.getTime()) / 1000);
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.navy }}>
      <header className="sticky top-0 z-50 px-4 h-14 flex items-center gap-4" style={{ backgroundColor: COLORS.navy, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => router.back()} className="p-2 -ml-2 text-white/70 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-semibold text-lg">My Posts</h1>
      </header>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-12 text-white/40">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-white/20 mb-4" />
            <p className="text-white/40">You haven&apos;t posted yet</p>
            <button 
              onClick={() => router.push('/concept-cards')}
              className="mt-4 text-amber-400 font-medium"
            >
              Start a conversation
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div 
                key={post.id} 
                className="p-4 rounded-xl cursor-pointer"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={() => router.push('/concept-cards')}
              >
                <p className="text-white/90 line-clamp-3">{post.content}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-white/40">
                  <span>{formatTime(post.created_at)}</span>
                  <span>{post.likes_count} likes</span>
                  <span>{post.replies_count} replies</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
