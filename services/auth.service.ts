import { API_URL, apiClient, clearSession, saveTokens } from "./api-client";
import type { AuthResponse } from "../types/auth.types";
import type { User } from "../types/user.types";

type Registration = { name: string; email: string; password: string };

// Disimpan di sessionStorage supaya "kirim ulang kode" tetap bisa dipakai
// setelah halaman di-refresh (data di memori hilang saat reload).
const PENDING_REGISTRATION_KEY = "concertgo_pending_registration";

function readPendingRegistration(): Registration | null {
  try {
    if (typeof sessionStorage === "undefined") return null;
    const raw = sessionStorage.getItem(PENDING_REGISTRATION_KEY);
    return raw ? (JSON.parse(raw) as Registration) : null;
  } catch {
    return null;
  }
}

function writePendingRegistration(value: Registration | null): void {
  try {
    if (typeof sessionStorage === "undefined") return;
    if (value) sessionStorage.setItem(PENDING_REGISTRATION_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(PENDING_REGISTRATION_KEY);
  } catch {
    // storage penuh atau diblokir: abaikan, ini hanya bantuan UX
  }
}

export const authService = {
  async register(data: Registration): Promise<void> {
    await apiClient("/auth/register", {
      method: "POST", authenticated: false, body: JSON.stringify(data),
    });
    writePendingRegistration({ ...data });
  },
  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>("/auth/login", {
      method: "POST", authenticated: false, body: JSON.stringify(data),
    });
    saveTokens(response.data.tokens);
    return response.data;
  },
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");
    // Bersihkan sesi lokal lebih dulu: logout harus tetap berhasil walau
    // backend lambat atau tidak terjangkau.
    writePendingRegistration(null);
    clearSession();
    if (!refreshToken) return;
    try {
      await apiClient("/auth/logout", {
        method: "POST", authenticated: false, body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Token lokal sudah dibuang, jadi kegagalan revoke di server tidak
      // menghalangi pengguna keluar dari aplikasi.
    }
  },
  async getMe(): Promise<User> {
    return (await apiClient<User>("/auth/me")).data;
  },
  async verifyEmail(email: string, otp: string): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>("/auth/verify-otp", {
      method: "POST", authenticated: false, body: JSON.stringify({ email, otp }),
    });
    writePendingRegistration(null);
    saveTokens(response.data.tokens);
    return response.data;
  },
  async resendVerification(email: string): Promise<void> {
    const pending = readPendingRegistration();
    if (!pending || pending.email !== email) {
      throw new Error("Untuk mengirim kode baru, kembali ke pendaftaran dan isi formulir lagi. Kode sebelumnya masih bisa dipakai selama belum kedaluwarsa.");
    }
    await authService.register(pending);
  },
  async forgotPassword(email: string): Promise<void> {
    await apiClient("/auth/forgot-password", {
      method: "POST", authenticated: false, body: JSON.stringify({ email }),
    });
  },
  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    await apiClient("/auth/reset-password", {
      method: "POST", authenticated: false, body: JSON.stringify({ email, otp, newPassword }),
    });
  },
  async changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<void> {
    await apiClient("/auth/change-password", {
      method: "POST", body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
    });
  },
  googleLogin() {
    window.location.assign(`${API_URL}/auth/google/login`);
  },
  async completeGoogleLogin(query: string): Promise<User> {
    const response = await apiClient<AuthResponse>(`/auth/google/callback?${query}`, { authenticated: false });
    saveTokens(response.data.tokens);
    return response.data.user;
  },
};
