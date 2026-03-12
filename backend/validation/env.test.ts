import { describe, it, expect, beforeEach } from "vitest";
import { z } from "zod";

describe("env validation", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it("should require API_CODE", () => {
    delete process.env.API_CODE;
    delete process.env.OPENAI_API_KEY;
    delete process.env.FOURSQUARE_API_KEY;

    expect(() => {
      const envSchema = z.object({
        API_CODE: z.string().min(1),
        OPENAI_API_KEY: z.string().min(1),
        FOURSQUARE_API_KEY: z.string().min(1),
      });
      envSchema.parse(process.env);
    }).toThrow();
  });

  it("should use default values for optional fields", () => {
    process.env.API_CODE = "test-code";
    process.env.OPENAI_API_KEY = "test-key";
    process.env.FOURSQUARE_API_KEY = "test-fs-key";

    const envSchema = z.object({
      PORT: z.coerce.number().default(3001),
      API_CODE: z.string().min(1),
      OPENAI_API_KEY: z.string().min(1),
      OPENAI_MODEL: z.string().min(1).default("gpt-4.1-mini"),
      FOURSQUARE_API_KEY: z.string().min(1),
    });

    const result = envSchema.parse(process.env);
    expect(result.PORT).toBe(3001);
    expect(result.OPENAI_MODEL).toBe("gpt-4.1-mini");
  });
});