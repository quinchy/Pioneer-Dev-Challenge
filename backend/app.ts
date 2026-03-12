import express from "express";
import { requestLogger } from "./middleware/request-logger";
import { errorHandler } from "./middleware/error-handler";
import executeRouter from "./routes/execute.route";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use("/api", executeRouter);
app.use(errorHandler);

export default app;