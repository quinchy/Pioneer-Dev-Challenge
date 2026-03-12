import type { Request, Response, NextFunction } from "express";
import { env } from "../validation/env";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const code = req.query.code as string;

  if (code !== env.API_CODE) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: {
        code: "UNAUTHORIZED",
        detail: "Invalid API code.",
      },
    });
  }

  next();
}