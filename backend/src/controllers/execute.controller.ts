import type { Request, Response, NextFunction } from "express";
import { parseMessage } from "../services/openai.service";
import { findRestaurants } from "../services/foursquare.service";
import { sendResponse } from "../utils/send-response";
import type { ExecuteRequest } from "../types/execute";

export const parseMessageAndFindRestaurants = async (
  req: ExecuteRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const message = req.query.message;
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
