import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createAction,
} from "@reduxjs/toolkit";
import eventService from "./eventService";
export const getEvent = createAsyncThunk(
  "event/getAllEvent",
  async (search, { rejectWithValue }) => {
    try {
      return await eventService.getAllEvent(search);
    } catch (err) {
      rejectWithValue(err);
    }
  }
);
export const getHighlightEvent = createAsyncThunk(
  "event/getHighlight",
  async (search, { rejectWithValue }) => {
    try {
      return await eventService.getHighlightEvent();
    } catch (err) {
      rejectWithValue(err);
    }
  }
);
export const getNewEvent = createAsyncThunk(
  "event/getNewEvent",
  async (page, { rejectWithValue }) => {
    try {
      return await eventService.getNewEvent(page);
    } catch (err) {
      rejectWithValue(err);
    }
  }
);
const initialState = {
  events: [],
  newEvents: [],
  highlightEvent: [],
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
      state.events = action.payload?.data;
      state.countDocument = action.payload?.totalCount;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getEvent.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(getHighlightEvent.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getHighlightEvent.fulfilled, (state, action) => {
      state.highlightEvent = action.payload?.data;
      // state.countDocument = action.payload.totalCount;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getHighlightEvent.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.message = action.error;
    });
    builder.addCase(getNewEvent.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getNewEvent.fulfilled, (state, action) => {
      state.newEvents = action.payload?.data;
      state.countDocument = action.payload.totalCount;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getNewEvent.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.message = action.error;
    });
    builder.addCase(handleChangeEvents, (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    });
  },
});
export default eventSlice;
