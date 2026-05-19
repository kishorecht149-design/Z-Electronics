import Razorpay from "razorpay";
import crypto from "crypto";

import { env } from "../config/env";

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: env.RAZORPAY_KEY_SECRET || "placeholder_secret"
});

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = env.RAZORPAY_KEY_SECRET || "";
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expectedSignature === signature;
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = env.RAZORPAY_WEBHOOK_SECRET || "";
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}
