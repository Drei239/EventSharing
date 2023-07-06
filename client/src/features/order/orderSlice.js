import { createAsyncThunk, createAction, createSlice } from "@reduxjs/toolkit";
import { sendNotifyNewOrder } from "../action";
import orderService from "./orderService";
const initialState = {
  orders: [],
  open: false,
  typeSend: "",
  isLoading: false,
  isError: false,
  message: "",
  isSuccess: false,
  countDocument: 0,
  isSuccessEmail: false,
  isErrorEmail: false,
  isSuccessCreate: false,
};
export const newCreateOrder = createAsyncThunk(
  "order/createOrder",
  async (eventId, { rejectWithValue }) => {
    try {
      const order = await orderService.createNewOrder(eventId);
      return order;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
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
export const sendEmailSelect = createAsyncThunk(
  "order/sendEmailSelect",
  async ({ content, subject, ordersId }, { rejectWithValue }) => {
    try {
      return await orderService.sendEmail({ content, subject, ordersId });
    } catch (err) {
      rejectWithValue(err);
    }
  }
);
export const sendEmailAllOrder = createAsyncThunk(
  "order/sendEmailAllOrder",
  async ({ content, subject, eventId }, { rejectWithValue }) => {
    try {
      return await orderService.sendEmailAllOrder({
        content,
        subject,
        eventId,
      });
    } catch (err) {
      rejectWithValue(err);
    }
  }
);
export const openModalSendEmail = createAction(
  "openModalSendEmail",
  function frepare(type) {
    return {
      payload: type,
    };
  }
);
export const updateCancelEvent = createAction("updateCancelEventSuccesfully");
export const closeModalSendEmail = createAction("closeModalSendEmail");
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
        state.orders = action.payload?.data;
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
    builder
      .addCase(sendEmailSelect.pending, (state) => {
        state.isLoading = true;
        state.isSuccessEmail = false;
        state.isErrorEmail = false;
      })
      .addCase(sendEmailSelect.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccessEmail = true;
      })
      .addCase(sendEmailSelect.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
        state.isErrorEmail = true;
      });
    builder
      .addCase(sendEmailAllOrder.pending, (state) => {
        state.isLoading = true;
        state.isSuccessEmail = false;
        state.isErrorEmail = false;
      })
      .addCase(sendEmailAllOrder.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccessEmail = true;
      })
      .addCase(sendEmailAllOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isErrorEmail = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(newCreateOrder.pending, (state) => {
        state.isLoading = true;
        state.isSuccessCreate = false;
        state.isError = false;
      })
      .addCase(newCreateOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccessCreate = true;
      })
      .addCase(newCreateOrder.rejected, (state, action) => {
        state.message = action.payload?.message;
        state.isError = true;
        state.isLoading = false;
      });

    builder.addCase(openModalSendEmail, (state, action) => {
      state.open = true;
      state.typeSend = action.payload;
    });
    builder.addCase(closeModalSendEmail, (state) => {
      state.open = false;
    });
    builder.addCase(updateCancelEvent, (state) => {
      state.orders =
        state.orders.length > 0 &&
        state.orders.reduce((arr, order) => {
          return [
            ...arr,
            { ...order, event: { ...order.event, status: "Canceled" } },
          ];
        }, []);
    });
  },
});
export default orderSlice;
