import { authService } from "@/services/auth.service";
import { useUserProfile, type SessionUser } from "@/lib/userProfile";
import { useAdminProfile } from "@/lib/adminProfile";

/**
 * Jembatan antara sesi backend dan profil lokal (zustand).
 * Semua jalur login harus lewat sini supaya halaman home, navbar, tiket,
 * dan halaman profil menampilkan akun yang benar-benar sedang login.
 */

/** Dipakai setelah login email, verifikasi OTP, atau login Google. */
export function applySessionUser(user: SessionUser | null | undefined): void {
  if (!user) return;
  useUserProfile.getState().applyUser(user);
  useAdminProfile.getState().applyUser(user);
}

/** Dimuat sekali saat aplikasi dibuka: ambil identitas asli dari `GET /auth/me`. */
export async function syncSessionProfile(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("refreshToken")) return;
  try {
    applySessionUser(await authService.getMe());
  } catch {
    // Sesi kedaluwarsa atau backend tidak terjangkau: biarkan profil apa adanya,
    // api-client sudah menangani refresh token dan pembersihan sesi.
  }
}

/** Dipakai saat logout agar tidak ada identitas user sebelumnya yang tertinggal. */
export function clearSessionProfile(): void {
  useUserProfile.getState().resetSession();
  useAdminProfile.getState().resetSession();
}

/**
 * Halaman tujuan setelah login, ditentukan dari role backend:
 * 1 SUPER_ADMIN, 2 ADMIN, 3 ORGANIZER, 5 STAFF -> panel admin,
 * 4 USER (atau role tidak dikenal) -> beranda pengguna.
 */
export function landingPathForRole(roleId?: number | null): string {
  return roleId && roleId !== 4 ? "/admin/dashboard" : "/user/homepage";
}
