import { type Request, type Response } from "express";

import { BrandModel } from "../models/Brand";
import { CategoryModel } from "../models/Category";
import { CouponModel } from "../models/Coupon";
import { OrderModel } from "../models/Order";
import { ProductModel } from "../models/Product";
import { UserModel } from "../models/User";
import { success } from "../utils/api-response";

export async function getAdminDashboard(_req: Request, res: Response) {
  const [users, products, orders, coupons] = await Promise.all([
    UserModel.countDocuments(),
    ProductModel.countDocuments(),
    OrderModel.countDocuments(),
    CouponModel.countDocuments()
  ]);

  return res.json(
    success({
      totals: { users, products, orders, coupons },
      revenue: [2.1, 2.4, 2.8, 3.2, 3.1, 4.0, 4.6],
      channelMix: [
        { label: "Direct", value: 38 },
        { label: "WhatsApp", value: 22 },
        { label: "Search", value: 28 },
        { label: "Referral", value: 12 }
      ]
    })
  );
}

export async function createBrand(req: Request, res: Response) {
  const brand = await BrandModel.create(req.body);
  return res.status(201).json(success(brand, "Brand created"));
}

export async function listAdminProducts(_req: Request, res: Response) {
  const products = await ProductModel.find().populate("category brand").sort({ createdAt: -1 });
  return res.json(success(products));
}

export async function createProduct(req: Request, res: Response) {
  const product = await ProductModel.create(req.body);
  return res.status(201).json(success(product, "Product created"));
}

export async function updateProduct(req: Request, res: Response) {
  const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return res.json(success(product, "Product updated"));
}

export async function listCategories(_req: Request, res: Response) {
  const categories = await CategoryModel.find().sort({ createdAt: -1 });
  return res.json(success(categories));
}

export async function createCategory(req: Request, res: Response) {
  const category = await CategoryModel.create(req.body);
  return res.status(201).json(success(category, "Category created"));
}

export async function listCoupons(_req: Request, res: Response) {
  const coupons = await CouponModel.find().sort({ createdAt: -1 });
  return res.json(success(coupons));
}

export async function createCoupon(req: Request, res: Response) {
  const coupon = await CouponModel.create(req.body);
  return res.status(201).json(success(coupon, "Coupon created"));
}
