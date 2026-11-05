import type { GlobalResponse } from "../types/common.types";
import type { TokenResponse } from "../types/auth.types";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "/api").replace(/\/$/, "");
let memoryAccessToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;
let sessionRevision = 0;

export class ApiError extends Error {
  constructor(message: string, public status: number, public reqId?: string, public details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const SESSION_CLEARED_EVENT = "concertgo:session-cleared";
export const SESSION_UPDATED_EVENT = "concertgo:session-updated";
export const getAccessTokenExpiresAt = () => typeof window !== "undefined" ? Number(sessionStorage.getItem("accessTokenExpiresAt") || 0) : 0;

export const setAccessToken = (token: string | null) => {
  sessionRevision++;
  memoryAccessToken = token;
  if (typeof window !== "undefined") {
    if (token) sessionStorage.setItem("accessToken", token);
    else { sessionStorage.removeItem("accessToken"); sessionStorage.removeItem("accessTokenExpiresAt"); }
  }
};
export const getAccessToken = () => memoryAccessToken ||
  (typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null);

export function clearSession() {
  sessionRevision++;
  setAccessToken(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("concertgo_session_user");
    window.dispatchEvent?.(new Event(SESSION_CLEARED_EVENT));
  }
}
export function saveTokens(tokens: TokenResponse) {
  if (!tokens?.accessToken || !tokens?.refreshToken) throw new ApiError("Respons token backend tidak valid.", 502);
  sessionRevision++;
  setAccessToken(tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  if (tokens.expiresIn > 0) sessionStorage.setItem("accessTokenExpiresAt", String(Date.now() + tokens.expiresIn * 1000));
  else sessionStorage.removeItem("accessTokenExpiresAt");
  window.dispatchEvent?.(new Event(SESSION_UPDATED_EVENT));
}

export async function refreshAccessToken(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;
  if (!refreshPromise) {
    const update = async () => {
      const revision = sessionRevision;
      const latestRefreshToken = localStorage.getItem("refreshToken");
      if (!latestRefreshToken) return false;
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: latestRefreshToken }),
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) {
          const error = await response.json().catch(() => null);
          if (revision === sessionRevision && [400, 401, 403].includes(response.status)) clearSession();
          throw new ApiError(error?.message || "Sesi tidak dapat diperbarui.", response.status, error?.reqId, error?.data);
        }
        const result: GlobalResponse<TokenResponse> = await response.json();
        if (revision !== sessionRevision) return false;
        if (!result.data?.accessToken || !result.data?.refreshToken) {
          throw new ApiError("Respons pembaruan sesi tidak valid.", 502, result.reqId);
        }
        saveTokens(result.data);
        return true;
    };
    const locked = async () => {
      if (typeof navigator !== "undefined" && navigator.locks) return await navigator.locks.request("concertgo:refresh-token", update);
      return await update();
    };
    refreshPromise = locked().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function apiClient<T = void>(
  endpoint: string,
  options: RequestInit & { authenticated?: boolean } = {},
): Promise<GlobalResponse<T>> {
  const { authenticated = true, ...requestOptions } = options;
  if (authenticated && localStorage.getItem("refreshToken") && (!getAccessToken() || getAccessTokenExpiresAt() > 0 && getAccessTokenExpiresAt() <= Date.now() + 15000)) {
    await refreshAccessToken();
  }
  const headers = new Headers(requestOptions.headers);
  if (!(typeof FormData !== "undefined" && requestOptions.body instanceof FormData) && requestOptions.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAccessToken();
  let requestRevision = sessionRevision;
  if (authenticated && token) headers.set("Authorization", `Bearer ${token}`);
  const request = () => fetch(`${API_URL}${endpoint}`, {
    ...requestOptions, headers, signal: requestOptions.signal ?? AbortSignal.timeout(15000),
  });
  try {
    let response = await request();
    if (authenticated && response.status === 401) {
      const currentToken = getAccessToken();
      const canRetry = currentToken && currentToken !== token || await refreshAccessToken();
      if (canRetry) {
        requestRevision = sessionRevision;
        headers.set("Authorization", `Bearer ${getAccessToken()}`);
        response = await request();
      }
    }
    if (authenticated && response.status === 401 && requestRevision === sessionRevision) clearSession();
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new ApiError(data?.message || `Permintaan gagal (${response.status}).`, response.status, data?.reqId, data?.data);
    if (!data) throw new ApiError("Respons backend tidak valid.", 502);
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") throw new ApiError("Backend terlalu lama merespons. Silakan coba lagi.", 504);
    if (error instanceof TypeError) throw new ApiError("Backend tidak dapat dihubungi. Periksa koneksi dan alamat API backend.", 0);
    throw error;
  }
}
