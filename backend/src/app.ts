import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import snippetsRouter from "./routes/snippets";

export function createApp() {
  const app = express();

  // Basic CORS configuration for local development
  app.use(
    cors({
      origin: "*", // Allow all for now, in production specify frontend origin
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(bodyParser.json());

  // Health check endpoint
  app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

  // Routes
  app.use("/snippets", snippetsRouter);

  // Fallback for unmatched routes
  app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Global error handler
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error("Unhandled API error:", err.stack || err);
      res
        .status(500)
        .json({ error: "An unexpected internal server error occurred." });
    }
  );

  return app;
}
