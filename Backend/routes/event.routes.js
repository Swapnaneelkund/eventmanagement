import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  getEventLogs,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/createEvent", createEvent);
router.get("/getEvent/:id", getEvents);
router.put("/updateEvent/:id", updateEvent);
router.get("/getEventLogs/:id", getEventLogs);

export default router;
