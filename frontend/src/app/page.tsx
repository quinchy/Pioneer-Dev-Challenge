"use client";

import { useState } from "react";
import RestaurantFinderForm from "@/features/restaurant-finder/components/restaurant-finder-form";
import RestaurantFoundList from "@/features/restaurant-finder/components/restaurant-found-list";
import { useFindRestaurants } from "@/features/restaurant-finder/hooks/restaurant-finder";
import { RestaurantFinderFormData } from "@/features/restaurant-finder/types/restaurant-finder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, isPending, isError, error, mutate } = useFindRestaurants();

  const handleSubmit = (data: RestaurantFinderFormData) => {
    setSearchQuery(data.message);
    mutate(data.message);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8">Restaurant Finder</h1>
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle>Find a Restaurant</CardTitle>
        </CardHeader>
        <CardContent>
          <RestaurantFinderForm
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </CardContent>
      </Card>

      {searchQuery && (
        <div className="mt-8 w-full max-w-xl">
          <RestaurantFoundList
            restaurants={data}
            isPending={isPending}
            isError={isError}
            error={error}
          />
        </div>
      )}
    </div>
  );
}