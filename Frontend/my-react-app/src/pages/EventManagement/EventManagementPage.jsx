import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateEventForm from "../../components/CreateEventForm.jsx";
import EventsList from "../../components/EventsList.jsx";
import UserSelect from "../../components/UserSelect.jsx";

import { setEvent } from "../../Slice/EventSlice.js";
import { setUsers } from "../../Slice/UserSlice.js";

function EventManagementPage() {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.user.user);
  const events = useSelector((state) => state.event);

  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(true);
  const [editEvent, setEditEvent] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`$${import.meta.env.VITE_API_URL}/api/users/getUsers`);
        const data = await res.json();
        dispatch(setUsers(data));

        if (data.length) {
          setSelectedUser(data[0]);
          fetchEvents(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    fetchUsers();
  }, [dispatch]);

  const fetchEvents = async (userId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/getEvent/${userId}`
      );
      const data = await res.json();
      
      dispatch(setEvent(data || []));
    } catch (err) {
      console.error("Failed to fetch events", err);
      dispatch(setEvent([]));
    }
  };

  const handleAddUser = async (name) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const createdUser = await res.json();
    dispatch(setUsers([...users, createdUser]));
    setSelectedUser(createdUser);
    fetchEvents(createdUser._id);
  };

  return (
    <div className="p-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h1 className="text-2xl font-bold">Event Management</h1>

        <UserSelect
          users={users}
          selectedUser={selectedUser}
          onSelect={(user) => {
            setSelectedUser(user);
            fetchEvents(user._id);
          }}
          onAdd={handleAddUser}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 bg-gray-200 p-4 rounded-lg">
        <CreateEventForm
          isOpen={open}
          editEvent={editEvent}
          onClose={() => setOpen(false)}
          refresh={() => selectedUser && fetchEvents(selectedUser._id)}
        />

        <EventsList
          events={events}
          onEdit={(event) => {
            setEditEvent(event);
            setOpen(true);
          }}
        />
      </div>
    </div>
  );
}

export default EventManagementPage;
