import { type Response } from "express";

import { type AuthenticatedRequest } from "../middlewares/auth";
import { OrderModel } from "../models/Order";
import { success } from "../utils/api-response";

export async function listMyOrders(req: AuthenticatedRequest, res: Response) {
  const orders = await OrderModel.find({ user: req.user?.userId }).sort({ createdAt: -1 });
  return res.json(success(orders));
}

export async function trackOrder(req: AuthenticatedRequest, res: Response) {
  const order = await OrderModel.findOne({ trackingNumber: req.params.trackingNumber, user: req.user?.userId });
  return res.json(success(order));
}
