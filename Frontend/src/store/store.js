import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../redux/slices/users/userSlices";
import postReducer from "../redux/slices/posts/postSlices";
import categoryReducer from "../redux/slices/categories/categorySlices";
import commentReducer from "../redux/slices/comments/commentsSlices";

//? Store config
const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postReducer,
    categories: categoryReducer,
    comments: commentReducer,
  },
});

export default store;
