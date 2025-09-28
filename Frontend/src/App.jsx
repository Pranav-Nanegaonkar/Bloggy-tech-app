import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/User/LoginPage/LoginPage";
import UserProfile from "./components/User/UserProfile/UserProfile";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/AuthRoute/ProtectedRoute";
import AddPost from "./components/Post/AddPost";
import PostDetails from "./components/Post/PostDetails";
import PrivatePosts from "./components/Post/PrivatePosts";
import RegistrationPage from "./components/User/RegistrationPage/RegistrationPage";
import UpdatePost from "./components/Post/UpdatePost copy";
const App = () => {
  const { userAuth } = useSelector((state) => state.users);
  const isLoggedIn = userAuth?.userInfo?.token;

  return (
    <BrowserRouter>
      {isLoggedIn ? <PrivateNavbar /> : <PublicNavbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} x />
        <Route path="/register" element={<RegistrationPage />} x />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-post"
          element={
            <ProtectedRoute>
              <AddPost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:postId"
          element={
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:postId/update-post"
          element={
            <ProtectedRoute>
              <UpdatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <PrivatePosts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
