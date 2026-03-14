import { Router } from "express";
import { executeQuerySchema } from "../validation/execute";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { parseMessageAndFindRestaurants } from "../controllers/execute.controller";

const executeRouter = Router();

executeRouter.get(
  "/execute",
  auth,
  validate(executeQuerySchema),
  parseMessageAndFindRestaurants,
);

export default executeRouter;