import { type NextFunction, type Request, type Response } from "express";
import { ZodError } from "zod";

import { failure } from "../utils/api-response";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);
  if (error instanceof ZodError) {
    return res.status(400).json(
      failure(
        error.issues[0]?.message || "Invalid request data",
        error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      )
    );
  }

  if ((error as any)?.code === 11000) {
    const duplicateField = Object.keys((error as any)?.keyPattern ?? {})[0] ?? "record";
    return res.status(409).json(failure(`${duplicateField} already exists`));
  }

  if ((error as any)?.name === "ValidationError") {
    return res.status(400).json(failure(error.message || "Validation failed"));
  }

  return res.status(500).json(failure(error.message || "Internal server error"));
}
