import { apiClient } from "./api-client";

// Admin API endpoints (requires auth token)
export const adminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
  },

  // Products
  getProducts: async (params?: Record<string, any>) => {
    const response = await apiClient.get("/admin/products", { params });
    return response.data;
  },
  
  createProduct: async (data: any) => {
    const response = await apiClient.post("/admin/products", data);
    return response.data;
  },

  updateProduct: async (id: string, data: any) => {
    const response = await apiClient.patch(`/admin/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await apiClient.post("/admin/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await apiClient.get("/admin/categories");
    return response.data;
  },

  // Brands
  getBrands: async () => {
    const response = await apiClient.get("/admin/brands");
    return response.data;
  },

  // Orders
  getOrders: async (params?: Record<string, any>) => {
    const response = await apiClient.get("/admin/orders", { params });
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Coupons
  getCoupons: async () => {
    const response = await apiClient.get("/admin/coupons");
    return response.data;
  },

  createCoupon: async (data: any) => {
    const response = await apiClient.post("/admin/coupons", data);
    return response.data;
  }
};
