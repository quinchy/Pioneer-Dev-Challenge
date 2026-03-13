import {
  ExecuteApiResponse,
  ExecuteApiSuccess,
  FindRestaurantsSuccessResponse,
  ApiError,
} from "../types/restaurant-finder";

export class ApiErrorWithDetail extends Error {
  detail?: string;

  constructor(message: string, detail?: string) {
    super(message);
    this.name = "ApiErrorWithDetail";
    this.detail = detail;
  }
}

export const findRestaurants = async (
  message: string,
): Promise<FindRestaurantsSuccessResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/execute?message=${encodeURIComponent(
      message,
    )}&code=${process.env.NEXT_PUBLIC_API_CODE}`,
  );

  const result: ExecuteApiResponse = await response.json();

  if (!result.success) {
    const errorResult = result as ApiError;
    throw new ApiErrorWithDetail(
      errorResult.message,
      errorResult.error.detail,
    );
  }

  const successResult = result as ExecuteApiSuccess;
  return successResult.data.restaurants;
};