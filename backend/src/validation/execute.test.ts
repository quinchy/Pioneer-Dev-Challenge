import { describe, it, expect } from "vitest";
import { executeQuerySchema } from "./execute";

describe("execute validation", () => {
  it("should accept valid message", () => {
    const result = executeQuerySchema.safeParse({ message: "Find pizza places" });
    expect(result.success).toBe(true);
  });

  it("should reject empty message", () => {
    const result = executeQuerySchema.safeParse({ message: "" });
    expect(result.success).toBe(false);
  });

  it("should reject missing message", () => {
    const result = executeQuerySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});