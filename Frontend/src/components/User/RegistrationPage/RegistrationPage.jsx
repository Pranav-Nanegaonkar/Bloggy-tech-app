import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerAction,
  resetUserAction,
} from "../../../redux/slices/users/userSlices";
import { useNavigate } from "react-router-dom";
import ErrorMsg from "../../Alert/ErrorMsg";
import SuccessMsg from "../../Alert/SuccessMsg";
import LoadingComponent from "../../Alert/LoadingComponent";

const RegistrationPage = () => {
  const { user, error, loading, success } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user?.status === "success") {
      navigate("/login");
      dispatch(resetUserAction());
    }
  }, [user?.status, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerAction(formData));
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">
                Join BlogSphere
              </h2>
              <p className="text-gray-600 mt-2">
                Create your account and start your blogging journey
              </p>
            </div>

            {/* Error / Success Messages */}
            {error && <ErrorMsg message={error.message} />}
            {success && <SuccessMsg message={"Registration Successful"} />}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username */}
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
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your username"
                    required
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

              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your email"
                    required
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Password */}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Create a password"
                    required
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

              {/* Submit Button */}
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Start Blogging
                  </span>
                </button>
              )}
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-600">
                Already a blogger?{" "}
                <a
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors duration-200"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;
