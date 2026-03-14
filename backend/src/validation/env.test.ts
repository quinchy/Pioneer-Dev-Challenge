import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("env", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("uses test fallbacks when NODE_ENV is test", async () => {
    process.env.NODE_ENV = "test";
    delete process.env.API_CODE;
    delete process.env.OPENAI_API_KEY;
    delete process.env.FOURSQUARE_API_KEY;
    delete process.env.CORS_ORIGIN;
    delete process.env.OPENAI_MODEL;
    delete process.env.PORT;

    const { env } = await import("./env");

    expect(env).toEqual({
      PORT: 3001,
      API_CODE: "test-api-code",
      OPENAI_API_KEY: "test-openai-api-key",
      OPENAI_MODEL: "gpt-4.1-mini",
      FOURSQUARE_API_KEY: "test-foursquare-api-key",
      CORS_ORIGIN: "http://localhost:3000",
    });
  });

  it("uses provided environment variables when present", async () => {
    process.env.NODE_ENV = "test";
    process.env.PORT = "5000";
    process.env.API_CODE = "real-api-code";
    process.env.OPENAI_API_KEY = "real-openai-key";
    process.env.OPENAI_MODEL = "gpt-5";
    process.env.FOURSQUARE_API_KEY = "real-foursquare-key";
    process.env.CORS_ORIGIN = "https://example.com";

    const { env } = await import("./env");

    expect(env).toEqual({
      PORT: 5000,
      API_CODE: "real-api-code",
      OPENAI_API_KEY: "real-openai-key",
      OPENAI_MODEL: "gpt-5",
      FOURSQUARE_API_KEY: "real-foursquare-key",
      CORS_ORIGIN: "https://example.com",
    });
  });

  it("throws when required variables are missing outside test environment", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.API_CODE;
    delete process.env.OPENAI_API_KEY;
    delete process.env.FOURSQUARE_API_KEY;
    delete process.env.CORS_ORIGIN;
    delete process.env.OPENAI_MODEL;
    delete process.env.PORT;

    await expect(import("./env")).rejects.toThrow();
  });

  it("applies default values for PORT and OPENAI_MODEL", async () => {
    process.env.NODE_ENV = "test";
    process.env.API_CODE = "real-api-code";
    process.env.OPENAI_API_KEY = "real-openai-key";
    process.env.FOURSQUARE_API_KEY = "real-foursquare-key";
    process.env.CORS_ORIGIN = "https://example.com";
    delete process.env.PORT;
    delete process.env.OPENAI_MODEL;

    const { env } = await import("./env");

    expect(env.PORT).toBe(3001);
    expect(env.OPENAI_MODEL).toBe("gpt-4.1-mini");
  });
});
