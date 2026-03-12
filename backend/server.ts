// src/server.ts
import app from "./app";
import { env } from "./validation/env";

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
