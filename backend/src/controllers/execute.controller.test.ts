import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Response, NextFunction } from "express";
import { parseMessageAndFindRestaurants } from "./execute.controller";
import { parseMessage } from "../services/openai.service";
import { findRestaurants } from "../services/foursquare.service";
import { sendResponse } from "../utils/send-response";
import type { ParseMessageParams } from "../validation/openai";
import type { ExecuteRequest } from "../types/execute";

vi.mock("../services/openai.service", () => ({
  parseMessage: vi.fn(),
}));

vi.mock("../services/foursquare.service", () => ({
  findRestaurants: vi.fn(),
}));

vi.mock("../utils/send-response", () => ({
  sendResponse: vi.fn(),
}));

describe("parseMessageAndFindRestaurants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with restaurant results for a valid message", async () => {
    const req = {
      query: {
        message: "Find me cheap sushi in Makati",
        code: "pioneerdevai",
      },
    } as ExecuteRequest;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    const parsedMessage: ParseMessageParams = {
      query: "sushi",
      near: "Makati",
      min_price: 1,
      max_price: 2,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: ["name", "location", "categories", "distance", "tel", "website"],
    };

    const restaurants = [{ name: "Sushi Place 1" }, { name: "Sushi Place 2" }];

    vi.mocked(parseMessage).mockResolvedValue(parsedMessage);
    vi.mocked(findRestaurants).mockResolvedValue(restaurants);

    await parseMessageAndFindRestaurants(req, res, next);

    expect(parseMessage).toHaveBeenCalledWith("Find me cheap sushi in Makati");
    expect(findRestaurants).toHaveBeenCalledWith(parsedMessage);
    expect(sendResponse).toHaveBeenCalledWith(
      res,
      200,
      true,
      "Restaurant search completed successfully.",
      {
        data: {
          restaurants,
        },
      },
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next with an error when parseMessage fails", async () => {
    const req = {
      query: {
        message: "Find me cheap sushi in Makati",
        code: "pioneerdevai",
      },
    } as ExecuteRequest;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;
    const error = new Error("Parse failed");

    vi.mocked(parseMessage).mockRejectedValue(error);

    await parseMessageAndFindRestaurants(req, res, next);

    expect(parseMessage).toHaveBeenCalledWith("Find me cheap sushi in Makati");
    expect(findRestaurants).not.toHaveBeenCalled();
    expect(sendResponse).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });

  it("calls next with an error when findRestaurants fails", async () => {
    const req = {
      query: {
        message: "Find me cheap sushi in Makati",
        code: "pioneerdevai",
      },
    } as ExecuteRequest;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;
    const error = new Error("Foursquare failed");

    const parsedMessage: ParseMessageParams = {
      query: "sushi",
      near: "Makati",
      min_price: 1,
      max_price: 2,
      open_now: false,
      tel_format: null,
      sort: "RELEVANCE",
      fields: ["name", "location", "categories", "distance", "tel", "website"],
    };

    vi.mocked(parseMessage).mockResolvedValue(parsedMessage);
    vi.mocked(findRestaurants).mockRejectedValue(error);

    await parseMessageAndFindRestaurants(req, res, next);

    expect(parseMessage).toHaveBeenCalledWith("Find me cheap sushi in Makati");
    expect(findRestaurants).toHaveBeenCalledWith(parsedMessage);
    expect(sendResponse).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
