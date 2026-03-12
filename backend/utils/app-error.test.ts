import { describe, it, expect } from "vitest";
import { AppError } from "./app-error";

describe("AppError", () => {
  it("should create error with correct properties", () => {
    const error = new AppError(400, "BAD_REQUEST", "Invalid input");

    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("BAD_REQUEST");
    expect(error.message).toBe("Invalid input");
    expect(error.name).toBe("AppError");
  });

  it("should be instanceof Error", () => {
    const error = new AppError(500, "INTERNAL", "Server error");
    expect(error instanceof Error).toBe(true);
  });
});