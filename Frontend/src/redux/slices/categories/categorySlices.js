import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { data } from "react-router-dom";
const baseurl = "http://localhost:3000/api/v1";
const initialState = {
  loading: false,
  error: null,
  success: false,
  categories: [],
  category: null,
};

//? Fetch categories
export const fetchCategories = createAsyncThunk(
  "categories/list",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("started post fetching");
      const { data } = await axios.get(`${baseurl}/category`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//?
//! Category Slice
const categorySlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    //fetch public post
    builder.addCase(fetchCategories.pending, (state, action) => {
      console.log("post pending");
      state.loading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      console.log(" post fulfilled");
      state.loading = false;
      state.success = true;
      state.error = null;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      console.log("post rejected");
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    });
  },
});

const categoryReducer = categorySlice.reducer;
export default categoryReducer;
