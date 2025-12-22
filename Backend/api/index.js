import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

import userRoutes from "../routes/user.routes.js";
import eventRoutes from "../routes/event.routes.js";
import mongoose from "mongoose";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/db-health", async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    if (state === 1) {
      return res.json({ db: "connected" });
    }
    res.status(500).json({ db: "not connected", state });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default app;
