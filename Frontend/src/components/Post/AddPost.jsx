import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchCategories } from "../../redux/slices/categories/categorySlices";
import {
  addPostAction,
  resetPostAction,
} from "../../redux/slices/posts/postSlices";
import LoadingComponent from "../Alert/LoadingComponent";
import ErrorMsg from "../Alert/ErrorMsg";
import SuccessMsg from "../Alert/SuccessMsg";

const AddPost = () => {
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

  //! Validate form
  const validateForm = (data) => {
    let errors = {};
    if (!data.title) {
      errors.title = "Title is required";
    }
    if (!data.image) {
      errors.image = "Image is required";
    }
    if (!data.content) {
      errors.content = "Content is required";
    }
    if (!data.category) {
      errors.category = "Category is required";
    }
    return errors;
  };

  //? Handle Blur event
  const handleBlur = (e) => {
    const formErrors = validateForm(formData);
    const { name } = e.target;
    setErrors({ ...errors, [name]: formErrors[name] });
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

    //? Validate if the form is submited without filling
    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      dispatch(addPostAction(formData));

      setFormData({
        title: "",
        image: null,
        category: null,
        content: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl px-6">
        <div className="flex flex-col items-center p-10 xl:px-24 xl:pb-12 bg-white rounded-4xl shadow-2xl">
          <h2 className="mb-4 text-2xl md:text-3xl text-coolGray-900 font-bold text-center">
            Add New Post
          </h2>
          {error && <ErrorMsg message={error.message} />}
          {success && <SuccessMsg message="Post Created" />}
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
              onBlur={handleBlur}
            />
            {errors?.title && <p className="text-red-500">{errors?.title}</p>}
          </label>

          {/* Image */}
          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Image</span>
            <input
              className="py-3 px-3 w-full border border-coolGray-200 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-green-500"
              type="file"
              name="image"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors?.image && <p className="text-red-500">{errors?.image}</p>}
          </label>

          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Category</span>
            <Select
              options={options}
              name="category"
              onChange={handelSelectChange}
              onBlur={handleBlur}
            />
            {errors?.category && (
              <p className="text-red-500">{errors?.category}</p>
            )}
          </label>

          <label className="mb-4 flex flex-col w-full">
            <span className="mb-1 text-coolGray-800 font-medium">Content</span>
            <textarea
              className="py-3 px-3 w-full border border-coolGray-200 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Write your post content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors?.content && (
              <p className="text-red-500">{errors?.content}</p>
            )}
          </label>

          {/* Button */}
          {loading ? (
            <LoadingComponent />
          ) : (
            <button
              className="mb-4 py-3 px-7 w-full text-green-50 font-medium bg-green-500 hover:bg-green-600 rounded-md focus:ring-2 focus:ring-green-500"
              type="submit"
            >
              Post
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddPost;
