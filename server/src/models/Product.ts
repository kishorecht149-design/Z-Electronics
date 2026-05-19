import { Schema, model, models } from "mongoose";

const specificationSchema = new Schema(
  {
    label: String,
    value: String
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    tags: [String],
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    images: [String],
    datasheetUrl: String,
    specifications: [specificationSchema]
  },
  { timestamps: true }
);

export const ProductModel = models.Product || model("Product", productSchema);
