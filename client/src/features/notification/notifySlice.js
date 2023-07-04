import { createAsyncThunk, createAction, createSlice } from "@reduxjs/toolkit";
import notifyService from "./notifyService";
const initialState = {
  notify: [],
  notifySocket: null,
  countDocument: 0,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};
export const getAllNotify = createAsyncThunk(
  "notify/getAllNotify",
  async ({ page, notifyTypeRead }, { rejectWithValue }) => {
    try {
      const notify = await notifyService.getAllNotify(page, notifyTypeRead);
      return notify;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const markAllNotify = createAsyncThunk(
  "notify/markAllNotify",
  async (_, { rejectWithValue }) => {
    try {
      const notify = await notifyService.markAllNotify();
      return notify;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const markByIdNotify = createAsyncThunk(
  "notify/markById",
  async (id, { rejectWithValue }) => {
    try {
      const notify = await notifyService.markNotifyById(id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const confirmNewNotify = createAsyncThunk(
  "notify/confirm-new",
  async (_, { rejectWithValue }) => {
    try {
      const notify = await notifyService.confirmNewNotify();
      return notify;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const receiveNotify = createAction(
  "receive_notify",
  function prepare(notify) {
    return {
      payload: notify,
    };
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
        state.countDocument = action.payload?.countDocument;
      })
      .addCase(getAllNotify.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(markAllNotify.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markAllNotify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notify = state.notify.reduce((arr, item) => {
          return [...arr, { ...item, isReadMessage: true }];
        }, []);
      })
      .addCase(markAllNotify.rejected, (state, action) => {
        state.message = action.payload?.message;
        state.isLoading = false;
        state.isError = true;
      });
    builder
      .addCase(markByIdNotify.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markByIdNotify.fulfilled, (state, action) => {
        const data = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        const notifyUpdateIndex = state.notify.findIndex(
          (item) => item._id === data
        );
        state.notify[notifyUpdateIndex].isReadMessage = true;
      })
      .addCase(markByIdNotify.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(confirmNewNotify.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmNewNotify.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.countDocument = 0;
      })
      .addCase(confirmNewNotify.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });

    builder.addCase(receiveNotify, (state, action) => {
      state.notify = [...state.notify, action.payload];
      state.countDocument = state.countDocument + 1;
      state.notifySocket = action.payload;
    });
  },
});
export default notifySlice;
