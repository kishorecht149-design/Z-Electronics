import { type Request, type Response } from "express";

import { ParsedQueryRequest } from "../middlewares/query-parser";
import { ProductModel } from "../models/Product";
import { success } from "../utils/api-response";

export async function listProducts(req: ParsedQueryRequest, res: Response) {
  const { filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 10, page = 1 } = req.parsedQuery || {};
  const { q } = req.query;

  // Add active status requirement by default for public endpoint
  const finalFilter: Record<string, any> = { ...filter, status: "published" };

  if (q) {
    finalFilter.name = { $regex: q as string, $options: "i" };
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
  return res.json(success(product));
}
