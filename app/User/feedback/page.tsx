"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/User/settings?tab=feedback");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6efe1] text-[#241608]">
      <div className="rounded-3xl border border-[#e6d9bf] bg-white/80 p-8 text-center shadow-md">
        <span className="text-3xl">💬</span>
        <p className="mt-3 text-sm font-bold text-[#241608]">Membuka Halaman Masukan & Feedback...</p>
        <p className="mt-1 text-xs text-[#8a7a63]">Mohon tunggu sebentar.</p>
      </div>
    </div>
  );
}
