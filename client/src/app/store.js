import { configureStore } from "@reduxjs/toolkit";
import eventSlice from "../features/events/eventSlice";
const store = configureStore({
  reducer: { event: eventSlice.reducer },
});
export default store;
