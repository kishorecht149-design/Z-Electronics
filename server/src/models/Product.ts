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
    sku: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    stock: { type: Number, default: 0, min: 0 },
    images: [String],
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    specifications: [specificationSchema],
    datasheetUrl: String,
    tags: [String],
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    seoMetadata: {
      title: String,
      description: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

// Indexes for faster querying
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });

export const ProductModel = models.Product || model("Product", productSchema);
