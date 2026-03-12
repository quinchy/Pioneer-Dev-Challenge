import OpenAI from "openai";
import { env } from "../validation/env";
import {
  parseMessageValidationSchema,
  type ParseMessageParams,
} from "../validation/openai";
import { AppError } from "../utils/app-error";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function parseMessage(
  message: string,
): Promise<ParseMessageParams> {
  try {
    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: `
            Extract Foursquare restaurant search parameters from the user's message.

            Return only structured data.

            Rules:
            1. Use exact parameter names from the schema.
            2. "fields" must contain response fields to request from Foursquare, not request parameter names.
            3. Always include useful core fields for restaurant results.
            4. If the user asks for strong reviews, best, top-rated, or highly rated places, use sort = "RATING".
            5. If the user asks for nearest, nearby, or closest places, use sort = "DISTANCE".
            6. Otherwise use sort = "RELEVANCE".
            7. If the user says "open now", set open_now = true. Otherwise false.
            8. Use min_price and max_price only when the message implies a budget.
            9. Use tel_format only if phone numbers are relevant to return.
          `.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "restaurant_search_params",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              query: { type: ["string", "null"] },
              near: { type: ["string", "null"] },
              min_price: { type: ["integer", "null"], minimum: 1, maximum: 4 },
              max_price: { type: ["integer", "null"], minimum: 1, maximum: 4 },
              open_now: { type: "boolean" },
              tel_format: {
                type: ["string", "null"],
                enum: ["NATIONAL", "E164", null],
              },
              sort: {
                type: "string",
                enum: ["RELEVANCE", "RATING", "DISTANCE", "POPULARITY"],
              },
              fields: {
                type: "array",
                items: {
                  type: "string",
                  enum: [
                    "name",
                    "location",
                    "categories",
                    "distance",
                    "tel",
                    "website",
                  ],
                },
              },
            },
            required: [
              "query",
              "near",
              "min_price",
              "max_price",
              "open_now",
              "tel_format",
              "sort",
              "fields",
            ],
          },
        },
      },
    });

    const outputText = response.output_text;
    const json = JSON.parse(outputText);

    return parseMessageValidationSchema.parse(json);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        throw new AppError(
          503,
          "LLM_RATE_LIMITED",
          "Message parsing is temporarily unavailable. Please try again later or contact the developer.",
        );
      }

      throw new AppError(
        502,
        "LLM_REQUEST_FAILED",
        error.message ||
          "Message parsing failed due to an upstream AI service error.",
      );
    }

    if (error instanceof SyntaxError) {
      throw new AppError(
        500,
        "LLM_INVALID_JSON",
        "The AI response was not valid JSON.",
      );
    }

    throw new AppError(
      500,
      "INTERNAL_SERVER_ERROR",
      "An unexpected server error occurred.",
    );
  }
}
