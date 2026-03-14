import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { parseMessageAndFindRestaurants } from "./execute.controller";
import * as openaiService from "../services/openai.service";
import * as foursquareService from "../services/foursquare.service";

describe("parseMessageAndFindRestaurants controller", () => {
  const mockRequest = () =>
    ({
      validatedQuery: { message: "Find pizza in NYC" },
    }) as unknown as Request;

  const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  let next: NextFunction;

  beforeEach(() => {
    vi.restoreAllMocks();
    next = vi.fn();
  });

  it("should parse the message, find restaurants and return 200 with data", async () => {
    const req = mockRequest();
    const res = mockResponse();

    vi.spyOn(openaiService, "parseMessage").mockResolvedValue({
      query: "pizza",
      near: "NYC",
      min_price: null,
      max_price: null,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: [],
    } as any);

    const mockRestaurants = { results: [{ id: "1", name: "Pizza Place" }] };
    vi.spyOn(foursquareService, "findRestaurants").mockResolvedValue(
      mockRestaurants as any,
    );

    await parseMessageAndFindRestaurants(req, res, next);

    expect(openaiService.parseMessage).toHaveBeenCalledWith("Find pizza in NYC");
    expect(foursquareService.findRestaurants).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Restaurant search completed successfully.",
      data: {
        restaurants: mockRestaurants,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error when something throws", async () => {
    const req = mockRequest();
    const res = mockResponse();
    const error = new Error("boom");

    vi.spyOn(openaiService, "parseMessage").mockRejectedValue(error);

    await parseMessageAndFindRestaurants(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

