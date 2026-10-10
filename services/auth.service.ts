import { apiClient, setAccessToken } from "./api-client";
import { AuthResponse } from "../types/auth.types";
import { User } from "../types/user.types";

export const authService = {
  async register(data: any): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    // Auto-login after register based on prompt flow
    setAccessToken(response.data.tokens.accessToken);
    localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
    return response.data;
  },

  async login(data: any): Promise<AuthResponse> {
    const response = await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    setAccessToken(response.data.tokens.accessToken);
    localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await apiClient("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error("Logout API failed", error);
      }
    }
    
    setAccessToken(null);
    localStorage.removeItem("refreshToken");
  },

  async getMe(): Promise<User> {
    const response = await apiClient<User>("/auth/me", {
      method: "GET",
    });
    return response.data;
  },

  async verifyEmail(email: string, code: string): Promise<void> {
    await apiClient("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },

  async resendVerification(email: string): Promise<void> {
    await apiClient("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};
