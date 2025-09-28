import React, { useEffect } from "react";
import RegistrationPage from "../User/RegistrationPage/RegistrationPage";
import PublicPosts from "../Post/PublicPosts";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPostAction } from "../../redux/slices/posts/postSlices";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Header */}
     

      {/* Main Content with Registration Component
      <main className="flex-grow container mx-auto px-4 py-20">
        <RegistrationPage />
      </main> */}

      <div>
        <PublicPosts />
      </div>
      {/* Footer */}
      {/* <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-100">
            &copy; 2025 BlogSphere. Empowering voices, one post at a time.
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default HomePage;
