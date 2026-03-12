import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("openai validation", () => {
  const parseMessageValidationSchema = z
    .object({
      query: z.string().nullable(),
      near: z.string().nullable(),
      min_price: z.number().int().min(1).max(4).nullable(),
      max_price: z.number().int().min(1).max(4).nullable(),
      open_now: z.boolean(),
      tel_format: z.enum(["NATIONAL", "E164"]).nullable(),
      sort: z.enum(["RELEVANCE", "RATING", "DISTANCE", "POPULARITY"]),
      fields: z.array(z.string()),
    })
    .superRefine((data, ctx) => {
      if (
        data.min_price != null &&
        data.max_price != null &&
        data.min_price > data.max_price
      ) {
        ctx.addIssue({
          code: "custom",
          message: "min_price cannot be greater than max_price",
          path: ["min_price"],
        });
      }
    });

  it("should validate valid params", () => {
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

  it("should reject min_price > max_price", () => {
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

  it("should accept valid price range", () => {
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