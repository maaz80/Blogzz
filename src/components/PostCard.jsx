import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredimage, $createdAt ,UserName}) {

  const createdDate = $createdAt.slice(0, 10)
  return (
    <Link to={`/post/${$id}`}>
      <div className='w-[300px] md:w-[345px] m-auto md:m-0  rounded-xl p-2 h-80 shadow-md shadow-gray-400'>
        <div className='w-full justify-center mb-4'>
          <img src={appwriteService.getFilePreview(featuredimage)} alt={title}
            className='rounded-xl h-52 w-[100%] object-cover' />

        </div>
        <h2 className='text-rose-700'>{UserName}</h2>
        <h2
          className='text-xl font-bold text-rose-600'
        >{title}</h2>
        <p className='text-rose-600 text-sm'>{createdDate}</p>
      </div>
    </Link>
  )
}


export default PostCard