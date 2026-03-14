import express from "express";
import cors from "cors";
import { requestLogger } from "./middleware/request-logger";
import { errorHandler } from "./middleware/error-handler";
import executeRouter from "./routes/execute.route";
import { env } from "./validation/env";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);
app.use(express.json());
app.use(requestLogger);
app.use("/api", executeRouter);
app.use(errorHandler);

export default app;
