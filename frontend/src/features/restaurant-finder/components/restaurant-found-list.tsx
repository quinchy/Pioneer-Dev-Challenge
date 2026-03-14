import type { FoursquarePlace } from "@/features/restaurant-finder/types/restaurant-finder";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SpoonAndForkIcon,
  Alert02Icon,
  Location03Icon,
  VanIcon,
  Call02Icon,
  Globe02Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

function RestaurantCard({ restaurant }: { restaurant: FoursquarePlace }) {
  const categoryNames = restaurant.categories
    ?.map((cat) => cat.name)
    .join(", ");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">
          {restaurant.name || "Unnamed Restaurant"}
        </CardTitle>
        {categoryNames && (
          <CardDescription className="italic">{categoryNames}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {restaurant.location && (
          <div className="space-y-1">
            {restaurant.location.formatted_address && (
              <p className="text-sm text-muted-foreground flex flex-row items-center">
                <HugeiconsIcon
                  icon={Location03Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="shrink-0"
                />
                <span className="ml-2">
                  {restaurant.location.formatted_address}
                </span>
              </p>
            )}
            {restaurant.distance && (
              <p className="text-sm text-muted-foreground flex flex-row items-center">
                <HugeiconsIcon
                  icon={VanIcon}
                  size={16}
                  color="currentColor"
                  strokeWidth={1.5}
                />
                <span className="ml-2">{restaurant.distance}m away</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
      {restaurant.tel && restaurant.website && (
        <CardFooter className="grid grid-cols-2 bg-muted py-2 rounded-none">
          {restaurant.tel && (
            <p className="text-sm flex flex-row items-center">
              <HugeiconsIcon
                icon={Call02Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.5}
              />
              <span className="ml-2 font-mono">{restaurant.tel}</span>
            </p>
          )}
          {restaurant.website && (
            <Link
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex flex-row items-center col-start-2 justify-end hover:underline font-bold"
            >
              <HugeiconsIcon
                icon={Globe02Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.5}
              />
              <span className="ml-2">Visit Website</span>
            </Link>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export function RestaurantInitial() {
  return (
    <div className="text-center text-muted-foreground text-sm flex flex-col items-center justify-center gap-5 max-w-md mx-auto">
      <HugeiconsIcon
        icon={SpoonAndForkIcon}
        size={30}
        color="currentColor"
        strokeWidth={1.5}
      />
      Your next meal is one search away. Try something like: “Find me a good
      ramen place in Makati open now”
    </div>
  );
}

export function RestaurantFoundListLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Spinner className="size-8 mb-2" />
      <p className="text-muted-foreground">Searching for the best spots…</p>
    </div>
  );
}

export function RestaurantFoundListError({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 max-w-md mx-auto text-destructive">
      <HugeiconsIcon
        icon={Alert02Icon}
        size={30}
        color="currentColor"
        strokeWidth={1.5}
      />
      <section>
        <h1 className="text-2xl font-bold">{title || "An error occurred"}</h1>
        {description && (
          <p className="text-center text-sm text-destructive/75">
            {description}
          </p>
        )}
      </section>
    </div>
  );
}

export function RestaurantNoList() {
  return (
    <div className="text-center text-muted-foreground text-sm flex flex-col items-center justify-center gap-5 max-w-md mx-auto">
      <HugeiconsIcon
        icon={UnavailableIcon}
        size={30}
        color="currentColor"
        strokeWidth={1.5}
      />
      No available restaurants found. Try searching for different area or changing your request.
    </div>
  );
}

export function RestaurantFoundList({
  restaurants,
}: {
  restaurants?: FoursquarePlace[];
}) {
  return (
    <div className="grid gap-4">
      {restaurants?.map((restaurant, index) => (
        <RestaurantCard key={index} restaurant={restaurant} />
      ))}
    </div>
  );
}