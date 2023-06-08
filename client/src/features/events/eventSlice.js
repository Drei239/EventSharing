import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createAction,
} from "@reduxjs/toolkit";
import eventService from "./eventService";
export const getEvent = createAsyncThunk(
  "event/getAllEvent",
  async (search) => {
    try {
      return await eventService.getAllEvent(search);
    } catch (err) {
      console.log(err);
    }
  }
);
const initialState = {
  events: [],
  filter: {
    category: "",
    sort: "",
    fee: "",
    type: "",
    location: "",
    date: null,
    page: 1,
  },
  countDocument: 1,
  isLoading: true,
  isError: true,
  isSuccess: true,
  message: "",
};
export const handleChangeEvents = createAction(
  "changeEvents",
  function prepare(filter) {
    return {
      payload: filter,
    };
  }
);
const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEvent.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getEvent.fulfilled, (state, action) => {
      state.events = action.payload.data;
      state.countDocument = action.payload.totalCount;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getEvent.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(handleChangeEvents, (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    });
  },
});
export default eventSlice;
