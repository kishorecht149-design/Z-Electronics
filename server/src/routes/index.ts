import { Router } from "express";

import { adminRouter } from "./admin.routes";
import { authRouter } from "./auth.routes";
import { orderRouter } from "./order.routes";
import { productRouter } from "./product.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.get("/health", (_req, res) =>
  res.json({
    success: true,
    app: "z-electronics-api",
    timestamp: new Date().toISOString()
  })
);
