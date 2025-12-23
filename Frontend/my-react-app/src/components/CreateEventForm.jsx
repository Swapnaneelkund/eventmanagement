import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";
import MultiProfileSelect from "./MultiProfileSelect.jsx";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

export default function CreateEventForm({ isOpen, editEvent, refresh }) {
  const users = useSelector((s) => s.user.user);
  const dispatch = useDispatch();

  const [profiles, setProfiles] = useState([]);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editEvent) {
      setProfiles(editEvent.profiles || []);
      setTimezone(editEvent.timezone || "Asia/Kolkata");
      setStart(dayjs(editEvent.start).format("YYYY-MM-DDTHH:mm"));
      setEnd(dayjs(editEvent.end).format("YYYY-MM-DDTHH:mm"));
    }
  }, [editEvent]);

  const submit = async () => {
    const newErrors = {};

    // Basic validation
    if (!profiles.length) newErrors.profiles = "Please select at least one profile.";
    if (!start) newErrors.start = "Please select start date & time.";
    if (!end) newErrors.end = "Please select end date & time.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const startZoned = dayjs.tz(start, timezone);
    const endZoned = dayjs.tz(end, timezone);
    const nowUTC = dayjs.utc();

    // Logical validation
    if (startZoned.utc().isBefore(nowUTC)) {
      newErrors.start = "Start date/time cannot be in the past.";
    }

    if (endZoned.isBefore(startZoned)) {
      newErrors.end = "End date/time cannot be before start date/time.";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      profiles,
      timezone,
      start: startZoned.utc().toISOString(),
      end: endZoned.utc().toISOString(),
    };

    try {
      const url = editEvent
        ? `${import.meta.env.VITE_API_URL}/api/events/updateEvent/${editEvent._id}`
        : `${import.meta.env.VITE_API_URL}/api/events/createEvent`;

      const res = await fetch(url, {
        method: editEvent ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save event");

      setErrors({});
      if (refresh) refresh(); 

      if (!editEvent) {
        setProfiles([]);
        setStart("");
        setEnd("");
        setTimezone("Asia/Kolkata");
      }
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white p-4 rounded-lg shadow-md transition-all ${
        !isOpen ? "hidden" : ""
      }`}
    >
      {errors.submit && (
        <p className="text-red-500 font-semibold">{errors.submit}</p>
      )}

      <label className="font-semibold">Profiles</label>
      <MultiProfileSelect
        users={users}
        value={profiles}
        onChange={setProfiles}
      />
      {errors.profiles && (
        <p className="text-red-500 text-sm">{errors.profiles}</p>
      )}

      <label className="font-semibold">Timezone</label>
      <select
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        className="border p-2 rounded bg-white w-full"
      >
        <option value="Asia/Kolkata">India (Asia/Kolkata)</option>
        <option value="America/New_York">ET (America/New_York)</option>
      </select>

      <label className="font-semibold">Start Date & Time</label>
      <input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="border p-2 rounded w-full"
      />
      {errors.start && (
        <p className="text-red-500 text-sm">{errors.start}</p>
      )}

      <label className="font-semibold">End Date & Time</label>
      <input
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="border p-2 rounded w-full"
      />
      {errors.end && (
        <p className="text-red-500 text-sm">{errors.end}</p>
      )}

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={submit}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-800 transition flex-1"
        >
          {editEvent ? "Update Event" : "Create Event"}
        </button>
      </div>
    </div>
  );
}
