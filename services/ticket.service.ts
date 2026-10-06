import { apiClient } from "./api-client";

export const ticketService = {
  // TODO: Implement endpoints ketika backend tiket sudah siap
  async getMyTickets() {
    return apiClient("/tickets/me", { method: "GET" });
  },
  
  async purchaseTicket(eventId: string, quantity: number) {
    return apiClient("/tickets/purchase", {
      method: "POST",
      body: JSON.stringify({ eventId, quantity })
    });
  }
};
