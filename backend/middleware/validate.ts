import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendResponse } from "../utils/send-response";

export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return sendResponse(
        res,
        400,
        false,
        "Invalid query parameters",
        {
          error: {
            code: "VALIDATION_ERROR",
            detail: "Query validation failed.",
          },
        },
      );
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