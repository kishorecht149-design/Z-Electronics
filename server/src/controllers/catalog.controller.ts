import { type Request, type Response } from "express";

import { BrandModel } from "../models/Brand";
import { CategoryModel } from "../models/Category";
import { ProductModel } from "../models/Product";
import { success } from "../utils/api-response";

export async function listPublicCategories(_req: Request, res: Response) {
  const [categories, counts] = await Promise.all([
    CategoryModel.find().sort({ name: 1 }),
    ProductModel.aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ])
  ]);

  const countMap = new Map(counts.map((entry: any) => [String(entry._id), entry.count]));
  const data = categories.map((category) => ({
    ...category.toObject(),
    productCount: countMap.get(String(category._id)) ?? 0
  }));

  return res.json(success(data));
}

export async function listPublicBrands(_req: Request, res: Response) {
  const brands = await BrandModel.find().sort({ name: 1 });
  return res.json(success(brands));
}
