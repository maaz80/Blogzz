import { useState, useEffect } from 'react';
import { Button, Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";
import { BeatLoader } from 'react-spinners';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        appwriteService.GetPosts().then((posts) => {
            if (posts) {
                const sortedPosts = posts.documents.sort((a, b) => {
                    return new Date(b.$createdAt) - new Date(a.$createdAt);
                });
                setPosts(sortedPosts);
                setFilteredPosts(sortedPosts);
            }
        });
    }, []);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            const filtered = posts.filter((post) =>
                post.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPosts(filtered);
        } else {
            setFilteredPosts(posts);
        }
    }, [searchQuery, posts]);

    const handleAdminPosts = () => {
        const adminPosts = posts.filter(post => post.UserName === 'Maaz Shakeel')
        setFilteredPosts(adminPosts)
    }
    const handleMostLikedPosts = () => {
        const mostLikedPosts = posts.filter(post => post.likes.length > 0).sort((a, b) => b.likes.length - a.likes.length)
        setFilteredPosts(mostLikedPosts)
    }

    return (
        <div className="w-full py-4 pl-1 md:pl-0  min-h-screen">
            {/* Header with Search Bar */}
            <div className="flex justify-between gap-1 flex-col md:flex-row items-center mb-6">
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded-md w-[100%] md:w-[40%] px-4 py-2 focus:outline-none focus:ring-1 focus:ring-rose-300"
                />
                <div className='flex justify-between items-center w-full mr-1 md:mr-0 md:w-auto gap-2'>
                    <Button onClick={handleMostLikedPosts} bgColor='bg-rose-700 hover:bg-rose-500 duration-400 transition-all'>Most Liked</Button>
                    <Button onClick={handleAdminPosts} bgColor='bg-rose-700 hover:bg-rose-500 duration-400 transition-all'>Admin Posts</Button>
                </div>

            </div>
            <Container>
                <div className="flex flex-wrap justify-start gap-6 w-[100%]">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div key={post.$id}>
                                <PostCard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-12 h-screen mt-[50%] md:mt-[12%]">
                            <h1 className="text-2xl font-semibold text-gray-700"><BeatLoader /></h1>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
