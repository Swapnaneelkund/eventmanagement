import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";
import MultiProfileSelect from "./MultiProfileSelect.jsx";
import { setEvents } from "../Slice/EventSlice.js";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

export default function EditEvent({ event, onClose }) {
  const users = useSelector((s) => s.user.user);
  const events = useSelector((s) => s.event);
  const dispatch = useDispatch();

  const [profiles, setProfiles] = useState(event.profiles.map(p => p._id));
  const [timezone, setTimezone] = useState(event.timezone);
  const [start, setStart] = useState(
    dayjs.utc(event.startAt).tz(event.timezone).format("YYYY-MM-DDTHH:mm")
  );
  const [end, setEnd] = useState(
    dayjs.utc(event.endAt).tz(event.timezone).format("YYYY-MM-DDTHH:mm")
  );
  const [errors, setErrors] = useState({});

  const submit = async () => {
    const startZoned = dayjs.tz(start, timezone);
    const endZoned = dayjs.tz(end, timezone);

    const payload = {
      profiles,
      timezone,
      start: startZoned.utc().toISOString(),
      end: endZoned.utc().toISOString(),
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/updateEvent/${event._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to update event");

      const updated = await res.json();
      console.log(updated);

      const updatedEvents = events.map(e =>
        e._id === updated._id ? updated : e
      );
      dispatch(setEvents(updatedEvents));

      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-lg font-bold mb-4">Edit Event</h2>

        <label className="font-semibold">Profiles</label>
        <MultiProfileSelect
          users={users}
          value={profiles}
          onChange={setProfiles}
        />

        <label className="font-semibold mt-3 block">Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="Asia/Kolkata">India (Asia/Kolkata)</option>
          <option value="America/New_York">ET (America/New_York)</option>
        </select>

        <label className="font-semibold mt-3 block">Start</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <label className="font-semibold mt-3 block">End</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {errors.submit && (
          <p className="text-red-500 mt-2">{errors.submit}</p>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="border px-4 py-1 rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-purple-600 text-white px-4 py-1 rounded"
          >
            Update Event
          </button>
        </div>
      </div>
    </div>
  );
}
