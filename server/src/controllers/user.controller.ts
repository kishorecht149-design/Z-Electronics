import { type Request, type Response } from "express";

import { UserModel } from "../models/User";
import { success, failure } from "../utils/api-response";

export async function syncState(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user._id;
  const { cart, wishlist } = req.body;

  try {
    const updateData: any = {};
    if (cart !== undefined) updateData.cart = cart;
    if (wishlist !== undefined) updateData.wishlist = wishlist;

    const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true })
      .populate("cart.productId")
      .populate("wishlist");

    if (!user) return res.status(404).json(failure("User not found"));
    
    return res.json(success({ cart: user.cart, wishlist: user.wishlist }, "State synced"));
  } catch (error: any) {
    return res.status(500).json(failure(error.message));
  }
}

export async function getState(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user._id;

  try {
    const user = await UserModel.findById(userId)
      .populate("cart.productId")
      .populate("wishlist");

    if (!user) return res.status(404).json(failure("User not found"));
    
    return res.json(success({ cart: user.cart, wishlist: user.wishlist }));
  } catch (error: any) {
    return res.status(500).json(failure(error.message));
  }
}
