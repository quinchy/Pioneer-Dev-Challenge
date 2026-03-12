import { Router } from "express";
import { executeQuerySchema } from "../validation/execute";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { parseMessage } from "../services/openai.service";
import { findRestaurants } from "../services/foursquare.service";

const executeRouter = Router();

executeRouter.get(
  "/execute",
  authMiddleware,
  validate(executeQuerySchema),
  async (req, res, next) => {
    try {
      const { message } = req.validatedQuery as { message: string };
      const parsedMessage = await parseMessage(message);
      const restaurants = await findRestaurants(parsedMessage);

      return res.status(200).json({
        success: true,
        message: "Restaurant search completed successfully.",
        data: {
          restaurants,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export default executeRouter;