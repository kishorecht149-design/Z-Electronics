import { Schema, model, models } from "mongoose";

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: { type: String }
  },
  { _id: false }
);

const timelineSchema = new Schema(
  {
    status: String,
    message: String,
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    
    // Pricing Breakdown
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    discountAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    // Statuses
    status: { 
      type: String, 
      enum: ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Refunded"], 
      default: "Pending" 
    },
    
    // Payments
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    paymentMethod: { type: String, enum: ["Stripe", "Razorpay", "UPI"], required: true },
    transactionId: { type: String },

    // Shipping
    shippingAddress: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    trackingNumber: { type: String },
    deliveryPartner: { type: String },
    eta: { type: Date },
    
    timeline: [timelineSchema]
  },
  { timestamps: true }
);

orderSchema.index({ user: 1 });
orderSchema.index({ number: 1 });
orderSchema.index({ status: 1 });

export const OrderModel = models.Order || model("Order", orderSchema);
