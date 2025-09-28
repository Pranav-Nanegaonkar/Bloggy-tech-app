import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../../../redux/slices/users/userSlices";
import LoadingComponent from "../../Alert/LoadingComponent";
import ErrorMsg from "../../Alert/ErrorMsg";
import SuccessMsg from "../../Alert/SuccessMsg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userAuth, loading, error, success } = useSelector(
    (state) => state.users
  );

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (userAuth?.userInfo?.token) {
      navigate("/profile");
    }
  }, [userAuth?.userInfo?.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch login action with username + password
    console.log(formData);
    dispatch(
      loginAction({ username: formData.username, password: formData.password })
    );
    setFormData({
      username: "",
      password: "",
    });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log("Forgot password link clicked");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Header */}
      {/* <header className="bg-gradient-to-r from-indigo-700 via-blue-800 to-purple-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              BlogSphere
            </h1>
            <p className="mt-2 text-xl text-indigo-100 max-w-2xl mx-auto">
              Sign in to share your stories and connect with the community.
            </p>
          </div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-5 rounded-full"></div>
          <div className="absolute top-10 left-10 w-16 h-16 bg-white opacity-5 rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        </div>
      </header> */}

      {/* Main Content with Login Card */}
      <main className="flex-grow container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-white/20 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-3xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-gray-600 mt-2">
                Sign in to continue your blogging journey
              </p>
            </div>

            {/* display Error */}
            {error && <ErrorMsg message={error.message} />}
            {/* display success */}
            {success && <SuccessMsg message={"Login Successful"} />}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your username"
                    required
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your password"
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              {loading ? (
                <LoadingComponent />
              ) : (
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign In
                  </span>
                </button>
              )}
            </form>

            <div className="mt-8 text-center space-y-3">
              <p>
                <a
                  href="/pass"
                  onClick={handleForgotPassword}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors duration-200"
                >
                  Forgot Password?
                </a>
              </p>
              <p className="text-gray-600">
                New to BlogSphere?{" "}
                <a
                  href="/"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors duration-200"
                >
                  Create an account
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-indigo-100">
            &copy; 2025 BlogSphere. Empowering voices, one post at a time.
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default Login;
