import { describe, it, expect, vi, beforeEach } from "vitest";
import { findRestaurants } from "./foursquare.service";

describe("foursquare service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.NODE_ENV = "test";
    process.env.FOURSQUARE_API_KEY = "test-foursquare-api-key";
  });

  it("should export findRestaurants function", () => {
    expect(typeof findRestaurants).toBe("function");
  });

  it("should handle API errors", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: "Unauthorized" }),
      }) as unknown as typeof fetch;

    global.fetch = fetchMock;

    await expect(
      findRestaurants({
        query: "pizza",
        near: null,
        min_price: null,
        max_price: null,
        open_now: false,
        tel_format: null,
        sort: "RELEVANCE",
        fields: [],
      }),
    ).rejects.toThrow();
  });

  it("should return data on success", async () => {
    const mockData = { results: [{ id: "1", name: "Test Restaurant" }] };

    const fetchMock = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      }) as unknown as typeof fetch;

    global.fetch = fetchMock;

    const result = await findRestaurants({
      query: "pizza",
      near: "NYC",
      min_price: null,
      max_price: null,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: [],
    });

    expect(result).toEqual(mockData as any);
  });
});
