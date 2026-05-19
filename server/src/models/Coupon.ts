import { Schema, model, models } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true },
    discountType: { type: String, enum: ["percentage", "fixed", "free_shipping"], required: true },
    value: { type: Number, required: true },
    minimumOrderValue: { type: Number, default: 0 },
    expiry: { type: Date },
    usageLimit: { type: Number, default: null }, // null means unlimited
    usageCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CouponModel = models.Coupon || model("Coupon", couponSchema);
