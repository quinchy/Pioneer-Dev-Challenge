import {
  type ExecuteApiResponse,
} from "@/features/restaurant-finder/types/restaurant-finder";

export const findRestaurants = async (
  message: string,
): Promise<ExecuteApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/execute?message=${encodeURIComponent(
      message,
    )}&code=${process.env.NEXT_PUBLIC_API_CODE}`,
    { cache: "no-store" },
  );

  const result: ExecuteApiResponse = await response.json();
  return result;
};