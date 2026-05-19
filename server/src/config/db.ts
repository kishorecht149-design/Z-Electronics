import mongoose from "mongoose";

import { env } from "./env";

let cached = false;

export async function connectDatabase() {
  if (cached) return mongoose.connection;
  await mongoose.connect(env.MONGODB_URI);
  cached = true;
  return mongoose.connection;
}
