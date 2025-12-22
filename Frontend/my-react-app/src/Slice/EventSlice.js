import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "event",
  initialState:[],
  reducers: {
    setEvent: (_, action) => action.payload,
    setEvents: (_, action) => action.payload,
  },
});

export const { setEvent, setEvents } = slice.actions;
export default slice.reducer;
