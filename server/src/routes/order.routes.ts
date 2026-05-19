import { Router } from "express";
import express from "express";

import {
  getOrder,
  initiateOrder,
  listMyOrders,
  razorpayWebhook,
  trackOrder,
  validateCoupon,
  verifyPayment
} from "../controllers/order.controller";
import { requireAuth } from "../middlewares/auth";

export const orderRouter = Router();

// Webhook must use raw body — register before json middleware applies
orderRouter.post(
  "/webhook/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

// Authenticated routes
orderRouter.use(requireAuth);
orderRouter.post("/validate-coupon", validateCoupon);
orderRouter.post("/", initiateOrder);
orderRouter.post("/verify-payment", verifyPayment);
orderRouter.get("/", listMyOrders);
orderRouter.get("/:id", getOrder);
orderRouter.get("/track/:id", trackOrder);
