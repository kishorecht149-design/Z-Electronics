import { ProductModel } from "../models/Product";

export async function getRecommendedProducts(tags: string[]) {
  return ProductModel.find({
    tags: { $in: tags }
  })
    .sort({ bestSeller: -1, featured: -1, createdAt: -1 })
    .limit(6);
}
