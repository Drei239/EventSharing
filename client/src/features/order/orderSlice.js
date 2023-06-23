import { createAsyncThunk, createAction, createSlice } from "@reduxjs/toolkit";
import orderService from "./orderService";
const initialState = {
  orders: [],
  isLoading: false,
  isError: false,
  message: "",
  isSuccess: false,
  countDocument: 0,
};
export const getOrderbyId = createAsyncThunk(
  "order/getOrder",
  async ({ id, keyword, page, limit, sort, status }, { rejectWithValue }) => {
    try {
      return await orderService.getOrderbyId({
        id,
        keyword,
        page,
        limit,
        sort,
        status,
      });
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderbyId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderbyId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
        state.isSuccess = true;
        state.countDocument = action.payload?.countDocument;
      })
      .addCase(getOrderbyId.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = true;
        state.message = action.payload?.message;
      });
  },
});
export default orderSlice;
