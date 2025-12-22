import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";
import EditEvent from "./EditEvent.jsx";
import EventLogModal from "./EventLogModal.jsx"; 

dayjs.extend(utc);
dayjs.extend(tz);

export default function Events({ events = [] }) {
  const [userTZ, setUserTZ] = useState("UTC");
  const [editingEvent, setEditingEvent] = useState(null);
  const [logEventId, setLogEventId] = useState(null); 
  useEffect(() => {
    if (events.length && events[0]?.timezone) {
      setUserTZ(events[0].timezone);
    }
  }, [events]);

  return (
    <div className="flex flex-col gap-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
      <h1 className="text-xl font-bold">Events</h1>

      <label className="font-semibold">View in Timezone</label>
      <select
        value={userTZ}
        onChange={(e) => setUserTZ(e.target.value)}
        className="border p-2 rounded w-full bg-white"
      >
        <option value="Asia/Kolkata">India (Asia/Kolkata)</option>
        <option value="America/New_York">ET (America/New_York)</option>
      </select>

      <section className="mt-4 flex flex-col gap-4">
        {events?.map((e) => (
          <div
            key={e._id}
            className="border p-4 rounded bg-white shadow-sm flex flex-col gap-2"
          >
            <p className="font-semibold">
              Profiles: {(e.profiles || []).map((p) => p.name).join(", ")}
            </p>

            <p>
              Start:{" "}
              {dayjs.utc(e.startAt).tz(userTZ).format("MMM DD YYYY hh:mm A")}
            </p>
            <p>
              End:{" "}
              {dayjs.utc(e.endAt).tz(userTZ).format("MMM DD YYYY hh:mm A")}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Created in: {e.timezone}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <button
                onClick={() => setEditingEvent(e)}
                className="border px-4 py-2 rounded hover:bg-gray-100 w-full sm:w-auto"
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => setLogEventId(e._id)}
                className="border px-4 py-2 rounded hover:bg-gray-100 w-full sm:w-auto"
              >
                📄 View Logs
              </button>
            </div>
          </div>
        ))}
      </section>

      {editingEvent && (
        <EditEvent
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {logEventId && (
        <EventLogModal
          eventId={logEventId}
          onClose={() => setLogEventId(null)}
        />
      )}
    </div>
  );
}
