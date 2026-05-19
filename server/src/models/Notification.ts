import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    readAt: Date
  },
  { timestamps: true }
);

export const NotificationModel = models.Notification || model("Notification", notificationSchema);
