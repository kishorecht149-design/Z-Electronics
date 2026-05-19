import { Schema, model, models } from "mongoose";

const addressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: { type: String, default: "India" },
    postalCode: String,
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const AddressModel = models.Address || model("Address", addressSchema);
