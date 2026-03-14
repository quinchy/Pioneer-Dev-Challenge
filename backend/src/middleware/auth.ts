import type { Request, Response, NextFunction } from "express";
import { env } from "../validation/env";
import { sendResponse } from "../utils/send-response";

export function auth(req: Request, res: Response, next: NextFunction) {
  const code = req.query.code;

  if (code !== env.API_CODE) {
    return sendResponse(
      res,
      401,
      false,
      "Unauthorized",
      {
        error: {
          code: "UNAUTHORIZED",
          detail: "Invalid API code.",
        },
      },
    );
  }

  next();
}