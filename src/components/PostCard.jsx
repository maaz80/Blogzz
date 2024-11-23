import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config"
import { Link, useNavigate } from 'react-router-dom'
import authService from '../appwrite/auth'
import { FaHeart } from 'react-icons/fa'

function PostCard({ $id, title, featuredimage, $createdAt, UserName, likes }) {
  const [userEmail, setuserEmail] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const createdDate = $createdAt.slice(0, 10)
  const navigate = useNavigate()
  const [likesCount, setLikesCount] = useState(likes.length )

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
    <div className='w-[300px] md:w-[345px] m-auto md:m-0  rounded-xl p-2 h-80 shadow-md shadow-gray-400' onClick={handlePostOpen}>
      <div className='w-full justify-center mb-4'>
        <img src={appwriteService.getFilePreview(featuredimage)} alt={title} className='rounded-xl h-52 w-[100%] object-cover' />
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
      <p className='text-rose-600 text-sm'>{createdDate}</p>
    </div>
  )
}

export default PostCard;