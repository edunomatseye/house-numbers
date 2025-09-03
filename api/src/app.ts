import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import snippetsRouter from "@/routes/snippets";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";

export function createApp() {
  const app = express();

  // Basic CORS configuration for local development
  const corsOptions = {
    origin: "http://localhost:3031",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  // Authentication routes
  app.all("/api/auth/*", toNodeHandler(auth));

  app.get("/api/me", async (req, res) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
  });

  app.use(bodyParser.json());
  // Health check endpoint
  app.get("/health", (req, res) => res.status(200).json({ status: "ok boy!" }));

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
