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

type FoursquarePlace = {
  categories?: FoursquareCategory[];
  distance?: number;
  email?: string;
  location?: FoursquareLocation;
  name?: string;
  tel?: string;
  website?: string;
};

export type FoursquareSuccessResponse = {
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

export type FoursquareErrorResponse = {
  message?: string;
  error?: string;
};
