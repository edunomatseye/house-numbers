import { createApp } from "./app";
import { connectDb } from "./db";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDb(); // Connect to the database
    const app = createApp(); // Create the Express app

    app.listen(port, () => {
      console.log(
        `⚡️[server]: API Server is running at http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error("🚨 Failed to start server:", error);
    process.exit(1); // Exit with failure code
  }
}

startServer();
