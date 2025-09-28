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
  users: [],
  user: null,
  isUpdated: false,
  isDeleted: false,
  isEmailSent: false,
  isPasswordReset: false,
  profile: {},
  userAuth: {
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

//? Login Action
export const loginAction = createAsyncThunk(
  "users/login",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    //make request
    try {
      console.log("started communication");

      const { data } = await axios.post(`${baseurl}/users/login`, payload);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//? Register Action
export const registerAction = createAsyncThunk(
  "users/register",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    //make request
    try {
      console.log("started communication");

      const { data } = await axios.post(`${baseurl}/users/register`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//? reset User action
export const resetUserAction = createAction("users/reset");

//? Logout Action
export const logoutAction = createAction("users/logout", async () => {
  localStorage.removeItem("userInfo");
  return true;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    //login
    builder.addCase(loginAction.pending, (state, action) => {
      console.log("Pending");

      state.loading = true;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.loading = false;
      state.success = true;
      state.error = null;
      state.userAuth.userInfo = action.payload;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      console.log("rejected");
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });

    //Register
    builder.addCase(registerAction.pending, (state, action) => {
      console.log("reg Pending");
      state.loading = true;
    });
    builder.addCase(registerAction.fulfilled, (state, action) => {
      console.log("reg fulfilled");
      state.loading = false;
      state.success = true;
      state.error = null;
      state.user = action.payload;
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      console.log("reg rejected");
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
    //! Reset user
    builder.addCase(resetUserAction, (state, action) => {
      state.user = null;
      state.error = null;
      state.success = false;
      state.isUpdated = false;
      state.isDeleted = false;
      state.isEmailSent = false;
      state.isPasswordReset = false;
      state.profile = {};
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

const usersReducer = usersSlice.reducer;
export default usersReducer;
