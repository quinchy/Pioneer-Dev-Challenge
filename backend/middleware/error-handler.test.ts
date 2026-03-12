import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { AppError } from "../utils/app-error";
import { errorHandler } from "./error-handler";

describe("errorHandler", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: () => void;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  it("should handle AppError with correct status code", () => {
    const error = new AppError(400, "BAD_REQUEST", "Invalid input");

    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Invalid input",
        error: expect.objectContaining({ code: "BAD_REQUEST" }),
      }),
    );
  });

  it("should handle unknown errors with 500", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Unknown error");
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ code: "INTERNAL_SERVER_ERROR" }),
      }),
    );
    consoleSpy.mockRestore();
  });
});