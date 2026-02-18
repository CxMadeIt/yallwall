"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark } from "lucide-react";

const COLORS = {
  navy: "#0D1B2A",
  amber: "#F5A623",
};

export default function SavedItemsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.navy }}>
      <header className="sticky top-0 z-50 px-4 h-14 flex items-center gap-4" style={{ backgroundColor: COLORS.navy, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={() => router.back()} className="p-2 -ml-2 text-white/70 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-semibold text-lg">Saved Items</h1>
      </header>

      <div className="p-4">
        <div className="text-center py-12">
          <Bookmark className="w-12 h-12 mx-auto text-white/20 mb-4" />
          <p className="text-white/40">Coming Soon</p>
          <p className="text-white/30 text-sm mt-2">Save posts to revisit later</p>
        </div>
      </div>
    </div>
  );
}
