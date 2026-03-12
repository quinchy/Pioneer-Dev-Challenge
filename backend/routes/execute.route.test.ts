import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app";
import * as openaiService from "../services/openai.service";
import * as foursquareService from "../services/foursquare.service";
import { logger } from "../utils/logger";

describe("GET /api/execute", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.NODE_ENV = "test";
    process.env.API_CODE = "test-api-code";
  });

  it("should return 200 and restaurants on success", async () => {
    const logSpy = vi.spyOn(logger, "info").mockImplementation(() => {});

    vi.spyOn(openaiService, "parseMessage").mockResolvedValue({
      query: "pizza",
      near: "NYC",
      min_price: null,
      max_price: null,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: [],
    });

    const mockRestaurants = { results: [{ id: "1", name: "Pizza Place" }] };
    vi.spyOn(foursquareService, "findRestaurants").mockResolvedValue(
      mockRestaurants as any,
    );

    const response = await request(app)
      .get("/api/execute")
      .query({ code: "test-api-code", message: "Find pizza in NYC" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.restaurants).toEqual(mockRestaurants);

    logSpy.mockRestore();
  });
});

