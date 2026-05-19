import { Router } from "express";

import {
  createBrand,
  createCategory,
  createCoupon,
  createProduct,
  getAdminDashboard,
  listAdminProducts,
  listCategories,
  listCoupons,
  updateProduct
} from "../controllers/admin.controller";
import { requireAdmin, requireAuth } from "../middlewares/auth";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);
adminRouter.get("/dashboard", getAdminDashboard);
adminRouter.post("/brands", createBrand);
adminRouter.get("/products", listAdminProducts);
adminRouter.post("/products", createProduct);
adminRouter.patch("/products/:id", updateProduct);
adminRouter.get("/categories", listCategories);
adminRouter.post("/categories", createCategory);
adminRouter.get("/coupons", listCoupons);
adminRouter.post("/coupons", createCoupon);
