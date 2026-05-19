import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";

import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error-handler";
import { apiRouter } from "./routes";

const app = express();

function healthPayload() {
  return {
    success: true,
    app: "z-electronics-api",
    timestamp: new Date().toISOString()
  };
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS" || ["/", "/api/health", "/health"].includes(req.path)
});

app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.get("/", (_req, res) => res.json(healthPayload()));
app.get("/health", (_req, res) => res.json(healthPayload()));
app.use(apiLimiter);

app.use("/api", apiRouter);
app.use(errorHandler);

async function bootstrap() {
  await connectDatabase();
  const port = Number(env.PORT ?? 8080);
  app.listen(port, "0.0.0.0", () => {
    console.log(`Z Electronics API running on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
