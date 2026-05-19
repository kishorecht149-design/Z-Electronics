import { Router } from "express";

import {
  createBrand,
  createCategory,
  createCoupon,
  createProduct,
  deleteProduct,
  getAdminDashboard,
  listAdminProducts,
  listCategories,
  listCoupons,
  updateProduct
} from "../controllers/admin.controller";
import { requireAdmin, requireAuth } from "../middlewares/auth";
import { parseQuery } from "../middlewares/query-parser";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);
adminRouter.get("/dashboard", getAdminDashboard);
adminRouter.post("/brands", createBrand);
adminRouter.get("/products", parseQuery, listAdminProducts);
adminRouter.post("/products", createProduct);
adminRouter.patch("/products/:id", updateProduct);
adminRouter.delete("/products/:id", deleteProduct);
adminRouter.get("/categories", parseQuery, listCategories);
adminRouter.post("/categories", createCategory);
adminRouter.get("/coupons", parseQuery, listCoupons);
adminRouter.post("/coupons", createCoupon);
