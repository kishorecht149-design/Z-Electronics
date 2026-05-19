import { Router } from "express";

import { listMyOrders, trackOrder } from "../controllers/order.controller";
import { requireAuth } from "../middlewares/auth";

export const orderRouter = Router();

orderRouter.get("/", requireAuth, listMyOrders);
orderRouter.get("/track/:trackingNumber", requireAuth, trackOrder);
