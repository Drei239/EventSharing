import { createAsyncThunk, createAction, createSlice } from "@reduxjs/toolkit";
import categoryService from "./categoryService";
const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
  message: "",
  isSuccess: false,
};
export const getAllCategory = createAsyncThunk("category/getAll", async () => {
  try {
    return await categoryService.getAllCategory();
  } catch (err) {
    console.log(err);
  }
});
const CategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCategory.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = action.payload?.data;
      state.isSuccess = true;
    });
    builder.addCase(getAllCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.message;
    });
  },
});
export default CategorySlice;
