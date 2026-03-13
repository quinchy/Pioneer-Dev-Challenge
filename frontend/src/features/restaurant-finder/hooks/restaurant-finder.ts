import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { findRestaurants, ApiErrorWithDetail } from "@/features/restaurant-finder/apis/restaurant-finder";
import { FindRestaurantsSuccessResponse, ExecuteApiSuccess } from "../types/restaurant-finder";

interface UseFindRestaurantsOptions {
  onSuccess?: (data: FindRestaurantsSuccessResponse) => void;
  onError?: (error: Error) => void;
}

export const useFindRestaurants = (options?: UseFindRestaurantsOptions) => {
  return useMutation({
    mutationFn: findRestaurants,
    onSuccess: (data, variables, context) => {
      toast.success("Restaurants found successfully!");
      options?.onSuccess?.(data);
    },
    onError: (error: Error, variables, context) => {
      const apiError = error as ApiErrorWithDetail;
      toast.error(apiError.message);
      options?.onError?.(error);
    },
  });
};