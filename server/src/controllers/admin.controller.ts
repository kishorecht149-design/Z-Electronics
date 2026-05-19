import { type Request, type Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";

import { BrandModel } from "../models/Brand";
import { CategoryModel } from "../models/Category";
import { CouponModel } from "../models/Coupon";
import { OrderModel } from "../models/Order";
import { ProductModel } from "../models/Product";
import { UserModel } from "../models/User";
import { ParsedQueryRequest } from "../middlewares/query-parser";
import { success, failure } from "../utils/api-response";
import { uploadImage as uploadToCloudinary } from "../utils/cloudinary";

const brandSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional()
});

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional()
});

const couponSchema = z.object({
  code: z.string().min(2),
  title: z.string().min(2),
  discountType: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.number().min(0),
  minimumOrderValue: z.number().min(0).default(0),
  expiry: z.coerce.date().optional(),
  usageLimit: z.number().nullable().optional(),
  isActive: z.boolean().optional()
});

const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  stock: z.number().min(0).default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  category: z.string().min(1),
  brand: z.string().min(1),
  images: z.array(z.string().url()).min(1),
  datasheetUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  trending: z.boolean().optional(),
  specifications: z.array(z.object({ label: z.string(), value: z.string() })).optional()
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function resolveBrandId(input: string) {
  if (mongoose.Types.ObjectId.isValid(input)) return input;

  const slug = slugify(input);
  const existing = await BrandModel.findOne({
    $or: [{ name: new RegExp(`^${input}$`, "i") }, { slug }]
  });
  if (existing) return existing._id;

  const created = await BrandModel.create({
    name: input.trim(),
    slug,
    description: `${input.trim()} products`
  });
  return created._id;
}

async function resolveCategoryId(input: string) {
  if (mongoose.Types.ObjectId.isValid(input)) return input;

  const slug = slugify(input);
  const existing = await CategoryModel.findOne({
    $or: [{ name: new RegExp(`^${input}$`, "i") }, { slug }]
  });
  if (existing) return existing._id;

  const created = await CategoryModel.create({
    name: input.trim(),
    slug,
    description: `${input.trim()} products`,
    icon: "Cpu"
  });
  return created._id;
}

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
  const input = brandSchema.parse(req.body);
  const brand = await BrandModel.create({
    name: input.name.trim(),
    slug: input.slug?.trim() || slugify(input.name),
    description: input.description?.trim() || `${input.name.trim()} products`
  });
  return res.status(201).json(success(brand, "Brand created"));
}

export async function listBrands(req: ParsedQueryRequest, res: Response) {
  const { filter, sort } = req.parsedQuery || { filter: {}, sort: { createdAt: -1 } };
  const brands = await BrandModel.find(filter).sort(sort);
  return res.json(success(brands));
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
  const input = productSchema.parse(req.body);
  const category = await resolveCategoryId(input.category);
  const brand = await resolveBrandId(input.brand);

  const product = await ProductModel.create({
    ...input,
    slug: slugify(input.name),
    category,
    brand,
    datasheetUrl: input.datasheetUrl || undefined,
    tags: input.tags ?? [],
    specifications: input.specifications ?? []
  });

  const populated = await ProductModel.findById(product._id).populate("category brand");
  return res.status(201).json(success(populated, "Product created"));
}

export async function updateProduct(req: Request, res: Response) {
  const input = productSchema.partial().parse(req.body);
  const updateData: Record<string, unknown> = { ...input };

  if (input.name) updateData.slug = slugify(input.name);
  if (input.category) updateData.category = await resolveCategoryId(input.category);
  if (input.brand) updateData.brand = await resolveBrandId(input.brand);
  if (input.datasheetUrl === "") updateData.datasheetUrl = undefined;

  const product = await ProductModel.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  }).populate("category brand");
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
  const input = categorySchema.parse(req.body);
  const category = await CategoryModel.create({
    name: input.name.trim(),
    slug: input.slug?.trim() || slugify(input.name),
    description: input.description?.trim() || `${input.name.trim()} products`,
    icon: input.icon?.trim() || "Cpu"
  });
  return res.status(201).json(success(category, "Category created"));
}

export async function listCoupons(req: ParsedQueryRequest, res: Response) {
  const { filter, sort } = req.parsedQuery || { filter: {}, sort: { createdAt: -1 } };
  const coupons = await CouponModel.find(filter).sort(sort);
  return res.json(success(coupons));
}

export async function createCoupon(req: Request, res: Response) {
  const input = couponSchema.parse(req.body);
  const coupon = await CouponModel.create({
    ...input,
    code: input.code.trim().toUpperCase(),
    title: input.title.trim(),
    value: input.discountType === "free_shipping" ? 0 : input.value
  });
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

export async function listAdminUsers(req: ParsedQueryRequest, res: Response) {
  const { filter, sort, skip, limit, page } = req.parsedQuery || {
    filter: {},
    sort: { createdAt: -1 },
    skip: 0,
    limit: 20,
    page: 1
  };

  const [users, total] = await Promise.all([
    UserModel.find(filter).select("-password").sort(sort).skip(skip).limit(limit),
    UserModel.countDocuments(filter)
  ]);

  const activeCustomers = await UserModel.countDocuments({ role: "customer", isActive: true });
  const wholesaleAccounts = await UserModel.countDocuments({ role: "staff", isActive: true });
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const newThisMonth = await UserModel.countDocuments({ createdAt: { $gte: startOfMonth } });

  return res.json(
    success({
      users,
      stats: {
        activeCustomers,
        wholesaleAccounts,
        newThisMonth
      },
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  );
}
