import { type NextFunction, type Request, type Response } from "express";

import { failure } from "../utils/api-response";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    _id: string;
    role: "customer" | "staff" | "admin";
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.replace("Bearer ", "") : null;

  if (!token) {
    return res.status(401).json(failure("Authorization token missing"));
  }

  try {
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId || decoded._id,
      _id: decoded.userId || decoded._id,
      role: decoded.role
    };
    next();
  } catch (err: any) {
    console.error("JWT Verification failed:", err.message);
    return res.status(401).json(failure("Invalid or expired token"));
  }
}

export function requireRole(roles: ("customer" | "staff" | "admin")[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json(failure("Insufficient permissions"));
    }
    next();
  };
}

export const requireAdmin = requireRole(["admin"]);
export const requireStaff = requireRole(["admin", "staff"]);
