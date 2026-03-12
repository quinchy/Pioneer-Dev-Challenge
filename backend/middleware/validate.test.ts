import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validate } from "./validate";

describe("validate middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const testSchema = z.object({
    name: z.string().min(1),
  });

  beforeEach(() => {
    mockReq = { query: { name: "John" } };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  it("should call next() with valid data", () => {
    const middleware = validate(testSchema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect((mockReq as any).validatedQuery).toEqual({ name: "John" });
  });

  it("should return 400 with invalid data", () => {
    mockReq.query = { name: "" };
    const middleware = validate(testSchema);

    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Invalid query parameters",
        errors: expect.any(Array),
      }),
    );
    expect(mockNext).not.toHaveBeenCalled();
  });
});