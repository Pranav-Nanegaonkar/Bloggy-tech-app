import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
  posts: [],
  post: null,
};

//? Fetch public post
export const fetchPublicPostAction = createAsyncThunk(
  "posts/public",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("started public post fetching");
      const { data } = await axios.get(`${baseurl}/post/public`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//? Fetch private post
export const fetchPrivatePostAction = createAsyncThunk(
  "posts/private",
  async (payload, { rejectWithValue, getState }) => {
    try {
      console.log("started private post fetching");
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const { data } = await axios.get(`${baseurl}/post/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//? reset User action
export const resetPostAction = createAction("posts/reset");

//? Fetch single post
export const fetchSinglePostAction = createAsyncThunk(
  "posts/single",
  async (postId, { rejectWithValue }) => {
    try {
      console.log("started single post fetching");
      const { data } = await axios.get(`${baseurl}/post/${postId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//? Add post
export const addPostAction = createAsyncThunk(
  "posts/add",
  async (payload, { rejectWithValue, getState }) => {
    try {
      console.log("started addpost communication");
      //! Convert payload to FormData()
      const formData = new FormData();
      formData.append("title", payload?.title);
      formData.append("content", payload?.content);
      formData.append("categoryId", payload?.category);
      formData.append("file", payload?.image);
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const { data } = await axios.post(`${baseurl}/post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//? Delete post Action
export const deletePostAction = createAsyncThunk(
  "posts/delete",
  async (postId, { rejectWithValue, getState }) => {
    try {
      console.log("Starting DeletePost Communication");
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const { data } = await axios.delete(`${baseurl}/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);

      return data;
    } catch (error) {
      rejectWithValue(error?.response?.data);
    }
  }
);

//? update Post Action
export const updatePostAction = createAsyncThunk(
  "posts/update",
  async (payload, { rejectWithValue, getState }) => {
    try {
      console.log("started updatepost communication");
      //! Convert payload to FormData()
      const formData = new FormData();
      formData.append("title", payload?.title);
      formData.append("content", payload?.content);
      formData.append("categoryId", payload?.category);
      formData.append("file", payload?.image);
      const token = getState()?.users?.userAuth?.userInfo?.token;
      console.log(payload);

      const { data } = await axios.put(
        `${baseurl}/post/${payload?.postId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//? Like post
export const likePostAction = createAsyncThunk(
  "posts/like",
  async (postId, { rejectWithValue, getState }) => {
    try {
      console.log("started like post");
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const { data } = await axios.put(
        `${baseurl}/post/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response.data);
    }
  }
);

//? disLike post
export const dislikePostAction = createAsyncThunk(
  "posts/dislike",
  async (postId, { rejectWithValue, getState }) => {
    try {
      console.log("started dislike post");
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const { data } = await axios.put(
        `${baseurl}/post/dislike/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response.data);
    }
  }
);

//? clap post
export const clapPostAction = createAsyncThunk(
  "posts/clapPost",
  async (postId, { rejectWithValue, getState }) => {
    try {
      console.log("started clap post");
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const { data } = await axios.put(
        `${baseurl}/post/claps/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response.data);
    }
  }
);

//? viw post
export const viewPostAction = createAsyncThunk(
  "posts/view",
  async (postId, { rejectWithValue, getState }) => {
    try {
      console.log("started view post");
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const { data } = await axios.put(
        `${baseurl}/post/view/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response.data);
    }
  }
);

//? Post Slice
const postsSlice = createSlice({
  name: "posts",
  initialState,
  extraReducers: (builder) => {
    //fetch public post
    builder.addCase(fetchPublicPostAction.pending, (state, action) => {
      console.log("post Public pending");
      state.loading = true;
    });
    builder.addCase(fetchPublicPostAction.fulfilled, (state, action) => {
      console.log(" post Public fulfilled");
      state.loading = false;
      // state.success = true;
      state.error = null;
      state.posts = action.payload;
    });
    builder.addCase(fetchPublicPostAction.rejected, (state, action) => {
      console.log("post Public rejected");
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    //fetch Private post
    builder.addCase(fetchPrivatePostAction.pending, (state, action) => {
      console.log("post private pending");
      state.loading = true;
    });
    builder.addCase(fetchPrivatePostAction.fulfilled, (state, action) => {
      console.log(" post private fulfilled");
      state.loading = false;
      // state.success = true;
      state.error = null;
      state.posts = action.payload;
    });
    builder.addCase(fetchPrivatePostAction.rejected, (state, action) => {
      console.log("post private rejected");
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    //! Reset post
    builder.addCase(resetPostAction, (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.posts = [];
      state.post = null;
    });

    //fetch Single post
    builder.addCase(fetchSinglePostAction.pending, (state, action) => {
      console.log(" fetch Single post pending");
      state.loading = true;
    });
    builder.addCase(fetchSinglePostAction.fulfilled, (state, action) => {
      console.log(" fetch Single post fulfilled");
      state.loading = false;
      // state.success = true;
      state.error = null;
      state.post = action.payload;
    });
    builder.addCase(fetchSinglePostAction.rejected, (state, action) => {
      console.log("fetch Single post rejected");
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    // Add post
    builder.addCase(addPostAction.pending, (state, action) => {
      console.log("addpost pending");
      state.loading = true;
    });
    builder.addCase(addPostAction.fulfilled, (state, action) => {
      console.log(" addpost fulfilled");
      state.loading = false;
      state.success = true;
      state.error = null;
      state.post = action.payload;
    });
    builder.addCase(addPostAction.rejected, (state, action) => {
      console.log("addpost rejected");
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    // update post
    builder.addCase(updatePostAction.pending, (state, action) => {
      console.log("updatePostAction pending");
      state.loading = true;
    });
    builder.addCase(updatePostAction.fulfilled, (state, action) => {
      console.log(" updatePostAction fulfilled");
      state.loading = false;
      state.success = true;
      state.error = null;
      state.post = action.payload;
    });
    builder.addCase(updatePostAction.rejected, (state, action) => {
      console.log("updatePostAction rejected");
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    // Delete post
    builder.addCase(deletePostAction.pending, (state, action) => {
      console.log("delete pending");
      state.loading = true;
    });
    builder.addCase(deletePostAction.fulfilled, (state, action) => {
      console.log(" delete fulfilled");
      state.loading = false;
      // state.success = true;
      state.error = null;
      state.post = action.payload;
    });
    builder.addCase(deletePostAction.rejected, (state, action) => {
      console.log("delete rejected");
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
    //like post
    builder.addCase(likePostAction.pending, (state, action) => {
      console.log("like post pending");
      state.loading = true;
    });
    builder.addCase(likePostAction.fulfilled, (state, action) => {
      console.log(" like post fulfilled");
      state.loading = false;
      // state.success = true;
      state.error = null;
      state.post = action.payload;
    });
    builder.addCase(likePostAction.rejected, (state, action) => {
      console.log("like post rejected");
      state.loading = false;
      state.error = action.payload;
      console.log(action.payload);
    });

    //dislike post
    builder.addCase(dislikePostAction.pending, (state, action) => {
      console.log("dislike post pending");
      state.loading = true;
    });
    builder.addCase(dislikePostAction.fulfilled, (state, action) => {
      console.log(" dislike post fulfilled");
      state.loading = false;
      // state.success = true;
      state.error = null;
      state.post = action.payload;
    });
    builder.addCase(dislikePostAction.rejected, (state, action) => {
      console.log("dislike post rejected");
      state.loading = false;
      state.error = action.payload;
      console.log(action.payload);
    });

    //clap post
    builder.addCase(clapPostAction.pending, (state, action) => {
      console.log("clap post pending");
      state.loading = true;
    });
    builder.addCase(clapPostAction.fulfilled, (state, action) => {
      console.log(" clap post fulfilled");
      state.loading = false;
      // state.success = true;
      state.error = null;
      state.post = action.payload;
    });
    builder.addCase(clapPostAction.rejected, (state, action) => {
      console.log("clap post rejected");
      state.loading = false;
      state.error = action.payload;
      console.log(action.payload);
    });

    //view post
    builder.addCase(viewPostAction.pending, (state, action) => {
      console.log("clap post pending");
      state.loading = true;
    });
    builder.addCase(viewPostAction.fulfilled, (state, action) => {
      console.log(" clap post fulfilled");
      state.loading = false;
      // state.success = true;
      state.error = null;
      state.post = action.payload;
    });
    builder.addCase(viewPostAction.rejected, (state, action) => {
      console.log("clap post rejected");
      state.loading = false;
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

const postReducer = postsSlice.reducer;
export default postReducer;
