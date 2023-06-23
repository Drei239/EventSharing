import { configureStore } from "@reduxjs/toolkit";
import eventSlice from "../features/events/eventSlice";
import CategorySlice from "../features/category/categorySlice";
import userReducer from "../features/user/userSlice";
import orderReducer from "../features/order/orderSlice";
const store = configureStore({
  reducer: {
    event: eventSlice.reducer,
    category: CategorySlice.reducer,
    user: userReducer,
    order: orderReducer.reducer,
  },
});
export default store;
