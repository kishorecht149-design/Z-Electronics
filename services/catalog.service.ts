import { apiClient } from "./api-client";

export const catalogService = {
  getCategories: async () => {
    const response = await apiClient.get("/catalog/categories");
    return response.data;
  },

  getBrands: async () => {
    const response = await apiClient.get("/catalog/brands");
    return response.data;
  }
};
