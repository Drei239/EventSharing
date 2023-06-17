import { createSlice, createAction } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  imgSelect: null,
};

export const openModal = createAction("openModal");
export const closeModal = createAction("closeModal");
export const saveImg = createAction("selectImg", function prepare(img) {
  return { payload: img };
});
export const removeImg = createAction("remove-Img");
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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
export default userSlice;
