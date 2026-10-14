import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import roomRoutes from "./routes/room.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Snap & Sketch API"
  });
});

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/rooms", roomRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  console.error(error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message:
      error.statusCode && error.statusCode < 500
        ? error.message
        : "Internal server error"
  });
});

export default app;
