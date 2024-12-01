import React, { useState } from "react";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState(""); // Example for username input

const getUser = ()=>{
  authService.getCurrentUser().then((userData)=>{
    if(userData) {
      setUsername(userData.name)
    }
  })
}
getUser()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const initials = username
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
    const feedbackData = { username, initials, feedback: comment, rating };

    try {
      const response = await appwriteService.createFeedback(feedbackData);
      setComment('')
      setRating('')
      console.log("Feedback submitted successfully: ", response);
    } catch (error) {
      console.log("Error submitting feedback: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Feedback Form</h2>
        <form onSubmit={handleSubmit}>
         
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={star <= (hoverRating || rating) ? "gold" : "gray"}
                className="w-8 h-8 cursor-pointer"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <textarea
            className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Write your feedback here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
