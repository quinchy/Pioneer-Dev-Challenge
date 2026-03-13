import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  API_CODE: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1).default("gpt-4.1-mini"),
  FOURSQUARE_API_KEY: z.string().min(1),
  CORS_ORIGIN: z.string().min(1),
});

const isTestEnv = process.env.NODE_ENV === "test";

const rawEnv = {
  PORT: process.env.PORT,
  API_CODE: process.env.API_CODE ?? (isTestEnv ? "test-api-code" : undefined),
  OPENAI_API_KEY:
    process.env.OPENAI_API_KEY ??
    (isTestEnv ? "test-openai-api-key" : undefined),
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  FOURSQUARE_API_KEY:
    process.env.FOURSQUARE_API_KEY ??
    (isTestEnv ? "test-foursquare-api-key" : undefined),
  CORS_ORIGIN:
    process.env.CORS_ORIGIN ??
    (isTestEnv ? "http://localhost:3000" : undefined),
};

export const env = envSchema.parse(rawEnv);
