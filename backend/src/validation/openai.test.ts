import { describe, it, expect } from "vitest";
import { parseMessageValidationSchema } from "../validation/openai";

describe("parseMessageValidationSchema", () => {
  it("accepts valid params", () => {
    const result = parseMessageValidationSchema.safeParse({
      query: "pizza",
      near: "NYC",
      min_price: null,
      max_price: null,
      open_now: true,
      tel_format: null,
      sort: "RELEVANCE",
      fields: ["name", "location"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects min_price greater than max_price", () => {
    const result = parseMessageValidationSchema.safeParse({
      query: "pizza",
      near: null,
      min_price: 3,
      max_price: 1,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: [],
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid price range", () => {
    const result = parseMessageValidationSchema.safeParse({
      query: "pizza",
      near: null,
      min_price: 1,
      max_price: 3,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: [],
    });

    expect(result.success).toBe(true);
  });
});
