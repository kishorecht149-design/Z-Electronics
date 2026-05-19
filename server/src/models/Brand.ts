import { Schema, model, models } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export const BrandModel = models.Brand || model("Brand", brandSchema);
