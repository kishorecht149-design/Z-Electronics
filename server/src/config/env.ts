import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("7d"),
  PORT: z.string().optional()
});

export const env = envSchema.parse(process.env);
