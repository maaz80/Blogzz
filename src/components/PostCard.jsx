import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config"
import { Link, useNavigate } from 'react-router-dom'
import authService from '../appwrite/auth'
import { FaHeart } from 'react-icons/fa'

function PostCard({ $id, title, featuredimage, $createdAt, UserName, likes }) {
  const [userEmail, setuserEmail] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [createdDays, setCreatedDays] = useState('Today')
  const navigate = useNavigate()
  const [likesCount, setLikesCount] = useState(likes.length )

useEffect(() => {
const createdDate = new Date($createdAt);
const currentDate = new Date();
const timeDifference = currentDate - createdDate;
const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
if (daysDifference === 0) {
  setCreatedDays('Today');
} else if (daysDifference === 1) {
  setCreatedDays('Yesterday');
} else {
  setCreatedDays(`${daysDifference} days ago`);
}
},[createdDays])

  // Geting current user 
  useEffect(() => {
    authService.getCurrentUser().then((userData) => {
      if (userData) {
        setuserEmail(userData.email);
      }
    });
  }, []);

  // Set Like or dislike 
  useEffect(() => {
    if (userEmail) {
      setIsLiked(likes.includes(userEmail));
    }
  }, [userEmail, likes]);

  // Hndle Likes or dislike 
  const handleLike = (e) => {
    e.stopPropagation()
    if (!userEmail) return;

    const updatedLikes = isLiked ? likes.filter(email => email !== userEmail) : [...likes, userEmail];
    const updatedLikesCount = isLiked ? likesCount - 1 : likesCount + 1
    appwriteService.updatePostLikes($id, updatedLikes)
      .then(() => {
        setIsLiked(!isLiked);
      })
      .catch(err => {
        console.log("Error updating likes:", err);
      });
    setLikesCount(updatedLikesCount)
  }

  // Handle Post details 
  const handlePostOpen = (e) => {
    e.stopPropagation()
    navigate(`/post/${$id}`)
  }

  return (
    <div className='w-[300px] md:w-[305px] m-auto md:m-0  rounded-xl p-2 h-80 shadow-md shadow-gray-400 ' onClick={handlePostOpen}>
      <div className='w-[280px] md:w-[285px] mx-auto justify-center mb-4 overflow-hidden rounded-xl hover:shadow-sm hover:shadow-gray-400'>
        <img src={appwriteService.getFilePreview(featuredimage)} alt={title} className='rounded-xl h-52 w-[100%] object-cover hover:scale-105 duration-500 transition-scale ' />
      </div>
      <div className='flex justify-between items-center'>
        <h2 className='text-rose-700'>{UserName}</h2>
        <div className="flex items-center gap-2">
          <p>{likesCount} Likes</p>
          <button onClick={handleLike} className="text-red-600">
            <FaHeart color={isLiked ? "red" : "gray"} size={20} />
          </button>
        </div>
      </div>
      <h2 className='text-xl font-bold text-rose-600'>{title}</h2>
      <p className='text-rose-600 text-sm'>{createdDays}</p>
    </div>
  )
}

export default PostCard;