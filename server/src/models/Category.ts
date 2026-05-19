import { Schema, model, models } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }
  },
  { timestamps: true }
);

export const CategoryModel = models.Category || model("Category", categorySchema);
