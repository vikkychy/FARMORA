import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Farmora API!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    project: "Farmora",
  });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Farmora API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Farmora:", error.message);
    process.exit(1);
  }
}

startServer();