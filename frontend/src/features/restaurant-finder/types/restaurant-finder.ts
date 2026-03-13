import { z } from "zod";

export const restaurantFinderSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export type RestaurantFinderFormData = z.infer<typeof restaurantFinderSchema>;

export type RestaurantFinderFormDataWithMessage = {
  message: string;
};

type FoursquareCategory = {
  fsq_category_id: string;
  name: string;
  short_name: string;
  plural_name: string;
  icon: {
    prefix: string;
    suffix: string;
  };
};

type FoursquareLocation = {
  address?: string;
  locality?: string;
  region?: string;
  postcode?: string;
  country?: string;
  formatted_address?: string;
};

export type FoursquarePlace = {
  categories?: FoursquareCategory[];
  distance?: number;
  email?: string;
  location?: FoursquareLocation;
  name?: string;
  tel?: string;
  website?: string;
};

export type FindRestaurantsSuccessResponse = {
  results: FoursquarePlace[];
  context?: {
    geo_bounds?: {
      circle?: {
        center?: {
          latitude: number;
          longitude: number;
        };
        radius: number;
      };
    };
  };
};

export type ApiError = {
  success: false;
  message: string;
  error: {
    code: string;
    detail?: string;
  };
};

export type ExecuteApiSuccess = {
  success: true;
  message: string;
  data: {
    restaurants: FindRestaurantsSuccessResponse;
  };
};

export type ExecuteApiResponse = ExecuteApiSuccess | ApiError;