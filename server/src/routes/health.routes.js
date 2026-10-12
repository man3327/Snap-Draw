import { Router } from "express";
import mongoose from "mongoose";
const router = Router();
router.get("/", (req, res) => {
  const databaseConnected =
    mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected
      ? "Snap & Draw API is healthy"
      : "API is running, but the database is unavailable",
    database: databaseConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

export default router;
