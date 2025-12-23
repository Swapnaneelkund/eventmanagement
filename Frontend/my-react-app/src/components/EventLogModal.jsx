import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function EventLogModal({ eventId, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/getEventLogs/${eventId}`);
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, [eventId]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[400px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Event Update History</h2>

        {logs.length === 0 && <p>No update history found.</p>}

        {logs.map((log) => (
          <div key={log._id} className="border-b py-2">
            <p className="text-xs text-gray-500">
              {dayjs(log.timestamp).format("MMM DD, YYYY [at] hh:mm A")}
            </p>
            <p className="text-sm mt-1">
              {log.before.profiles?.map(p => p.name).join(", ") !== log.after.profiles?.map(p => p.name).join(", ")
                ? `Profiles changed to: ${log.after.profiles?.map(p => p.name).join(", ")}`
                : `Other details updated`}
            </p>
          </div>
        ))}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="border px-4 py-1 rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
