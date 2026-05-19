import { type NextFunction, type Request, type Response } from "express";

import { failure } from "../utils/api-response";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: "user" | "admin";
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.replace("Bearer ", "") : null;

  if (!token) {
    return res.status(401).json(failure("Authorization token missing"));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json(failure("Invalid or expired token"));
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json(failure("Admin access required"));
  }
  next();
}
