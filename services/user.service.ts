import { apiClient } from "./api-client";

export const userService = {
  getState: async () => {
    const response = await apiClient.get("/users/state");
    return response.data;
  },

  syncState: async (data: { cart?: any[]; wishlist?: string[] }) => {
    const response = await apiClient.put("/users/state", data);
    return response.data;
  }
};
