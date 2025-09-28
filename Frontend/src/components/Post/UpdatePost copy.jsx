import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchCategories } from "../../redux/slices/categories/categorySlices";
import { updatePostAction } from "../../redux/slices/posts/postSlices";
import LoadingComponent from "../Alert/LoadingComponent";
import ErrorMsg from "../Alert/ErrorMsg";
import SuccessMsg from "../Alert/SuccessMsg";
import { useParams } from "react-router-dom";

const UpdatePost = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { post, error, loading, success } = useSelector((state) => state.posts);
  const { categories } = useSelector((state) => state.categories);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    category: null,
    content: "",
  });
  useEffect(() => {
    // dispatch(resetPostAction());
    console.log(post);

    dispatch(fetchCategories());
  }, []);
  // console.log(categories.allCategories);

  const categoryList = categories.allCategories?.map((item) => {
    return {
      value: item?.id,
      label: item.name,
    };
  });
  // console.log(categoryList);

  // Dummy data
  // const options = [
  //   { value: "chocolate", label: "Chocolate" },
  //   { value: "strawberry", label: "Strawberry" },
  //   { value: "vanilla", label: "Vanilla" },
  // ];

  //!Error state

  const options = categoryList;

  const handelSelectChange = (selectedOption) => {
    setFormData({ ...formData, category: selectedOption.value });
  };

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updatePostAction({ ...formData, postId }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl px-6">
        <div className="flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white rounded-4xl shadow-2xl">
          <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold text-center">
            Update Post
          </h2>
          {error && <ErrorMsg message={error.message} />}
          {success && <SuccessMsg message="Post Updated" />}
          <h3 className="mb-7 text-base md:text-lg text-coolGray-500 font-medium text-center">
            Share your thoughts and ideas with the community
          </h3>
          {/* Title */}
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Title</span>
            <input
              className="py-3 px-3 w-full border border-coolGray-200 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-green-500"
              type="text"
              placeholder="Enter the post title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </label>
          {/* Image */}
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Image</span>
            <input
              className="py-3 px-3 w-full border border-coolGray-200 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-green-500"
              type="file"
              name="image"
              onChange={handleChange}
            />
          </label>
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Category</span>
            <Select
              options={options}
              name="category"
              onChange={handelSelectChange}
            />
          </label>
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Content</span>
            <textarea
              className="py-3 px-3 w-full border border-coolGray-200 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Write your post content"
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
          </label>
          {/* Button */}
          {loading ? (
            <LoadingComponent />
          ) : (
            <button
              className="mb-4 py-3 px-7 w-full text-green-50 font-medium bg-green-500 hover:bg-green-600 rounded-md focus:ring-2 focus:ring-green-500"
              type="submit"
            >
              Update Post
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdatePost;
