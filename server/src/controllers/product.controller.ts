import { type Request, type Response } from "express";
import mongoose from "mongoose";

import { ParsedQueryRequest } from "../middlewares/query-parser";
import { ProductModel } from "../models/Product";
import { success, failure } from "../utils/api-response";

export async function listProducts(req: ParsedQueryRequest, res: Response) {
  const { filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 10, page = 1 } = req.parsedQuery || {};
  const { q, minPrice, maxPrice } = req.query;

  // Add active status requirement by default for public endpoint
  const finalFilter: Record<string, any> = { ...filter, status: "published" };

  if (req.query.stock === "true") {
    finalFilter.stock = { $gt: 0 };
  }

  if (q) {
    finalFilter.name = { $regex: q as string, $options: "i" };
  }

  if (minPrice || maxPrice) {
    finalFilter.price = {};
    if (minPrice) finalFilter.price.$gte = Number(minPrice);
    if (maxPrice) finalFilter.price.$lte = Number(maxPrice);
  }

  const [products, total] = await Promise.all([
    ProductModel.find(finalFilter).populate("category brand").sort(sort).skip(skip).limit(limit),
    ProductModel.countDocuments(finalFilter)
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

export async function getProductBySlug(req: Request, res: Response) {
  const product = await ProductModel.findOne({ slug: req.params.slug, status: "published" }).populate("category brand");
  if (!product) return res.status(404).json(failure("Product not found"));
  return res.json(success(product));
}

export async function getProductById(req: Request, res: Response) {
  const id = String(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(failure("Invalid product ID"));
  }
  const product = await ProductModel.findById(id).populate("category brand");
  if (!product) return res.status(404).json(failure("Product not found"));
  return res.json(success(product));
}
