import app from "./app";
import { env } from "./validation/env";

const port = Number(env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
