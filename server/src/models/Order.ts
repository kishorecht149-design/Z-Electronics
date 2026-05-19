import { Schema, model, models } from "mongoose";

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    quantity: Number,
    price: Number
  },
  { _id: false }
);

const timelineSchema = new Schema(
  {
    status: String,
    label: String,
    date: String,
    done: Boolean,
    current: Boolean
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ["processing", "shipped", "delivered"], default: "processing" },
    paymentStatus: { type: String, enum: ["paid", "pending"], default: "pending" },
    trackingNumber: { type: String, required: true },
    deliveryPartner: { type: String, required: true },
    eta: { type: String, required: true },
    items: [orderItemSchema],
    timeline: [timelineSchema]
  },
  { timestamps: true }
);

export const OrderModel = models.Order || model("Order", orderSchema);
