import { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components'
import { BeatLoader } from 'react-spinners';
import ShortVid from "../components/ShortVid.mp4"
function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        appwriteService.GetPosts().then((posts) => {
            if (posts) {
                const sortedPosts = posts.documents.sort((a, b) => {
                    return new Date(b.$createdAt) - new Date(a.$createdAt)
                })
                setPosts(sortedPosts)
            }
        })
    }, [])


    if (posts.length === 0) {
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
        )
    }
    return (
        <div className='w-full py-4 '>
            <div className="flex flex-wrap flex-col md:flex-row item-center justify-between gap-6 xl:gap-0">
                <div className='w-[100%] xl:w-[50%] h-[50%] protest-revolution-regular'>
                    <h2 className='text-6xl md:text-8xl text-rose-800 '>Share your thoughts with, </h2>
                    <h1 className=' text-6xl md:text-8xl  text-rose-800 '>The Blogzz</h1>
                </div>
                <video
                    src={ShortVid}
                    className="w-[96%] xl:w-[50%] h-[30%] object-cover xl:h-[50%] mb-6 shadow-xl border-1 xl:border-2 border-gray-400 shadow-gray-400 rounded-xl"
                    autoPlay
                    loop
                    muted
                ></video>

            </div>

            <div className='flex flex-col md:flex-row flex-wrap justify-between items-center -ml-3 md:ml-0 '>
                <div className='w-[96%] md:w-[33%] h-60 p-3 rounded-xl border-1 shadow-md shadow-gray-300'>
                    <div className='bg-gradient-to-r from-amber-300 to-amber-600 w-full h-[80%] rounded-xl flex items-center justify-center text-6xl text-white protest-revolution-regular mb-2'>Create</div>
                    <div className='text-2xl md:text-3xl text-amber-600 font-bold'>Create Your Posts</div>
                </div>
                <div className='w-[96%] md:w-[33%] h-60 p-3 rounded-xl border-1 shadow-md shadow-gray-300'>
                    <div className='bg-gradient-to-r from-teal-300 to-teal-600 w-full h-[80%] rounded-xl flex items-center justify-center text-6xl text-white protest-revolution-regular mb-2'>Like</div>
                    <div className='text-2xl md:text-3xl text-teal-600 font-bold'>Like The Posts</div>
                </div>
                <div className='w-[96%] md:w-[33%] h-60 p-3 rounded-xl border-1 shadow-md shadow-gray-300'>
                    <div className='bg-gradient-to-r from-neutral-300 to-neutral-600 w-full h-[80%] rounded-xl flex items-center justify-center text-6xl text-white protest-revolution-regular mb-2'>Comment</div>
                    <div className='text-2xl md:text-3xl text-neutral-600 font-bold'>Comment On Posts</div>
                </div>
            </div>

            <Container>
                <h1 className='font-bold text-6xl text-rose-800 underline my-4 mt-8'>Posts</h1>
                <div className='flex flex-wrap w-[100%] gap-2'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-0 md:p-2'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home
