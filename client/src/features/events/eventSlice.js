import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createAction,
} from "@reduxjs/toolkit";
import eventService from "./eventService";
export const getEvent = createAsyncThunk("event/getAllEvent", async () => {
  try {
    return await eventService.getAllEvent();
  } catch (err) {
    console.log(err);
  }
});
const initialState = {
  events: [],
  isLoading: true,
  isError: true,
  isSuccess: true,
  message: "",
};
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEvent.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getEvent.fulfilled, (state, action) => {
      state.events = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getEvent.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
  },
});
export default eventSlice;
