import {
  createSlice,
  createAsyncThunk,
  createAction,
} from '@reduxjs/toolkit';
import eventService from './eventService';
export const updateEvent = createAsyncThunk(
  'event/updateEvent',
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await eventService.updateUser({ id });
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getEvent = createAsyncThunk(
  'event/getAllEvent',
  async (search, { rejectWithValue }) => {
    try {
      return await eventService.getAllEvent(search);
    } catch (err) {
      rejectWithValue(err);
    }
  }
);
export const getEventById = createAsyncThunk(
  'event/get/:id',
  async (eventId, { rejectWithValue }) => {
    try {
      const getEvent = await eventService.getEventById(eventId);
      return getEvent;
    } catch (err) {
      rejectWithValue(err);
    } 
  }
);
export const getHighlightEvent = createAsyncThunk(
  'event/getHighlight',
  async (search, { rejectWithValue }) => {
    try {
      return await eventService.getHighlightEvent();
    } catch (err) {
      rejectWithValue(err);
    }
  }
);
export const getNewEvent = createAsyncThunk(
  'event/getNewEvent',
  async (page, { rejectWithValue }) => {
    try {
      return await eventService.getNewEvent(page);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getRegisterEvent = createAsyncThunk(
  'event/getRegisterEvent',
  async (_, { rejectWithValue }) => {
    try {
      return await eventService.getRegisteredEvent();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getJoinedEvent = createAsyncThunk(
  'event/getJoinedEvent',
  async (_, { rejectWithValue }) => {
    try {
      return await eventService.getJoinedEvent();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getAllEventofUser = createAsyncThunk(
  'event/getAllEventOfUser',
  async (data, { rejectWithValue }) => {
    try {
      return await eventService.getAllEventofUser(
        data?.id,
        data?.status,
        data?.keyword
      );
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
const initialState = {
  events: [],
  getEventById: [],
  newEvents: [],
  highlightEvent: [],
  joinedEvent: [],
  registeredEvent: [],
  filter: {
    category: '',
    sort: '',
    fee: '',
    type: '',
    location: '',
    date: null,
    page: 1,
  },
  countDocument: 1,
  isLoading: true,
  isError: true,
  isSuccess: true,
  message: '',
};
export const handleChangeEvents = createAction(
  'changeEvents',
  function prepare(filter) {
    return {
      payload: filter,
    };
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEvent.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getEvent.fulfilled, (state, action) => {
      state.events = action.payload?.data;
      state.countDocument = action.payload?.totalCount;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getEvent.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(updateEvent.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.events = action.payload.event;
    });
    builder.addCase(updateEvent.rejected, (state, action) => {
      state.isLoading = false;
      state.message = action.error;
    });
    builder.addCase(getEventById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getEventById.fulfilled, (state, action) => {
      state.getEventById = action.payload;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getEventById.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
    });
    builder.addCase(getHighlightEvent.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getHighlightEvent.fulfilled, (state, action) => {
      state.highlightEvent = action.payload?.data;
      // state.countDocument = action.payload.totalCount;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getHighlightEvent.rejected, (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.message = action.error;
    });
    builder.addCase(getNewEvent.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getNewEvent.fulfilled, (state, action) => {
      state.newEvents = action.payload?.data;
      state.countDocument = action.payload?.totalCount;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getNewEvent.rejected, (state, action) => {
      state.isError = true;
      state.newEvents = [];
      state.isLoading = false;
      state.message = action.error;
    });
    builder.addCase(getJoinedEvent.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getJoinedEvent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.joinedEvent = action.payload?.data;
    });
    builder.addCase(getJoinedEvent.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });
    builder.addCase(getRegisterEvent.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getRegisterEvent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.registeredEvent = action.payload?.data;
    });
    builder.addCase(getRegisterEvent.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload.message;
    });
    builder.addCase(getAllEventofUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllEventofUser.fulfilled, (state, action) => {
      state.events = action.payload?.data;
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(getAllEventofUser.rejected, (state, action) => {
      state.isLoading = false;
      state.message = action.payload?.message;
      state.isError = true;
    });
    builder.addCase(handleChangeEvents, (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    });
  },
});
export default eventSlice;
