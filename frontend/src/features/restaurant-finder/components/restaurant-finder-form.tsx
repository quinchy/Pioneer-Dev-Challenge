"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  restaurantFinderSchema,
  type RestaurantFinderFormData,
} from "../types/restaurant-finder";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon } from "@hugeicons/core-free-icons";

interface RestaurantFinderFormProps {
  onSubmit: (data: RestaurantFinderFormData) => void;
  isPending?: boolean;
}

export default function RestaurantFinderForm({
  onSubmit,
  isPending = false,
}: RestaurantFinderFormProps) {
  const { control, handleSubmit } = useForm<RestaurantFinderFormData>({
    resolver: zodResolver(restaurantFinderSchema),
    defaultValues: {
      message: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        name="message"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Message</FieldLabel>

            <Textarea
              {...field}
              id={field.name}
              placeholder="Find me a restaurant in New York"
              disabled={isPending}
              aria-invalid={fieldState.invalid}
            />

            <FieldDescription>
              Describe the restaurant you want in natural language.
            </FieldDescription>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button type="submit" disabled={isPending} className="mt-4 w-full">
        {isPending ? (
          <>
            <Spinner className="size-4" />
            Finding Restaurant...
          </>
        ) : (
          <>
            <HugeiconsIcon
              icon={Search02Icon}
              strokeWidth={2}
              className="size-4"
            />
            Search Restaurants
          </>
        )}
      </Button>
    </form>
  );
}
