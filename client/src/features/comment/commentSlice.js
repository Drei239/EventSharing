import {
	createSlice,
	createAsyncThunk,
	createAction,
} from '@reduxjs/toolkit';
import CommentService from './commentService';

const initialState = {
	comment: [],
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

export const newCreateComment = createAsyncThunk(
	"comment/createComment",
	async (eventId, { rejectWithValue }) => {
		try {
			const comment = await CommentService.createNewComment(eventId);
			return comment;
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
			.addCase(newCreateComment.pending, (state) => {
				state.isLoading = true;
				state.isSuccessCreate = false;
				state.isErrorEmail = false;
			})
			.addCase(newCreateComment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccessCreate = true;
			})
			.addCase(newCreateComment.rejected, (state, action) => {
				state.message = action.payload;
				state.isError = true;
				state.isLoading = false;
			});
		}
	})