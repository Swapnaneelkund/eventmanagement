import Event from "../models/Event.js";
import EventLog from "../models/EventLog.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export const createEvent = async (req, res) => {
  const { profiles, timezone, start, end } = req.body;

  if (dayjs(end).utc().isBefore(dayjs(start).utc())) {
    return res.status(400).json({ message: "End time cannot be before start" });
  }

  const event = await Event.create({
    profiles,
    timezone, 
    startAt: dayjs(start).utc().toDate(),
    endAt: dayjs(end).utc().toDate(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  res.status(201).json(event);
};

// GET EVENTS
export const getEvents = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)

    const events = await Event.find({
      profiles: id,
    }).populate("profiles");
    console.log(events)
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export const updateEvent = async (req, res) => {
  try {
    const { start, end, timezone, profiles } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    const before = {
      profiles: event.profiles, 
      timezone: event.timezone,
      startAt: event.startAt,
      endAt: event.endAt,
    };

    if (dayjs(end).isBefore(dayjs(start))) {
      return res.status(400).json({ message: "End time cannot be before start" });
    }

    
    event.startAt = dayjs(start).utc().toDate();
    event.endAt = dayjs(end).utc().toDate();
    event.timezone = timezone;
    if (profiles) event.profiles = profiles;
    event.updatedAt = new Date();

    await event.save();

  
    const after = {
      profiles: event.profiles,
      timezone: event.timezone,
      startAt: event.startAt,
      endAt: event.endAt,
    };

    // Create EventLog
    await EventLog.create({
      eventId: event._id,
      before,
      after,
      timestamp: new Date(),
    });

    const updatedEvent = await Event.findById(event._id).populate("profiles", "name");

    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



export const getEventLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await EventLog.find({ eventId: id })
      .populate("before.profiles", "name") 
      .populate("after.profiles", "name")
      .sort({ timestamp: -1 }); 

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
