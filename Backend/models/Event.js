import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  timezone: String,

  startAt: Date,
  endAt: Date,

  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.model("Event", EventSchema);
