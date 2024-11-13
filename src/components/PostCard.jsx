import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredimage}) {
    
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-60 bg-rose-300 rounded-xl p-2'>
            <div className='w-full justify-center mb-4'>
                <img src={appwriteService.getFilePreview(featuredimage)} alt={title}
                className='rounded-xl h-[120px] w-[100%] object-cover' />

            </div>
            <h2
            className='text-xl font-bold'
            >{title}</h2>
        </div>
    </Link>
  )
}


export default PostCard