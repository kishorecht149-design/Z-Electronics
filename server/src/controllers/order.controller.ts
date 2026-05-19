import { type Request, type Response } from "express";
import { z } from "zod";

import { type AuthenticatedRequest } from "../middlewares/auth";
import { AddressModel } from "../models/Address";
import { CouponModel } from "../models/Coupon";
import { OrderModel } from "../models/Order";
import { ProductModel } from "../models/Product";
import { success, failure } from "../utils/api-response";
import { razorpay, verifyRazorpaySignature, verifyWebhookSignature } from "../utils/razorpay";

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ZE-${ts}-${rand}`;
}

// ── Coupon Validation ─────────────────────────────────────────────────────────

const validateCouponSchema = z.object({ code: z.string(), subtotal: z.number() });

export async function validateCoupon(req: Request, res: Response) {
  const { code, subtotal } = validateCouponSchema.parse(req.body);

  const coupon = await CouponModel.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return res.status(404).json(failure("Coupon not found or expired"));
  if (coupon.expiry && coupon.expiry < new Date()) return res.status(400).json(failure("Coupon has expired"));
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit)
    return res.status(400).json(failure("Coupon usage limit reached"));
  if (subtotal < coupon.minimumOrderValue)
    return res.status(400).json(failure(`Minimum order value ₹${coupon.minimumOrderValue} required`));

  let discountAmount = 0;
  if (coupon.discountType === "percentage") discountAmount = (subtotal * coupon.value) / 100;
  else if (coupon.discountType === "fixed") discountAmount = coupon.value;
  else if (coupon.discountType === "free_shipping") discountAmount = 0; // handled on frontend

  return res.json(success({ coupon, discountAmount }, "Coupon applied"));
}

// ── Create Razorpay Order (initiate payment) ──────────────────────────────────

const createOrderSchema = z.object({
  items: z.array(z.object({ productId: z.string(), quantity: z.number().min(1) })),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string().default("India")
  }),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["Razorpay", "UPI"])
});

export async function initiateOrder(req: AuthenticatedRequest, res: Response) {
  const input = createOrderSchema.parse(req.body);
  const userId = req.user!.userId;

  // 1. Validate products & compute subtotal
  const productIds = input.items.map((i) => i.productId);
  const products = await ProductModel.find({ _id: { $in: productIds } });

  if (products.length !== input.items.length)
    return res.status(400).json(failure("One or more products not found"));

  let subtotal = 0;
  const orderItems: any[] = [];

  for (const item of input.items) {
    const product = products.find((p) => p._id.toString() === item.productId);
    if (!product) return res.status(400).json(failure(`Product ${item.productId} not found`));
    if (product.stock < item.quantity)
      return res.status(400).json(failure(`Insufficient stock for ${product.name}`));

    subtotal += product.price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      quantity: item.quantity,
      price: product.price,
      image: product.images?.[0] || ""
    });
  }

  // 2. Coupon discount
  let discountAmount = 0;
  let couponDoc: any = null;
  if (input.couponCode) {
    couponDoc = await CouponModel.findOne({ code: input.couponCode.toUpperCase(), isActive: true });
    if (couponDoc) {
      if (couponDoc.discountType === "percentage") discountAmount = (subtotal * couponDoc.value) / 100;
      else if (couponDoc.discountType === "fixed") discountAmount = couponDoc.value;
    }
  }

  // 3. Shipping fee logic (free above ₹999)
  const shippingFee = subtotal >= 999 ? 0 : 49;

  // 4. GST 18%
  const tax = Math.round((subtotal - discountAmount) * 0.18);
  const total = Math.round(subtotal - discountAmount + shippingFee + tax);

  // 5. Save address inline
  const address = await AddressModel.create({ user: userId, ...input.shippingAddress });

  // 6. Create Razorpay order
  const rzpOrder = await razorpay.orders.create({
    amount: total * 100, // paise
    currency: "INR",
    receipt: generateOrderNumber()
  });

  // 7. Create DB order (paymentStatus: pending)
  const order = await OrderModel.create({
    number: rzpOrder.receipt,
    user: userId,
    items: orderItems,
    subtotal,
    shippingFee,
    tax,
    coupon: couponDoc?._id,
    discountAmount,
    total,
    paymentMethod: input.paymentMethod,
    paymentStatus: "pending",
    shippingAddress: address._id,
    transactionId: rzpOrder.id,
    timeline: [{ status: "Pending", message: "Order initiated" }]
  });

  // 8. Deduct stock optimistically
  for (const item of input.items) {
    await ProductModel.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
  }

  return res.status(201).json(
    success({
      orderId: order._id,
      orderNumber: order.number,
      razorpayOrderId: rzpOrder.id,
      amount: total,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID
    }, "Order created")
  );
}

// ── Verify Payment & Confirm Order ───────────────────────────────────────────

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  orderId: z.string()
});

export async function verifyPayment(req: AuthenticatedRequest, res: Response) {
  const input = verifyPaymentSchema.parse(req.body);

  const isValid = verifyRazorpaySignature(
    input.razorpay_order_id,
    input.razorpay_payment_id,
    input.razorpay_signature
  );

  if (!isValid) return res.status(400).json(failure("Invalid payment signature"));

  const order = await OrderModel.findByIdAndUpdate(
    input.orderId,
    {
      paymentStatus: "paid",
      status: "Confirmed",
      $push: { timeline: { status: "Confirmed", message: "Payment received successfully" } }
    },
    { new: true }
  );

  if (!order) return res.status(404).json(failure("Order not found"));

  // Increment coupon usage
  if (order.coupon) {
    await CouponModel.findByIdAndUpdate(order.coupon, { $inc: { usageCount: 1 } });
  }

  return res.json(success({ orderNumber: order.number, orderId: order._id }, "Payment confirmed"));
}

// ── Razorpay Webhook (server-to-server) ──────────────────────────────────────

export async function razorpayWebhook(req: Request, res: Response) {
  const signature = req.headers["x-razorpay-signature"] as string;
  const body = JSON.stringify(req.body);

  if (!verifyWebhookSignature(body, signature)) {
    return res.status(400).json({ ok: false });
  }

  const event = req.body.event;
  const payment = req.body.payload?.payment?.entity;

  if (event === "payment.failed" && payment) {
    const order = await OrderModel.findOne({ transactionId: payment.order_id });
    if (order) {
      order.paymentStatus = "failed";
      order.status = "Cancelled";
      order.timeline.push({ status: "Cancelled", message: "Payment failed", date: new Date() } as any);
      await order.save();

      // Restore stock
      for (const item of order.items) {
        await ProductModel.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }
  }

  return res.json({ ok: true });
}

// ── List My Orders ────────────────────────────────────────────────────────────

export async function listMyOrders(req: AuthenticatedRequest, res: Response) {
  const orders = await OrderModel.find({ user: req.user?.userId })
    .populate("shippingAddress")
    .sort({ createdAt: -1 });
  return res.json(success(orders));
}

// ── Track Order ───────────────────────────────────────────────────────────────

export async function trackOrder(req: AuthenticatedRequest, res: Response) {
  const order = await OrderModel.findOne({
    $or: [
      { trackingNumber: req.params.id },
      { number: req.params.id }
    ],
    user: req.user?.userId
  }).populate("shippingAddress items.product");

  if (!order) return res.status(404).json(failure("Order not found"));
  return res.json(success(order));
}

// ── Get Single Order ──────────────────────────────────────────────────────────

export async function getOrder(req: AuthenticatedRequest, res: Response) {
  const order = await OrderModel.findOne({ _id: req.params.id, user: req.user?.userId })
    .populate("shippingAddress")
    .populate("items.product");
  if (!order) return res.status(404).json(failure("Order not found"));
  return res.json(success(order));
}
