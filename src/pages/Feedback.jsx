import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import appwriteService from '../appwrite/config';
import Button from '../components/Button';
import authService from "../appwrite/auth";
import { ImCross } from "react-icons/im";
import { BeatLoader } from 'react-spinners';
import Popup from '../components/Popup';

function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [username, setUsername] = useState("");
  const [isForm, setIsForm] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterRating, setFilterRating] = useState(null);
  const [isPopup, setIsPopup] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [editFeedback, setEditFeedback] = useState(null);
  const [userData, setUserData] = useState(null)
  const [isAuthor, setIsAuthor] = useState(false)
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm();



  // Getting user data 
  const getUser = () => {
    authService.getCurrentUser().then((userData) => {
      if (userData) {
        setUsername(userData.name);
      }
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  const onSubmit = async (data) => {
    setIsForm(false);
    const feedbackData = { username, feedback: data.comment, rating };

    try {
      if (editFeedback) {
        // For editing, update feedback
        await appwriteService.UpdateFeedback(editFeedback.$id, {
          feedback: data.comment,
          rating,
        });
        setFeedbacks(feedbacks.map(feed =>
          feed.$id === editFeedback.$id
            ? { ...feed, feedback: data.comment, rating }
            : feed
        ));
        setEditFeedback(null);
      } else {
        // If new feedback, create feedback
        const response = await appwriteService.createFeedback(feedbackData);

        // Ensure `response` is valid before updating state
        if (response) {
          setFeedbacks([...feedbacks, response]);
        } else {
          console.error("Failed to create feedback.");
        }
      }

      setRating(0);
      reset();
      setIsPopup(true);
      setTimeout(() => {
        setIsPopup(false);
      }, 1000);
    } catch (error) {
      console.log("Error submitting feedback: ", error);
    }
  };


  const handleCross = () => {
    setIsForm(false);
    setEditFeedback(null); // Reset edit state if user cancels
  };

  const handleFormToggle = () => setIsForm(!isForm);

  const filteredFeedbacks = filterRating
    ? feedbacks.filter((feed) => feed.rating === filterRating)
    : feedbacks;

  const renderStars = (starCount) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={star <= starCount ? "gold" : "gray"}
          className="w-9 h-9"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );

  // Fetching User
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setUserData(user);
      }
    };
    fetchUserData();
  }, []);

  // Checking if user is admin
  useEffect(() => {
    if (feedbacks && userData) {
      if (userData.labels && userData.labels.includes('admin')) {
        setIsAuthor(true);
      }
    } else {
      setIsAuthor(false);
    }
  }, [feedbacks, userData]);


  // Fetch feedback list
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    appwriteService.getFeedbacks().then((feedback) => {
      if (feedback) {
        setFeedbacks(feedback.documents);
        console.log(feedback.documents);

      }
    });
  }, []);

  // Delete feedback function
  const deleteFeedback = async (feedbackId) => {
    try {
      const status = await appwriteService.DeleteFeedback(feedbackId);
      if (status) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setFeedbacks(feedbacks.filter((feed) => feed.$id !== feedbackId));
        setIsDelete(true);
        setTimeout(() => {
          setIsDelete(false);
        }, 1000);
      }
    } catch (error) {
      console.log('Error deleting feedback:', error);
    }
  };

  // Edit feedback function
  const editFeedbackHandler = (feedback) => {
    setEditFeedback(feedback);
    setRating(feedback.rating);
    setValue("comment", feedback.feedback);
    setIsForm(true);
  };

  if (feedbacks.length === 0) {
    return (
      <div className="w-full py-8 mt-[50%] md:mt-[8%] text-center">
        <div className="flex flex-wrap">
          <div className="p-2 w-full h-screen mt-[10%]">
            <h1 className="text-2xl font-bold hover:text-gray-500">
              <BeatLoader />
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 md:p-4 w-full">
      <div className="flex justify-between item-end md:items-center flex-col md:flex-row w-full">
        {isPopup && <Popup children={'Feedback Updated!'} />}
        {isDelete && <Popup children={'Feedback Deleted!'} />}

        {/* Filters */}
        <div className="flex justify-center mb-2 md:mb-6 space-x-1 md:space-x-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star === filterRating ? null : star)}
              className={`px-3 py-1 text-xs md:text-base rounded-md md:rounded-xl text-white hover:bg-rose-600 ${star === filterRating ? "bg-rose-600" : "bg-rose-400"
                }`}
            >
              {star} ⭐
            </button>
          ))}
        </div>

        <div className='flex justify-end items-end'>
          <Button onClick={handleFormToggle} className="mb-4 text-sm md:text-base min-w-40">
            Submit Feedback
          </Button>
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeedbacks.length > 0 && (
          filteredFeedbacks.map((feed) => (
            <div
              key={feed.$id}
              className="p-6 bg-white rounded shadow-md border flex flex-col items-center relative"
            >
              <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {
                  feed.username
                    ? feed.username
                      .split(" ")
                      .map((word) => word[0]?.toUpperCase() || "")
                      .join("")
                    : "NA" // Default value if username is undefined or null
                }

              </div>
              <h3 className="text-lg font-bold mb-2">{feed.username}</h3>
              <div className="mb-4">{renderStars(feed.rating)}</div>
              <p className="text-gray-600 text-center">{feed.feedback}</p>
              {(feed.$permissions.some(permission => {
                const match = permission.match(/user:([a-zA-Z0-9-]+)/);
                return match && match[1] === userData?.$id;
              }) || isAuthor) && (
                  <div>
                    <Button
                      onClick={() => editFeedbackHandler(feed)}
                      className="mt-2 absolute top-1 right-3 w-14 text-sm flex justify-center items-center"
                      bgColor="bg-rose-500"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteFeedback(feed.$id)}
                      className="mt-2 absolute top-9 right-3 w-14 text-sm flex justify-center items-center"
                    >
                      Delete
                    </Button>
                  </div>
                )}
            </div>
          ))
        )}
      </div>

      {/* Feedback Form */}
      {isForm && (
        <div className='h-screen w-full bg-black/10 flex justify-center items-center fixed top-0 left-0 backdrop-blur'>
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md fixed top-1/3 left-1/2 -translate-x-1/2">
            <h2 className="text-2xl font-bold text-center mb-4">{editFeedback ? "Edit Feedback" : "Submit Feedback"}</h2>
            <div className='fixed top-4 right-4 text-gray-600 hover:text-black' onClick={handleCross}><ImCross /></div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={star <= (hoverRating || rating) ? "gold" : "gray"}
                    className="w-8 h-8 cursor-pointer"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <textarea
                {...register("comment", { required: "Please enter your feedback." })}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                placeholder="Enter your feedback"
              />
              {errors.comment && (
                <p className="text-red-500 text-sm">{errors.comment.message}</p>
              )}
              <Button type="submit" className="mt-4 w-full">
                {editFeedback ? "Update Feedback" : "Submit Feedback"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;
