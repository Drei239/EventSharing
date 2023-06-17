import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import customFetch from '../../utils/axios.config';
export const openModal = createAction('openModal');
export const closeModal = createAction('closeModal');
export const saveImg = createAction('selectImg', function prepare(img) {
  return { payload: img };
});
export const removeImg = createAction('remove-Img');

const initialState = {
  userInfo: {},
  isLoading: true,
  isLogin: false,
  open: false,
  imgSelect: null,
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
