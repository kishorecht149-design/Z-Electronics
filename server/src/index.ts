import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";

import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error-handler";
import { apiRouter } from "./routes";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150
  })
);

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
