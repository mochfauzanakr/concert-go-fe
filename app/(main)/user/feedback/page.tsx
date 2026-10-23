"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/settings?tab=feedback");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-bg text-theme-text">
      <div className="rounded-3xl border border-theme-border bg-theme-card/80 p-8 text-center shadow-md">
        <span className="text-3xl">💬</span>
        <p className="mt-3 text-sm font-bold text-theme-text">Membuka Halaman Masukan & Feedback...</p>
        <p className="mt-1 text-xs text-theme-text-light">Mohon tunggu sebentar.</p>
      </div>
    </div>
  );
}
