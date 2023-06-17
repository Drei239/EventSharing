import { configureStore } from "@reduxjs/toolkit";
import eventSlice from "../features/events/eventSlice";
import CategorySlice from "../features/category/categorySlice";
import userSlice from "../features/user/userSlice";
const store = configureStore({
  reducer: {
    event: eventSlice.reducer,
    category: CategorySlice.reducer,
    user: userSlice.reducer,
  },
});
export default store;
