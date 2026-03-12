import {
  ExecuteApiResponse,
  ExecuteApiSuccess,
  FindRestaurantsSuccessResponse,
} from "../types/restaurant-finder";

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
    throw new Error(result.error.detail);
  }

  const successResult = result as ExecuteApiSuccess;
  return successResult.data.restaurants;
};