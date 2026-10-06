import { apiClient } from "./api-client";
import { User } from "../types/user.types";

export const userService = {
  // TODO: Tambahkan endpoint terkait user (seperti update profile) jika backend sudah sedia
  
  async getProfile(): Promise<User> {
    const response = await apiClient<User>("/auth/me", { method: "GET" });
    return response.data;
  }
};
