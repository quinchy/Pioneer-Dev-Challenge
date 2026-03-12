import { env } from "../validation/env";
import { AppError } from "../utils/app-error";
import type { ParseMessageParams } from "../validation/openai";
import type {
  FoursquareSuccessResponse,
  FoursquareErrorResponse,
} from "../types/foursquare";

const FOURSQUARE_SEARCH_URL = "https://places-api.foursquare.com/places/search";

export async function findRestaurants(params: ParseMessageParams) {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set("query", params.query);
  if (params.near) searchParams.set("near", params.near);
  if (params.min_price != null) {
    searchParams.set("min_price", String(params.min_price));
  }
  if (params.max_price != null) {
    searchParams.set("max_price", String(params.max_price));
  }
  if (params.open_now) {
    searchParams.set("open_now", "true");
  }
  if (params.tel_format) {
    searchParams.set("tel_format", params.tel_format);
  }
  searchParams.set("sort", params.sort);

  if (params.fields.length > 0) {
    searchParams.set("fields", params.fields.join(","));
  }

  const url = `${FOURSQUARE_SEARCH_URL}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.FOURSQUARE_API_KEY}`,
        "X-Places-Api-Version": "2025-06-17",
        Accept: "application/json",
      },
    });

    const data = (await response.json()) as
      | FoursquareSuccessResponse
      | FoursquareErrorResponse;

    if (!response.ok) {
      throw new AppError(
        response.status,
        "FOURSQUARE_REQUEST_FAILED",
        "message" in data && typeof data.message === "string"
          ? data.message
          : "Foursquare request failed.",
      );
    }

    return data as FoursquareSuccessResponse;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      502,
      "FOURSQUARE_NETWORK_ERROR",
      "Failed to connect to Foursquare Places API.",
    );
  }
}
