"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  restaurantFinderSchema,
  type RestaurantFinderFormData,
} from "@/features/restaurant-finder/types/restaurant-finder";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon } from "@hugeicons/core-free-icons";
import { findRestaurants } from "@/features/restaurant-finder/apis/restaurant-finder";
import { useRestaurantFinderStore } from "@/features/restaurant-finder/store/restaurant-finder-store";

export default function RestaurantFinderForm() {
  const setResult = useRestaurantFinderStore((state) => state.setResult);
  const setIsLoading = useRestaurantFinderStore((state) => state.setIsLoading);
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<RestaurantFinderFormData>({
    resolver: zodResolver(restaurantFinderSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: RestaurantFinderFormData) => {
    setIsLoading(true);
    const result = await findRestaurants(data.message);
    setIsLoading(false);
    setResult(result);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        name="message"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex flex-row items-center justify-between">
              <FieldLabel htmlFor={field.name}>Your Message</FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>

            <Textarea
              {...field}
              id={field.name}
              placeholder="Describe the restaurant you want"
              disabled={isSubmitting}
              aria-invalid={fieldState.invalid}
            />
          </Field>
        )}
      />

      <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
        <HugeiconsIcon icon={Search02Icon} strokeWidth={2} className="size-4" />
        Search Restaurants
      </Button>
    </form>
  );
}
