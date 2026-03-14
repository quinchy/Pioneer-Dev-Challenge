import { z } from "zod";

export const parseMessageValidationSchema = z
  .object({
    query: z.string().nullable(),
    near: z.string().nullable(),
    min_price: z.number().int().min(1).max(4).nullable(),
    max_price: z.number().int().min(1).max(4).nullable(),
    open_now: z.boolean(),
    tel_format: z.enum(["NATIONAL", "E164"]).nullable(),
    sort: z.enum(["RELEVANCE", "RATING", "DISTANCE", "POPULARITY"]),
    fields: z
      .array(
        z.enum([
          "name",
          "location",
          "categories",
          "distance",
          "tel",
          "website",
        ]),
      )
      .transform((fields) => [...new Set(fields)]),
  })
  .superRefine((data, ctx) => {
    if (
      data.min_price != null &&
      data.max_price != null &&
      data.min_price > data.max_price
    ) {
      ctx.addIssue({
        code: "custom",
        message: "min_price cannot be greater than max_price",
        path: ["min_price"],
      });
    }
  });

export type ParseMessageParams = z.infer<typeof parseMessageValidationSchema>;
