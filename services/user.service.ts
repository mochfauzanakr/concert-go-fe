import { apiClient } from "./api-client";
import type { User, UserDetail, UserListItem, Role } from "../types/user.types";

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
  async updateProfile(name: string, avatar?: File): Promise<UserDetail> {
    let body: string | FormData = JSON.stringify({ name });
    if (avatar) {
      body = new FormData();
      body.set("name", name);
      body.set("avatar", avatar);
    }
    return (await apiClient<UserDetail>("/users/me", { method: "PUT", body })).data;
  },
  async roles(signal?: AbortSignal): Promise<Role[]> {
    return (await apiClient<Role[]>("/roles", { authenticated: false, signal })).data;
  },
  async list(filters: { page: number; pageSize: number; search?: string; roleId?: number; status?: string }, signal?: AbortSignal) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== "") query.set(key, String(value));
    }
    return apiClient<UserListItem[]>(`/users?${query}`, { signal });
  },
  async detail(id: string, signal?: AbortSignal): Promise<UserDetail> {
    return (await apiClient<UserDetail>(`/users/${encodeURIComponent(id)}`, { signal })).data;
  },
  async update(id: string, data: { name: string; roleId: number }): Promise<UserDetail> {
    return (await apiClient<UserDetail>(`/users/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) })).data;
  },
  async setStatus(id: string, status: "ACTIVE" | "SUSPENDED"): Promise<UserDetail> {
    return (await apiClient<UserDetail>(`/users/${encodeURIComponent(id)}/status`, { method: "PATCH", body: JSON.stringify({ status }) })).data;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient<User>("/auth/me", { method: "GET" });
    return response.data;
  }
};
