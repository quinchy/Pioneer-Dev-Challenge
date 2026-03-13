import app from "./app";
import { env } from "./validation/env";

// In production (e.g. Vercel), export the app and let the platform handle the server.
export default app;

// In local / non-production environments, start the HTTP server here.
if (process.env.NODE_ENV !== "production") {
  const port = Number(env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
