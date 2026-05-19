export const apiRoutes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register"
  },
  products: "/products",
  orders: "/orders",
  adminDashboard: "/admin/dashboard"
} as const;
