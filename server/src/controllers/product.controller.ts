import { type Request, type Response } from "express";

import { ProductModel } from "../models/Product";
import { success } from "../utils/api-response";

export async function listProducts(req: Request, res: Response) {
  const { category, brand, q } = req.query;
  const filters: Record<string, unknown> = {};

  if (category) filters.category = category;
  if (brand) filters.brand = brand;
  if (q) filters.name = { $regex: q, $options: "i" };

  const products = await ProductModel.find(filters).populate("category brand").sort({ createdAt: -1 });
  return res.json(success(products));
}

export async function getProductBySlug(req: Request, res: Response) {
  const product = await ProductModel.findOne({ slug: req.params.slug }).populate("category brand");
  return res.json(success(product));
}
