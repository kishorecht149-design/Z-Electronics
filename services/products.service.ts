import { apiClient } from "./api-client";

export const productsService = {
  getProducts: async (params?: Record<string, any>) => {
    const response = await apiClient.get("/products", { params });
    return response.data;
  },
  
  getProductBySlug: async (slug: string) => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data;
  }
};
