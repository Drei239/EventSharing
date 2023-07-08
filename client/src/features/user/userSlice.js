import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import customFetch from "../../utils/axios.config";
import userService from "./userService";

const initialState = {
  userInfo: {},
  userHighlight: [],
  isLoading: true,
  isLogin: false,
  message: "",
  isSuccess: false,
  isSuccess2: false,
  open: false,
  imgSelect: null,
  isError: false,
};
export const openModal = createAction("openModal");
export const closeModal = createAction("closeModal");
export const saveImg = createAction("selectImg", function prepare(img) {
  return { payload: img };
});
export const removeImg = createAction("remove-Img");
export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (_, thunkAPI) => {
    try {
      const resp = await customFetch({
        method: "get",
        url: "/users/profile",
      });
      return resp;
    } catch (error) {
      return thunkAPI.rejectWithValue("Lỗi kết nối với máy chủ");
    }
  }
);
export const updateInfo = createAsyncThunk(
  "user/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await userService.updateUser({ id, data });
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await userService.deleteUser(id, data);
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getHighlightUser = createAsyncThunk(
  "user/getHighlight",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.getHighlightUser();
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "user/forgot-password",
  async (email, { rejectWithValue }) => {
    try {
      const res = await userService.forgotPasswordUser(email);
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "user/reset-password",
  async ({ userId, token, newPassword }, { rejectWithValue }) => {
    try {
      const res = await userService.resetPassword(userId, token, newPassword);
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = {};
      state.isLogin = false;
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogin = true;
        state.userInfo = action.payload.data;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isLogin = false;
      });
    builder
      .addCase(updateInfo.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.isSuccess = false;
      })
      .addCase(updateInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload?.data;
        state.isSuccess = true;
      })
      .addCase(updateInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.isSuccess = false;
      });
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.isSuccess2 = false;
        state.isError = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
        state.userInfo = {};
        state.isLogin = false;
        state.isSuccess2 = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.isError = true;
      });
    builder
      .addCase(getHighlightUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHighlightUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userHighlight = action.payload?.data;
      })
      .addCase(getHighlightUser.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      });
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder.addCase(openModal, (state) => {
      state.open = true;
    });
    builder.addCase(closeModal, (state) => {
      state.open = false;
    });
    builder.addCase(saveImg, (state, action) => {
      state.imgSelect = action.payload;
      state.open = false;
    });
    builder.addCase(removeImg, (state) => {
      state.imgSelect = null;
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
