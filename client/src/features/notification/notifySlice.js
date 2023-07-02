import { createAsyncThunk, createAction, createSlice } from "@reduxjs/toolkit";
import notifyService from "./notifyService";
const initialState = {
  notify: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
};
export const getAllNotify = createAsyncThunk(
  "notify/getAllNotify",
  async (_, { rejectWithValue }) => {
    try {
      const notify = await notifyService.getAllNotify();
      return notify;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
const receiveOrder = createAction("RECEIVE_ORDER", function prepare(data) {
  return {
    payload: data,
  };
});
const notifySlice = createSlice({
  name: "notifycation",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotify.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })

      .addCase(getAllNotify.fulfilled, (state, action) => {
        state.notify = action.payload?.data;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getAllNotify.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder.addCase(receiveOrder, (state, action) => {
      state.notify = action.payload;
    });
  },
});
export default notifySlice;
