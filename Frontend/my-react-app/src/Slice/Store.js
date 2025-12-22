import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice.js";
import eventReducer from "./EventSlice.js";

export default configureStore({
  reducer: {
    user: userReducer,
    event: eventReducer,
  },
});
