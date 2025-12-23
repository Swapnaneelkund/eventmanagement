import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setUsers } from "../Slice/UserSlice.js";

export default function UserSelect({
  users,
  selectedUser,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [newUser, setNewUser] = useState("");
  const ref = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = async () => {
    if (!newUser.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/createUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUser.trim() }),
      });

      const createdUser = await res.json();

      dispatch(setUsers([...users, createdUser]));

      onSelect(createdUser);

      setNewUser("");
      setSearch("");
      setOpen(false);
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  return (
    <div className="relative w-64" ref={ref}>
      <div
        onClick={() => setOpen((p) => !p)}
        className="border px-3 py-2 rounded bg-white cursor-pointer flex justify-between items-center"
      >
        <span>{selectedUser?.name || "Select User"}</span>
        <span className="text-gray-500">▾</span>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-1 rounded"
            />
          </div>

          <div className="max-h-40 overflow-y-auto">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => {
                  onSelect(u);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-purple-100 ${
                  selectedUser?._id === u._id
                    ? "bg-purple-500 text-white"
                    : ""
                }`}
              >
                {u.name}
              </div>
            ))}

            {!filteredUsers.length && (
              <p className="text-sm text-gray-500 p-2">No users found</p>
            )}
          </div>

          <div className="p-2 border-t flex gap-2 items-center">
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              placeholder="Add new user"
              className="flex-1 border p-1 rounded min-w-0"
            />
            <button
              onClick={handleAddUser}
              className="bg-purple-500 text-white px-3 py-1 rounded whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
