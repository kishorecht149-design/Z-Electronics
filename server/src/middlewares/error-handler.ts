import { type NextFunction, type Request, type Response } from "express";

import { failure } from "../utils/api-response";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);
  return res.status(500).json(failure(error.message || "Internal server error"));
}
