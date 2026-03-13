"use client";

import { Card, CardContent } from "@/components/ui/card";
import RestaurantFinderForm from "@/features/restaurant-finder/components/restaurant-finder-form";
import {
  RestaurantFoundList,
  RestaurantInitial,
  RestaurantNoList,
  RestaurantFoundListLoading,
  RestaurantFoundListError,
} from "@/features/restaurant-finder/components/restaurant-found-list";
import { useRestaurantFinderStore } from "@/features/restaurant-finder/store/restaurant-finder-store";
import { StateRenderer } from "@/components/app/state-renderer";

export default function RestaurantFinder() {
  const result = useRestaurantFinderStore((state) => state.result);
  const isLoading = useRestaurantFinderStore((state) => state.isLoading);

  const successResult = result?.success ? result : null;
  const errorResult = result && !result.success ? result : null;

  const restaurants = successResult?.data.restaurants;
  const restaurantItems = restaurants?.results ?? [];

  const isInitial = !isLoading && result === null;
  const hasError = !isLoading && errorResult !== null;
  const hasData = !isLoading && restaurantItems.length > 0;

  return (
    <>
      <Card className="max-w-2xl w-full my-16">
        <CardContent>
          <RestaurantFinderForm />
        </CardContent>
      </Card>
      <div className="my-16 w-full max-w-2xl">
        <StateRenderer
          isInitial={isInitial}
          isLoading={isLoading}
          hasError={hasError}
          hasData={hasData}
          initialUI={<RestaurantInitial />}
          loadingUI={<RestaurantFoundListLoading />}
          errorUI={
            <RestaurantFoundListError
              title={errorResult?.message}
              description={errorResult?.error.detail}
            />
          }
          noDataUI={<RestaurantNoList />}
          dataUI={<RestaurantFoundList restaurants={restaurants} />}
        />
      </div>
    </>
  );
}