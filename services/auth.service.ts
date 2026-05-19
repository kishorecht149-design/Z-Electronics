import { apiClient } from "./api-client";

export const authService = {
  login: async (credentials: any) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (data: any) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  }
};
