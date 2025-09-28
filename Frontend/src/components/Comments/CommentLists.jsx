import React from "react";

const CommentsLists = ({ comments }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        <div className="flex-grow">
          {!comments || comments.length === 0 ? (
            <h2 className="text-gray-500">No Comments</h2>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="mb-4">
                <div className="bg-blue-50 px-4 py-3 sm:px-6 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-blue-600">
                      {comment?.author?.username}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(comment?.createdAt).toDateString()}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 px-4 py-3 sm:px-6">
                  <p className="mt-1 text-sm text-gray-700">{comment?.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsLists;
