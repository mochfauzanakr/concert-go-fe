import { apiClient } from "./api-client";

export const eventService = {
  // TODO: Implement endpoints ketika backend event sudah siap
  async getEvents() {
    return apiClient("/events", { method: "GET" });
  },
  
  async getEventById(id: string) {
    return apiClient(`/events/${id}`, { method: "GET" });
  }
};
