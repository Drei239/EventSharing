import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "./commentService";
const initialState = {
  comments: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  isSuccessCreate: false,
  isSuccessReply: false,
  reply: null,
  replyContent: "",
  message: "",
  notifyComment: null,
};
export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ eventId, title, comment, userInfo }, { rejectWithValue }) => {
    try {
      const data = await commentService.createComment(eventId, title, comment);

      return {
        comment: { ...data.data.newComment, creator: userInfo },
        notify: data.data.notify,
      };
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
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await commentService.deleteComment(id);
      console.log("###", res);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const replyComment = createAsyncThunk(
  "comment/reply",
  async ({ id, title, comment }, { rejectWithValue }) => {
    try {
      const res = await commentService.replyComment(id, title, comment);
      return { data: res?.data, replyContent: comment };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const likeOrUnlikeComment = createAsyncThunk(
  "comment/likeComment",
  async ({ commentId, replyId, userInfo }, { rejectWithValue }) => {
    try {
      const res = await commentService.likeOrUnLikeComment(commentId, replyId);
      return { commentId, replyId, userInfo };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const deleteReplyComment = createAsyncThunk(
  "comment/deleteReplyComment",
  async ({ commentId, replyId }, { rejectWithValue }) => {
    try {
      const res = await commentService.deleteReplyComment(commentId, replyId);
      return { commentId, replyId };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const updateReplyComment = createAsyncThunk(
  "comment/updateReplyComment",
  async (
    { commentId, replyId, title, comment, userInfo },
    { rejectWithValue }
  ) => {
    try {
      const res = await commentService.updateReplyComment(
        commentId,
        replyId,
        title,
        comment
      );
      return { commentId, replyId, title, comment, userInfo };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const receiveComment = createAction(
  "receive_comment",
  function prepare(data) {
    return { payload: data };
  }
);
export const receiveReplyComment = createAction(
  "receive_comment_reply",
  function prepare(data) {
    return { payload: data };
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
        state.comments = [action.payload.comment, ...state.comments];
        console.log(action.payload.notify);
        state.notifyComment = action.payload.notify;
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
        const data = action.payload.data;
        state.isLoading = false;
        state.isSuccess = true;
        const commentUpdateIndex = state.comments.findIndex(
          (item) => item._id === data._id
        );
        state.comments[commentUpdateIndex] = data;
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
        state.isSuccessReply = false;
      })

      .addCase(replyComment.fulfilled, (state, action) => {
        const data = action.payload?.data;
        state.isLoading = false;
        state.isSuccessReply = true;

        const commentUpdateIndex = state.comments.findIndex(
          (item) => item._id === data.comment._id
        );
        state.comments[commentUpdateIndex] = data.comment;
        state.reply = data.comment;
        state.notifyComment = data.notify;
        state.replyContent = action.payload.replyContent;
      })
      .addCase(replyComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(likeOrUnlikeComment.pending, (state) => {
        state.isLoading = false;
        state.isError = false;
      })

      .addCase(likeOrUnlikeComment.fulfilled, (state, action) => {
        const data = action.payload;
        state.isLoading = false;
        const commentUpdate = state.comments.find(
          (item) => item._id === data.commentId
        );
        if (data.replyId) {
          const replyUpdateComment = commentUpdate.reply.find(
            (item) => item._id === data.replyId
          );
          if (
            replyUpdateComment.likeList.find(
              (item) => item.user == data.userInfo
            )
          ) {
            replyUpdateComment.likeList = replyUpdateComment.likeList.filter(
              (list) => list.user !== data.userInfo
            );
            replyUpdateComment.likeCount -= 1;
          } else {
            replyUpdateComment.likeCount += 1;
            replyUpdateComment.likeList = [
              { user: data.userInfo },
              ...replyUpdateComment.likeList,
            ];
          }
        } else {
          if (
            commentUpdate.likeList.find((item) => item.user === data.userInfo)
          ) {
            commentUpdate.likeList = commentUpdate.likeList.filter(
              (list) => list.user !== data.userInfo
            );
            commentUpdate.likeCount -= 1;
          } else {
            commentUpdate.likeList = [
              { user: data.userInfo },
              ...commentUpdate.likeList,
            ];
            commentUpdate.likeCount += 1;
          }
        }
      })
      .addCase(likeOrUnlikeComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(deleteReplyComment.pending, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(deleteReplyComment.fulfilled, (state, action) => {
        const data = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        const findIndex = state.comments.findIndex(
          (comment) => comment._id == data.commentId
        );
        state.comments[findIndex].reply = state.comments[
          findIndex
        ].reply.filter(
          (item) => item._id.toString() !== data.replyId.toString()
        );
      })
      .addCase(deleteReplyComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder
      .addCase(updateReplyComment.pending, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
      })

      .addCase(updateReplyComment.fulfilled, (state, action) => {
        const data = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
        const comment = state.comments.find(
          (item) => item._id === data.commentId
        );
        comment.reply.find((item) => item._id === data.replyId).comment =
          data.comment;
      })
      .addCase(updateReplyComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      });
    builder.addCase(receiveComment, (state, action) => {
      if (
        !state.comments ||
        !state.comments.find((comment) => comment._id === action.payload._id)
      ) {
        state.comments = [action.payload, ...state.comments];
      }
    });
    builder.addCase(receiveReplyComment, (state, action) => {
      const id = action.payload._id;
      const findIndex = state.comments.findIndex((item) => item._id == id);
      state.comments[findIndex] = action.payload;
    });
  },
});
export default commentSlice;
