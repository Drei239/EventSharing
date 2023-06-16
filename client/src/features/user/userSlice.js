import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customFetch from '../../utils/axios.config';

const initialState = {
  userInfo: {},
  isLoading: true,
  isLogin: false,
};

export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async (_, thunkAPI) => {
    try {
      const resp = await customFetch({
        method: 'get',
        url: '/users/profile',
      });
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối với máy chủ');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
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
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
