"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { applySessionUser, landingPathForRole } from "@/lib/session";

export default function GoogleCallbackPage() {
  const started = useRef(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const params = new URLSearchParams(window.location.search);
    window.history.replaceState(null, "", window.location.pathname);
    if (!params.get("code") || !params.get("state")) {
      setError("Login Google tidak menghasilkan sesi. Silakan masuk kembali.");
      return;
    }
    authService.completeGoogleLogin(params.toString())
      .then((user) => {
        applySessionUser(user);
        window.location.replace(landingPathForRole(user.roleId));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Login gagal."));
  }, []);
  return <main className="min-h-screen bg-theme-bg p-10 text-center text-theme-text">
    <p role="status">{error || "Menyelesaikan login Google..."}</p>
    {error && <Link href="/sign-in" className="mt-4 inline-block underline">Kembali ke halaman masuk</Link>}
  </main>;
}
