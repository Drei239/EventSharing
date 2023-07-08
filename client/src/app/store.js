import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import eventSlice from "../features/events/eventSlice";
import CategorySlice from "../features/category/categorySlice";
import userReducer from "../features/user/userSlice";
import orderReducer from "../features/order/orderSlice";
import notifySlice from "../features/notification/notifySlice";
import commentSlice from "../features/comment/commentSlice";
import socketMiddleware from "../middleware/socketMiddleware";

const store = configureStore({
  reducer: {
    event: eventSlice.reducer,
    category: CategorySlice.reducer,
    user: userReducer,
    order: orderReducer.reducer,
    notify: notifySlice.reducer,
    comment: commentSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(thunkMiddleware)
      .concat(socketMiddleware("http://localhost:3002")),
});
export default store;
