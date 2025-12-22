import { useState } from "react";

function MultiProfileSelect({ users, value, onChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const selectedNames = users
    .filter((u) => value.includes(u._id))
    .map((u) => u.name)
    .join(", ");

  return (
    <div className="relative">
      <div
        onClick={() => setOpen((o) => !o)}
        className="border p-2 rounded bg-white cursor-pointer min-h-[40px]"
      >
        {selectedNames || (
          <span className="text-gray-400">Select profiles</span>
        )}
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full border rounded bg-white shadow max-h-48 overflow-y-auto">
          {users.map((u) => {
            const selected = value.includes(u._id);
            return (
              <div
                key={u._id}
                onClick={() => toggle(u._id)}
                className={`p-2 cursor-pointer ${
                  selected
                    ? "bg-blue-200 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {u.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MultiProfileSelect;
