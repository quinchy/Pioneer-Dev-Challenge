import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { findRestaurants } from "./foursquare.service";
import { AppError } from "../utils/app-error";
import type { ParseMessageParams } from "../validation/openai";

vi.mock("../validation/env", () => ({
  env: {
    FOURSQUARE_API_KEY: "test-api-key",
  },
}));

describe("findRestaurants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns restaurant results for valid params", async () => {
    const params: ParseMessageParams = {
      query: "sushi",
      near: "Makati",
      min_price: 1,
      max_price: 2,
      open_now: true,
      tel_format: "NATIONAL",
      sort: "RELEVANCE",
      fields: ["name", "location", "categories", "distance", "tel", "website"],
    };

    const mockResults = [
      {
        fsq_place_id: "1",
        name: "Sushi Place 1",
        location: { formatted_address: "Makati" },
      },
      {
        fsq_place_id: "2",
        name: "Sushi Place 2",
        location: { formatted_address: "Makati" },
      },
    ];

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        results: mockResults,
      }),
    } as unknown as Response);

    const result = await findRestaurants(params);

    expect(fetch).toHaveBeenCalledTimes(1);

    const [url, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];

    expect(url).toContain("https://places-api.foursquare.com/places/search?");
    expect(url).toContain("query=sushi");
    expect(url).toContain("near=Makati");
    expect(url).toContain("min_price=1");
    expect(url).toContain("max_price=2");
    expect(url).toContain("open_now=true");
    expect(url).toContain("tel_format=NATIONAL");
    expect(url).toContain("sort=RELEVANCE");
    expect(url).toContain(
      "fields=name%2Clocation%2Ccategories%2Cdistance%2Ctel%2Cwebsite",
    );

    expect(options).toEqual({
      method: "GET",
      headers: {
        Authorization: "Bearer test-api-key",
        "X-Places-Api-Version": "2025-06-17",
        Accept: "application/json",
      },
    });

    expect(result).toEqual(mockResults);
  });

  it("throws AppError when Foursquare responds with a non-ok status", async () => {
    const params: ParseMessageParams = {
      query: "sushi",
      near: "Makati",
      min_price: null,
      max_price: null,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: ["name", "location"],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({
        message: "Invalid request",
      }),
    } as unknown as Response);

    await expect(findRestaurants(params)).rejects.toBeInstanceOf(AppError);
    await expect(findRestaurants(params)).rejects.toMatchObject({
      statusCode: 400,
      code: "FOURSQUARE_REQUEST_FAILED",
      message: "Foursquare request failed.",
      detail: "Invalid request",
    });
  });

  it("throws AppError without detail when Foursquare error response has no message", async () => {
    const params: ParseMessageParams = {
      query: "sushi",
      near: "Makati",
      min_price: null,
      max_price: null,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: ["name"],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({}),
    } as unknown as Response);

    await expect(findRestaurants(params)).rejects.toMatchObject({
      statusCode: 500,
      code: "FOURSQUARE_REQUEST_FAILED",
      message: "Foursquare request failed.",
      detail: undefined,
    });
  });

  it("throws AppError when fetch fails due to network error", async () => {
    const params: ParseMessageParams = {
      query: "sushi",
      near: "Makati",
      min_price: null,
      max_price: null,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: ["name"],
    };

    vi.mocked(fetch).mockRejectedValue(new Error("Network down"));

    await expect(findRestaurants(params)).rejects.toBeInstanceOf(AppError);
    await expect(findRestaurants(params)).rejects.toMatchObject({
      statusCode: 502,
      code: "FOURSQUARE_NETWORK_ERROR",
      message: "Failed to connect to Foursquare Places API.",
      detail: "Network down",
    });
  });

  it("rethrows AppError if one is already thrown", async () => {
    const params: ParseMessageParams = {
      query: "sushi",
      near: "Makati",
      min_price: null,
      max_price: null,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: ["name"],
    };

    const appError = new AppError(
      401,
      "FOURSQUARE_REQUEST_FAILED",
      "Foursquare request failed.",
      "Unauthorized",
    );

    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({
        message: "Unauthorized",
      }),
    } as unknown as Response);

    await expect(findRestaurants(params)).rejects.toMatchObject({
      statusCode: 401,
      code: "FOURSQUARE_REQUEST_FAILED",
      message: "Foursquare request failed.",
      detail: "Unauthorized",
    });
  });

  it("omits optional query params when values are null or false", async () => {
    const params: ParseMessageParams = {
      query: null,
      near: null,
      min_price: null,
      max_price: null,
      open_now: false,
      tel_format: null,
      sort: "DISTANCE",
      fields: ["name"],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        results: [],
      }),
    } as unknown as Response);

    await findRestaurants(params);

    const [url] = vi.mocked(fetch).mock.calls[0] as [string];

    expect(url).toContain("sort=DISTANCE");
    expect(url).toContain("fields=name");

    expect(url).not.toContain("query=");
    expect(url).not.toContain("near=");
    expect(url).not.toContain("min_price=");
    expect(url).not.toContain("max_price=");
    expect(url).not.toContain("open_now=");
    expect(url).not.toContain("tel_format=");
  });
});
