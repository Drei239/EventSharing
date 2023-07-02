import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "./commentService";
const initialState = {
  comments: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isSuccessCreate: false,
  message: "",
};
export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ eventId, title, comment }, { rejectWithValue }) => {
    try {
      const data = await commentService.createComment(eventId, title, comment);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getCommentByEventId = createAsyncThunk(
  "comment/getCommentByEventId",
  async (eventId, { rejectWithValue }) => {
    try {
      const data = await commentService.getCommentByEventId(eventId);
      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const updateComment = createAsyncThunk(
  "comment/update",
  async ({ id, title, comment }, { rejectWithValue }) => {
    try {
      const updateComment = await commentService.updateComment(
        id,
        title,
        comment
      );
      return updateComment;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await commentService.deleteComment(id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const replyComment = createAsyncThunk(
  "commment/reply",
  async ({ id, title, comment }, { rejectWithValue }) => {
    try {
      const res = await commentService.replyComment(id, title, comment);
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.isLoading = false;
        state.isSuccessCreate = false;
        state.isError = false;
      })

      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccessCreate = true;
        state.comments = [...state.comments, action.payload?.data];
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(getCommentByEventId.pending, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(getCommentByEventId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload?.data;
      })
      .addCase(getCommentByEventId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(updateComment.pending, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
      })

      .addCase(updateComment.fulfilled, (state, action) => {
        const data = action.payload?.data;
        state.isLoading = false;
        state.isSuccess = true;
        const commentUpdateIndex = state.comments.findIndex(
          (item) => item._id === data._id
        );
        state.comments[commentUpdateIndex] = action.payload?.data;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        const id = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = state.comments.filter((item) => item._id !== id);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(replyComment.pending, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccessCreate = false;
      })

      .addCase(replyComment.fulfilled, (state, action) => {
        const data = action.payload?.data;
        state.isLoading = false;
        state.isSuccessCreate = true;
        const commentUpdateIndex = state.comments.findIndex(
          (item) => item._id === data._id
        );
        state.comments[commentUpdateIndex] = action.payload?.data;
      })
      .addCase(replyComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
  },
});
export default commentSlice;
