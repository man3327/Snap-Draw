import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
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
    message: "Welcome to the Snap & Draw API"
  });
});
app.use("/api/v1/health", healthRoutes);
export default app;
