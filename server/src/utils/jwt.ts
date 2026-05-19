import jwt from "jsonwebtoken";

import { env } from "../config/env";

export function signToken(payload: { userId: string; role: "user" | "admin" }) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string; role: "user" | "admin" };
}
