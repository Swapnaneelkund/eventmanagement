import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "user",
  initialState: { user: [] },
  reducers: {
    setUsers: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUsers } = slice.actions;
export default slice.reducer;
