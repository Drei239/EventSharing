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
export const updateOneOrder = createAsyncThunk(
  "order/updateOneOrder",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await orderService.updateOneOrder(id, status);
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
    builder
      .addCase(updateOneOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOneOrder.fulfilled, (state, action) => {
        const data = action.payload?.data;
        state.isLoading = false;
        const index = state.orders.findIndex(
          (order) => order._id === data?._id
        );
        state.orders[index] = data;
        state.isSuccess = true;
      })
      .addCase(updateOneOrder.rejected, (state, action) => {
        state.message = action.payload?.message;
        state.isLoading = false;
        state.isError = true;
      });
  },
});
export default orderSlice;
