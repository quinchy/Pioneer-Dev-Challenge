import { describe, it, expect } from "vitest";
import { executeQuerySchema } from "./execute";

describe("executeQuerySchema", () => {
  it("accepts valid message", () => {
    const result = executeQuerySchema.safeParse({ message: "Find pizza places" });
    expect(result.success).toBe(true);
  });

  it("rejects empty message", () => {
    const result = executeQuerySchema.safeParse({ message: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing message", () => {
    const result = executeQuerySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});