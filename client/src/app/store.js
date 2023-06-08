import { configureStore } from "@reduxjs/toolkit";
import eventSlice from "../features/events/eventSlice";
import CategorySlice from "../features/category/categorySlice";
const store = configureStore({
  reducer: { event: eventSlice.reducer, category: CategorySlice.reducer },
});
export default store;
