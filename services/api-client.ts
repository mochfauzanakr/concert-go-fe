import type { GlobalResponse } from "../types/common.types";
import type { TokenResponse } from "../types/auth.types";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/$/, "");
let memoryAccessToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

export const setAccessToken = (token: string | null) => {
  memoryAccessToken = token;
  if (typeof window !== "undefined") {
    if (token) sessionStorage.setItem("accessToken", token);
    else sessionStorage.removeItem("accessToken");
  }
};
export const getAccessToken = () => memoryAccessToken ||
  (typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null);

export function clearSession() {
  setAccessToken(null);
  if (typeof window !== "undefined") localStorage.removeItem("refreshToken");
}
export function saveTokens(tokens: TokenResponse) {
  setAccessToken(tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
}

async function refreshAccessToken(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) clearSession();
          return false;
        }
        const result: GlobalResponse<TokenResponse> = await response.json();
        saveTokens(result.data);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export async function apiClient<T = void>(
  endpoint: string,
  options: RequestInit & { authenticated?: boolean } = {},
): Promise<GlobalResponse<T>> {
  const { authenticated = true, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers);
  headers.set("Content-Type", "application/json");
  const token = getAccessToken();
  if (authenticated && token) headers.set("Authorization", `Bearer ${token}`);
  const request = () => fetch(`${API_URL}${endpoint}`, { ...requestOptions, headers });
  try {
    let response = await request();
    if (authenticated && response.status === 401 && await refreshAccessToken()) {
      headers.set("Authorization", `Bearer ${getAccessToken()}`);
      response = await request();
    }
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.message || `Permintaan gagal (${response.status}). Pastikan backend berjalan.`);
    if (!data) throw new Error("Respons backend tidak valid.");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Backend tidak dapat dihubungi. Periksa koneksi dan alamat API backend.");
    throw error;
  }
}
