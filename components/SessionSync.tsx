"use client";

import { useEffect } from "react";
import { clearSessionProfile, syncSessionProfile } from "@/lib/session";
import { SESSION_CLEARED_EVENT, SESSION_UPDATED_EVENT, getAccessToken, getAccessTokenExpiresAt, refreshAccessToken, setAccessToken } from "@/services/api-client";
import { useSessionState } from "@/lib/session-state";

/**
 * Menyelaraskan profil lokal dengan akun backend setiap kali layout dimuat.
 * Tanpa render apa pun — hanya efek samping.
 */
export default function SessionSync() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let active = true;
    const schedule = () => {
      clearTimeout(timer);
      const expiry = getAccessTokenExpiresAt();
      if (!expiry || !localStorage.getItem("refreshToken")) return;
      timer = setTimeout(async () => {
        if (document.visibilityState === "hidden") return;
        try { await refreshAccessToken(); }
        catch { if (active && localStorage.getItem("refreshToken")) timer = setTimeout(schedule, 30000); }
      }, Math.max(1000, expiry - Date.now() - 30000));
    };
    const onVisible = () => { if (document.visibilityState === "visible") schedule(); };
    const onStorage = (event: StorageEvent) => {
      const currentUser = useSessionState.getState().user;
      const changedAccount = event.key === "concertgo_session_user" && currentUser !== null && event.newValue !== currentUser.id;
      if (event.key === null || changedAccount || event.key === "refreshToken" && (!event.newValue || !getAccessToken())) {
        setAccessToken(null);
        void syncSessionProfile();
      }
    };
    if (new URLSearchParams(window.location.search).get("preview") === "demo") {
      sessionStorage.setItem("concertgo_demo_preview", "true");
    }
    useSessionState.setState({ demo: sessionStorage.getItem("concertgo_demo_preview") === "true" });
    window.addEventListener(SESSION_CLEARED_EVENT, clearSessionProfile);
    window.addEventListener("storage", onStorage);
    window.addEventListener(SESSION_UPDATED_EVENT, schedule);
    document.addEventListener("visibilitychange", onVisible);
    sessionStorage.removeItem("concertgo_pending_registration");
    void syncSessionProfile();
    schedule();
    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener(SESSION_CLEARED_EVENT, clearSessionProfile);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SESSION_UPDATED_EVENT, schedule);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
