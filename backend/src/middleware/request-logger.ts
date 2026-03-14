import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  let logged = false;

  const logRequest = (event: "finish" | "close") => {
    if (logged) return;
    logged = true;

    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    const payload = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${durationMs.toFixed(2)}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      event,
    };

    if (res.statusCode >= 500) {
      logger.error("Request processed", payload);
      return;
    }

    if (res.statusCode >= 400) {
      logger.warn("Request processed", payload);
      return;
    }

    logger.info("Request processed", payload);
  };

  res.on("finish", () => logRequest("finish"));
  res.on("close", () => logRequest("close"));

  next();
}
