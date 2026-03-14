import type { Response, NextFunction } from "express";
import { z } from "zod";
import { sendResponse } from "../utils/send-response";
import type { ExecuteRequest } from "../types/execute";

export function validate(schema: z.ZodSchema) {
  return (req: ExecuteRequest, res: Response, next: NextFunction) => {
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

    next();
  };
}