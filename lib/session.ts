import { authService } from "@/services/auth.service";
import { useUserProfile } from "@/lib/userProfile";
import { useAdminProfile } from "@/lib/adminProfile";
import { getAccessToken } from "@/services/api-client";
import { useSessionState } from "@/lib/session-state";
import type { User } from "@/types/user.types";
let syncVersion = 0;

/**
 * Jembatan antara sesi backend dan profil lokal (zustand).
 * Semua jalur login harus lewat sini supaya halaman home, navbar, tiket,
 * dan halaman profil menampilkan akun yang benar-benar sedang login.
 */

/** Dipakai setelah login email, verifikasi OTP, atau login Google. */
export function applySessionUser(user: User | null | undefined): void {
  if (!user) return;
  syncVersion++;
  useUserProfile.getState().applyUser(user);
  useAdminProfile.getState().applyUser(user);
  useSessionState.setState({ status: "authenticated", user, error: null, demo: false });
  localStorage.setItem("concertgo_session_user", user.id);
  sessionStorage.removeItem("concertgo_demo_preview");
}

/** Dimuat sekali saat aplikasi dibuka: ambil identitas asli dari `GET /auth/me`. */
export async function syncSessionProfile(): Promise<void> {
  if (typeof window === "undefined") return;
  const version = ++syncVersion;
  if (!localStorage.getItem("refreshToken") && !getAccessToken()) {
    clearSessionProfile();
    return;
  }
  useSessionState.setState({ status: "loading", error: null });
  try {
    const user = await authService.getMe();
    if (version !== syncVersion) return;
    if (!getAccessToken() && !localStorage.getItem("refreshToken")) return;
    applySessionUser(user);
  } catch (error) {
    if (version !== syncVersion) return;
    if (!getAccessToken() && !localStorage.getItem("refreshToken")) {
      clearSessionProfile();
    } else {
      useSessionState.setState({ status: "unavailable", error: error instanceof Error ? error.message : "Sesi belum dapat diperiksa." });
    }
  }
}

/** Dipakai saat logout agar tidak ada identitas user sebelumnya yang tertinggal. */
export function clearSessionProfile(): void {
  syncVersion++;
  useUserProfile.getState().resetSession();
  useAdminProfile.getState().resetSession();
  useSessionState.setState({ status: "guest", user: null, error: null });
}

/**
 * Halaman tujuan setelah login, ditentukan dari role backend:
 * Role tidak dikenal tidak mendapat akses workspace.
 */
export function landingPathForRole(roleId?: number | null): string {
  switch (roleId) {
    case 1: case 2: return "/admin/dashboard";
    case 3: return "/organizer";
    case 4: return "/user/homepage";
    case 5: return "/staff/scanner";
    default: return "/account-access";
  }
}

export function safeReturnPath(value: string | null, roleId?: number | null): string {
  const fallback = landingPathForRole(roleId);
  if (!value?.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return fallback;
  const pathname = value.split(/[?#]/)[0];
  if (roleId === 4 && (pathname === "/user" || pathname.startsWith("/user/"))) return value;
  if ((roleId === 1 || roleId === 2) && pathname.startsWith("/admin/")) return value;
  if (roleId === 3 && pathname === "/organizer") return value;
  if (roleId === 5 && pathname.startsWith("/staff/")) return value;
  return fallback;
}
