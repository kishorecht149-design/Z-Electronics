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
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalCoupons,
    monthRevenue,
    lastMonthRevenue,
    revenueSeries,
    categoryMix,
    orderStatusMix
  ] = await Promise.all([
    UserModel.countDocuments(),
    ProductModel.countDocuments(),
    OrderModel.countDocuments(),
    CouponModel.countDocuments(),

    // This month paid revenue
    OrderModel.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]),

    // Last month paid revenue
    OrderModel.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]),

    // Monthly revenue for this year (last 12 months)
    OrderModel.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: startOfYear } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]),

    // Top categories by order items
    OrderModel.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDoc"
        }
      },
      { $unwind: { path: "$productDoc", preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: "categories",
          localField: "productDoc.category",
          foreignField: "_id",
          as: "categoryDoc"
        }
      },
      { $unwind: { path: "$categoryDoc", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: "$categoryDoc.name",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          count: { $sum: "$items.quantity" }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 6 }
    ]),

    // Order status distribution
    OrderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
  ]);

  const thisMonthRev = monthRevenue[0]?.total ?? 0;
  const lastMonthRev = lastMonthRevenue[0]?.total ?? 0;
  const revenueGrowth = lastMonthRev > 0
    ? (((thisMonthRev - lastMonthRev) / lastMonthRev) * 100).toFixed(1)
    : "0.0";

  // Fill 12-month series (Jan–Dec), defaulting to 0 for missing months
  const monthMap = Object.fromEntries(revenueSeries.map((r: any) => [r._id.month, r.revenue]));
  const revenueChart = Array.from({ length: 12 }, (_, i) => monthMap[i + 1] ?? 0);

  const totalRevenue = revenueChart.reduce((a, b) => a + b, 0);
  const paidOrders = await OrderModel.countDocuments({ paymentStatus: "paid" });
  const aov = paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0;

  return res.json(
    success({
      totals: { users: totalUsers, products: totalProducts, orders: totalOrders, coupons: totalCoupons },
      thisMonthRevenue: thisMonthRev,
      revenueGrowth: `+${revenueGrowth}%`,
      aov,
      revenueChart,
      categoryMix: categoryMix.map((c: any) => ({ label: c._id || "Other", value: c.revenue, count: c.count })),
      orderStatusMix: orderStatusMix.map((s: any) => ({ label: s._id, count: s.count }))
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

export async function listAdminOrders(req: ParsedQueryRequest, res: Response) {
  const { filter, sort, skip, limit, page } = req.parsedQuery || { filter: {}, sort: { createdAt: -1 }, skip: 0, limit: 20, page: 1 };

  const [orders, total] = await Promise.all([
    OrderModel.find(filter).populate("user shippingAddress").sort(sort).skip(skip).limit(limit),
    OrderModel.countDocuments(filter)
  ]);

  return res.json({ success: true, data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}

export async function updateOrderStatus(req: Request, res: Response) {
  const { status } = req.body;
  const order = await OrderModel.findByIdAndUpdate(
    req.params.id,
    {
      status,
      $push: { timeline: { status, message: `Status updated to ${status}`, date: new Date() } }
    },
    { new: true }
  );
  if (!order) return res.status(404).json(failure("Order not found"));
  return res.json(success(order, "Order status updated"));
}
