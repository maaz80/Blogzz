import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredimage}) {
    
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-[100vw] md:w-[345px] m-auto md:m-0 bg-rose-300 rounded-xl p-2 h-72 shadow-md shadow-gray-400'>
            <div className='w-full justify-center mb-4'>
                <img src={appwriteService.getFilePreview(featuredimage)} alt={title}
                className='rounded-xl h-52 w-[100%] object-cover' />

            </div>
            <h2
            className='text-xl font-bold text-rose-700'
            >{title}</h2>
        </div>
    </Link>
  )
}


export default PostCard