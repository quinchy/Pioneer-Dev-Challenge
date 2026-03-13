import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { sendResponse } from "../utils/send-response";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return sendResponse(
      res,
      err.statusCode,
      false,
      err.message,
      {
        error: {
          code: err.code,
          detail: err.detail,
        },
      },
    );
  }

  console.error("Unexpected error:", err);

  return sendResponse(
    res,
    500,
    false,
    "An unexpected error occurred.",
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        detail: err instanceof Error ? err.message : undefined,
      },
    },
  );
}