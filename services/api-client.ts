import { GlobalResponse } from "../types/common.types";
import { TokenResponse } from "../types/auth.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Fungsi pembantu untuk mengambil access token dari memory (state/store)
// Di aplikasi sebenarnya, kamu mungkin menggunakan Zustand atau Context
let memoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  memoryAccessToken = token;
};

export const getAccessToken = () => memoryAccessToken;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error("Refresh failed");
    
    const result: GlobalResponse<TokenResponse> = await response.json();
    setAccessToken(result.data.accessToken);
    localStorage.setItem("refreshToken", result.data.refreshToken);
    return true;
  } catch (error) {
    setAccessToken(null);
    localStorage.removeItem("refreshToken");
    // Redirect ke login bisa dihandle di level komponen/router
    if (typeof window !== "undefined") window.location.href = "/sign-in";
    return false;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<GlobalResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  let response = await fetch(url, config);

  // Auto-retry logic for 401
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the request with new token
      headers["Authorization"] = `Bearer ${getAccessToken()}`;
      response = await fetch(url, { ...config, headers });
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "An error occurred");
  }

  return data;
}
