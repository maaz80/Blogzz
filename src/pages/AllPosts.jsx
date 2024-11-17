import React, { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        appwriteService.GetPosts().then((posts) => {
            if (posts) {
                console.log(posts); 
                const sortedPosts = posts.documents.sort((a,b)=>{
                    
                    return new Date(b.$createdAt) - new Date(a.$createdAt)
                })
                setPosts(sortedPosts);
            }
        });
    }, []);
   
    return (
        <div className="w-full  p-1 md:p-5 min-h-screen ">
          {/* <h1 className='font-semibold text-5xl text-rose-400 pb-5 -pt-10 mt-5'>Posts</h1> */}
            <Container>
                <div className="flex flex-wrap justify-start gap-6 w-[100%]">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.$id}>
                                <PostCard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-12 h-screen mt-[10%]">
                            <h1 className="text-2xl font-semibold text-gray-700">No posts available</h1>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
