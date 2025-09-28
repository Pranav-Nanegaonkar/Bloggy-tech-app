import {
  createAction,
  createActionCreatorInvariantMiddleware,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import {
  resetErrorAction,
  resetSuccessAction,
} from "../globalSlice/globalSlices";
const baseurl = "http://localhost:3000/api/v1";
const initialState = {
  loading: false,
  error: null,
  success: false,
  comments: [],
  comment: null,
};

//! Create Comment Action
export const createCommentAction = createAsyncThunk(
  "comments/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      //make request
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${baseurl}/comment/${payload?.postId}`,
        {
          message: payload?.message,
        },
        config
      );
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//! Comment Slice
const commentSlice = createSlice({
  name: "comments",
  initialState,
  extraReducers: (builder) => {
    //? Create Comment
    builder.addCase(createCommentAction.pending, (state, action) => {
      console.log(" comment create pending");
      state.loading = true;
    });
    builder.addCase(createCommentAction.fulfilled, (state, action) => {
      console.log(" comment create fulfilled");
      state.loading = false;
      state.success = true;
      state.comment = action.payload;
      console.log(action.payload);
    });
    builder.addCase(createCommentAction.rejected, (state, action) => {
      console.log(" comment create rejected");
      state.loading = false;
      state.success = false;
      state.error = action.payload;
      console.log(action.payload);
    });

    //! Reset Error and success action
    builder.addCase(resetErrorAction, (state, action) => {
      state.error = null;
    });
    builder.addCase(resetSuccessAction, (state, action) => {
      state.success = false;
    });
  },
});

//Generate Reducer
const commentReducer = commentSlice.reducer;
export default commentReducer;
