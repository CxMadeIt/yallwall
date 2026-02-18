"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/concept-cards");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
      <div className="text-white/60 text-lg">Loading YallWall...</div>
    </div>
  );
}
