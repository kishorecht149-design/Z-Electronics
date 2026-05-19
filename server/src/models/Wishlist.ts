import { Schema, model, models } from "mongoose";

const wishlistSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }]
  },
  { timestamps: true }
);

export const WishlistModel = models.Wishlist || model("Wishlist", wishlistSchema);
