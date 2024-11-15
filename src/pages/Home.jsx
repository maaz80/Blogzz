import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components'
import conf from '../conf/conf';

function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.GetPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${conf.appwriteUrl}/functions/${conf.functionId}/executions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Appwrite-Project": `${conf.appwriteProjectId}`,
                    "X-Appwrite-Key": `${conf.appwriteusersapikey}`
                },
            });
    
            const result = await response.json();
            const users = JSON.parse(result.responseBody).users; // Parse response to get users
            console.log("All Users:", users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    fetchUsers();
    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full h-screen mt-[10%]">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                               Start adding Posts ;)
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-4 '>
            <h1 className='font-semibold text-5xl text-rose-400  pb-3'>Home</h1>
            <Container>
                <div className='flex flex-wrap w-[100%] gap-3 '>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-0 md:p-2 '>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home