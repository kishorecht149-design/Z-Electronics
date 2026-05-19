import { type Request, type Response } from "express";

import { BrandModel } from "../models/Brand";
import { CategoryModel } from "../models/Category";
import { CouponModel } from "../models/Coupon";
import { OrderModel } from "../models/Order";
import { ProductModel } from "../models/Product";
import { UserModel } from "../models/User";
import { ParsedQueryRequest } from "../middlewares/query-parser";
import { success, failure } from "../utils/api-response";
import { uploadImage as uploadToCloudinary } from "../utils/cloudinary";

export async function uploadImageAdmin(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json(failure("No image provided"));
  }
  
  try {
    const url = await uploadToCloudinary(req.file.buffer);
    return res.json(success({ url }, "Image uploaded successfully"));
  } catch (error: any) {
    return res.status(500).json(failure(error.message || "Upload failed"));
  }
}

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

export async function listAdminProducts(req: ParsedQueryRequest, res: Response) {
  const { filter, sort, skip, limit, page } = req.parsedQuery || { filter: {}, sort: { createdAt: -1 }, skip: 0, limit: 10, page: 1 };
  
  const [products, total] = await Promise.all([
    ProductModel.find(filter).populate("category brand").sort(sort).skip(skip).limit(limit),
    ProductModel.countDocuments(filter)
  ]);
  
  return res.json({
    success: true,
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
}

export async function createProduct(req: Request, res: Response) {
  // Simple auto-generation of slug if not provided
  if (!req.body.slug && req.body.name) {
    req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  }
  
  const product = await ProductModel.create(req.body);
  return res.status(201).json(success(product, "Product created"));
}

export async function updateProduct(req: Request, res: Response) {
  const product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json(failure("Product not found"));
  return res.json(success(product, "Product updated"));
}

export async function deleteProduct(req: Request, res: Response) {
  const product = await ProductModel.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json(failure("Product not found"));
  return res.json(success(null, "Product deleted"));
}

export async function listCategories(req: ParsedQueryRequest, res: Response) {
  const { filter, sort } = req.parsedQuery || { filter: {}, sort: { createdAt: -1 } };
  const categories = await CategoryModel.find(filter).sort(sort);
  return res.json(success(categories));
}

export async function createCategory(req: Request, res: Response) {
  const category = await CategoryModel.create(req.body);
  return res.status(201).json(success(category, "Category created"));
}

export async function listCoupons(req: ParsedQueryRequest, res: Response) {
  const { filter, sort } = req.parsedQuery || { filter: {}, sort: { createdAt: -1 } };
  const coupons = await CouponModel.find(filter).sort(sort);
  return res.json(success(coupons));
}

export async function createCoupon(req: Request, res: Response) {
  const coupon = await CouponModel.create(req.body);
  return res.status(201).json(success(coupon, "Coupon created"));
}
