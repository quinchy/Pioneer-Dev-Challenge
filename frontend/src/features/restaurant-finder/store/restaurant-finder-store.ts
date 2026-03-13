import { create } from "zustand";
import type { ExecuteApiResponse } from "@/features/restaurant-finder/types/restaurant-finder";

interface RestaurantFinderStore {
  result: ExecuteApiResponse | null;
  isLoading: boolean;
  setResult: (result: ExecuteApiResponse | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useRestaurantFinderStore = create<RestaurantFinderStore>()(
  (set) => ({
    result: null,
    isLoading: false,
    setResult: (result) => set({ result }),
    setIsLoading: (isLoading) => set({ isLoading }),
  }),
);
