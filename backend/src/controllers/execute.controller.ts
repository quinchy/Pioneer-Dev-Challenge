import type { Request, Response, NextFunction } from "express";
import { parseMessage } from "../services/openai.service";
import { findRestaurants } from "../services/foursquare.service";
import { sendResponse } from "../utils/send-response";

// Parses the incoming message and then finds matching restaurants.
export const parseMessageAndFindRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message } = req.validatedQuery as { message: string };
    const parsedMessage = await parseMessage(message);
    const restaurants = await findRestaurants(parsedMessage);

    return sendResponse(
      res,
      200,
      true,
      "Restaurant search completed successfully.",
      {
        data: {
          restaurants,
        },
      },
    );
  } catch (error) {
    next(error);
  }
};
