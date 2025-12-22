import mongoose from "mongoose";

const profileRef = { type: mongoose.Schema.Types.ObjectId, ref: "User" }; // or "Profile" if that's your model

const eventLogSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  before: {
    profiles: [profileRef],
    timezone: String,
    startAt: Date,
    endAt: Date,
  },
  after: {
    profiles: [profileRef],
    timezone: String,
    startAt: Date,
    endAt: Date,
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("EventLog", eventLogSchema);
