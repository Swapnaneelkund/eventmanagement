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
      "https://eventmanagement-nc5l.vercel.app"
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
    await connectDB(); 
    res.json({ dbState: "connected" });
  } catch (err) {
    res.status(500).json({ dbState: "not connected", error: err.message });
  }
});



export default app;
