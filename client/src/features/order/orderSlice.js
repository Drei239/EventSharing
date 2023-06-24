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
      const orders = await orderService.updateOneOrder(id, status);
      return orders;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const updateRequest = createAsyncThunk(
  "order/updateRequest",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await orderService.updateRequest(id, data);
      return data;
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
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getOrderbyId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
        state.countDocument = action.payload?.countDocument;
      })
      .addCase(getOrderbyId.rejected, (state, action) => {
        state.isLoading = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(updateOneOrder.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
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
    builder
      .addCase(updateRequest.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        action.payload.map((item) => {
          const index = state.orders.findIndex(
            (order) => order._id === item.orderId
          );
          state.orders[index].isPaid = item.isPaid;
          state.orders[index].isRefund = item.isRefund;
          state.orders[index].isJoined = item.isJoined;
        });
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload?.message;
      });
  },
});
export default orderSlice;
