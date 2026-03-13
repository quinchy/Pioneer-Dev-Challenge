import { Router } from "express";
import { executeQuerySchema } from "../validation/execute";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { parseMessageAndFindRestaurants } from "../controllers/execute.controller";

const executeRouter = Router();

executeRouter.get(
  "/execute",
  authMiddleware,
  validate(executeQuerySchema),
  parseMessageAndFindRestaurants,
);

export default executeRouter;