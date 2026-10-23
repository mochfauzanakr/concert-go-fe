import { apiClient } from "./api-client";
import { User } from "../types/user.types";

export interface Invite {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
}

export const userService = {
  async invite(email: string, role: string): Promise<Invite> {
    return (await apiClient<Invite>("/users/invite", {
      method: "POST", body: JSON.stringify({ email, role }),
    })).data;
  },
  async validateInvite(token: string): Promise<Invite> {
    return (await apiClient<Invite>(`/users/validate-invite?token=${encodeURIComponent(token)}`, {
      authenticated: false,
    })).data;
  },
  async acceptInvite(data: { token: string; name: string; password: string; confirmPassword: string }): Promise<User> {
    return (await apiClient<User>("/users/accept-invite", {
      method: "POST", authenticated: false, body: JSON.stringify(data),
    })).data;
  },
  // TODO: Tambahkan endpoint terkait user (seperti update profile) jika backend sudah sedia

  async getProfile(): Promise<User> {
    const response = await apiClient<User>("/auth/me", { method: "GET" });
    return response.data;
  }
};
