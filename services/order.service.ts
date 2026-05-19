import { apiClient } from "./api-client";

export const orderService = {
  validateCoupon: async (code: string, subtotal: number) => {
    const response = await apiClient.post("/orders/validate-coupon", { code, subtotal });
    return response.data;
  },

  initiateOrder: async (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: {
      fullName: string;
      phone: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country?: string;
    };
    couponCode?: string;
    paymentMethod: "Razorpay" | "UPI";
  }) => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }) => {
    const response = await apiClient.post("/orders/verify-payment", data);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await apiClient.get("/orders");
    return response.data;
  },

  getOrder: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  }
};
