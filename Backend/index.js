import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/user.routes.js";
import eventRoutes from "./routes/event.routes.js";

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

export default app;
