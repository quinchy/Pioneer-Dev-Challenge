import { FindRestaurantsSuccessResponse, FoursquarePlace } from "../types/restaurant-finder";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface RestaurantFoundListProps {
  restaurants?: FindRestaurantsSuccessResponse;
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
}

function RestaurantCard({ restaurant }: { restaurant: FoursquarePlace }) {
  const categoryNames = restaurant.categories
    ?.map((cat) => cat.name)
    .join(", ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{restaurant.name || "Unnamed Restaurant"}</CardTitle>
        {categoryNames && (
          <CardDescription>{categoryNames}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {restaurant.location && (
          <div className="space-y-1">
            {restaurant.location.formatted_address && (
              <p className="text-sm text-muted-foreground">
                {restaurant.location.formatted_address}
              </p>
            )}
            {restaurant.location.locality && restaurant.location.region && (
              <p className="text-sm text-muted-foreground">
                {restaurant.location.locality}, {restaurant.location.region}
              </p>
            )}
            {restaurant.distance && (
              <p className="text-sm text-muted-foreground">
                {restaurant.distance}m away
              </p>
            )}
          </div>
        )}
        {restaurant.tel && (
          <p className="text-sm mt-2">
            <strong>Phone:</strong> {restaurant.tel}
          </p>
        )}
        {restaurant.website && (
          <p className="text-sm mt-2">
            <strong>Website:</strong>{" "}
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {restaurant.website}
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function RestaurantFoundList({
  restaurants,
  isPending = false,
  isError = false,
  error = null,
}: RestaurantFoundListProps) {
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner className="size-8 mb-2" />
        <p className="text-muted-foreground">Finding restaurants...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            {error?.message || "An error occurred while finding restaurants."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!restaurants || restaurants.results.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No restaurants found. Try a different search.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {restaurants.results.map((restaurant, index) => (
        <RestaurantCard key={index} restaurant={restaurant} />
      ))}
    </div>
  );
}