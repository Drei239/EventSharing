import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import customFetch from "../../utils/axios.config";
import userService from "./userService";

const initialState = {
  userInfo: {},
  isLoading: true,
  isLogin: false,
  message: "",
  open: false,
  imgSelect: null,
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
      return resp.data;
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
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLogin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.isLoading = true;
        state.isLogin = false;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogin = true;
        state.userInfo = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isLogin = false;
      });
    builder.addCase(updateInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userInfo = action.payload?.data;
    });
    builder.addCase(updateInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.message = action.error;
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
