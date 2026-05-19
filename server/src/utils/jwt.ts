import jwt from "jsonwebtoken";

import { env } from "../config/env";

export function signToken(payload: { userId: string; role: string }) {
  return jwt.sign({ userId: payload.userId, _id: payload.userId, role: payload.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as any;
}
