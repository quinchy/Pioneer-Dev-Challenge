import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        error: {
          code: "VALIDATION_ERROR",
          detail: "Query validation failed.",
        },
        errors: result.error.issues,
      });
    }

    req.validatedQuery = result.data as Record<string, unknown>;
    next();
  };
}

// Extend Express Request type to include validated query
declare global {
  namespace Express {
    interface Request {
      validatedQuery?: Record<string, unknown>;
    }
  }
}