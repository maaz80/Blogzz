import React, { useEffect, useState } from 'react';
import appwriteService from '../appwrite/config';
import authService from '../appwrite/auth';
import AdminLogo from './images/Admin-Logo.png'
import PostsImage from './images/PostsImage.png'
import ActiveUsers from './images/ActiveUsers.png'
import Comments from './images/Comments.png'
import { Link } from 'react-router-dom';
import AddPost from '../pages/AddPost';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Fetch all posts
        appwriteService.GetPosts().then((allposts) => {
            if (allposts) {
                console.log('Total Posts:', allposts.documents.length);

                // Remove duplicates by UserName
                const uniquePosts = allposts.documents.filter((post, index, self) =>
                    index === self.findIndex((p) => p.UserName === post.UserName)
                );

                console.log('Unique Users:', uniquePosts.map(post => post.UserName).join(', '));

                setPosts(uniquePosts); // Set only unique posts

                const reversePost = allposts.documents
                .slice()
                .sort((a,b)=>  new Date(b.$createdAt) - new Date(a.$createdAt))
                setAllPosts(reversePost); // Store all posts
            }
        });
    }, []);

    useEffect(() => {
        authService.getCurrentUser().then((userData) => {
            if (userData) {
                console.log('User Labels:', userData.labels);
                console.log('User ID:', userData.$id);
                console.log('User Name:', userData.name);

                setCurrentUser(userData.name);

                // Filter posts belonging to the current user
                if (allPosts.length > 0) {
                    const filteredPosts = allPosts.filter(
                        (post) => post.UserName === userData.name
                    );
                    setUserPosts(filteredPosts);
                }
            }
        });
    }, [allPosts]);

    return (
        <div className='min-h-screen p-2 md:p-10 '>
            <h1 className='text-gray-600 text-3xl font-semibold ml-0 md:-ml-4 mt-0 md:-mt-5 mb-10'>Welcome Back! 👋</h1>
            <div className="flex flex-wrap justify-around gap-16 md:gap-0">

                <div className="relative w-[99%] md:w-80 h-56 rounded-md shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-200 p-4">
                    {/* Admin Information */}
                    <div className="text-xl font-semibold text-gray-700">{currentUser}</div>
                    <div className="text-sm font-medium text-gray-500">Owner/Admin</div>
                    <div className="mt-4">
                        <div className="text-lg font-bold text-blue-600">{userPosts.length}</div>
                        <div className="text-sm font-medium text-gray-600">Total Posts</div>
                    </div>
                    <div className="mt-2">
                        <div className="text-lg font-bold text-blue-600">10</div>
                        <div className="text-sm font-medium text-gray-600">Total Likes</div>
                    </div>
                    {/* Admin Logo */}
                    <div className="absolute w-64 h-80 -top-20 -right-14  flex items-center justify-center">
                        <img src={AdminLogo} alt="Admin Logo" className="w-[100%] h-[100%] object-contain drop-shadow-xl shadow-black" />
                    </div>
                </div>

                {/* For Total Posts  */}
                <div className="w-[99%] md:w-56 h-56 relative rounded-lg shadow-md bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-200 p-4 hover:shadow-xl transition-shadow duration-300">
                    {/* Image */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-40 h-32">
                        <img src={PostsImage} alt="Posts" className="w-full h-full object-contain " />
                    </div>
                    {/* Content */}
                    <div className="mt-20 text-center">
                        <div className="text-2xl font-bold text-blue-600">{allPosts.length}</div>
                        <div className="text-sm font-medium text-gray-600">Total Posts</div>
                    </div>
                </div>

                {/* For Active Users  */}
                <div className="w-[99%] md:w-56 h-56 relative rounded-lg shadow-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-300 p-6 flex flex-col items-center">
                    <div className="absolute -top-24 w-48 h-48">
                        <img src={ActiveUsers} alt="Active Users" className="w-full h-full object-contain" />
                    </div>
                    <div className="mt-16 text-center">
                        <div className="text-3xl font-bold text-green-700">{posts.length}</div>
                        <div className="text-sm font-medium text-gray-600">Total Active Users</div>
                    </div>
                </div>

                {/* For Total Comments  */}
                <div className="w-[99%] md:w-56 h-56 relative rounded-lg shadow-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-300 p-6 flex flex-col items-center">
                    <div className="absolute -top-20 w-32 h-40">
                        <img src={Comments} alt="Total Comments" className="w-full h-full object-contain" />
                    </div>
                    <div className="mt-16 text-center">
                        <div className="text-3xl font-bold text-red-700">87</div>
                        <div className="text-sm font-medium text-gray-600">Total Comments</div>
                    </div>
                </div>
                <div className="w-[99%] md:w-[56%] h-72 relative rounded-lg shadow-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-300 p-6 flex flex-col items-center mt-0 md:mt-10"></div>

                <div className="w-[99%] md:w-[35%] h-72 overflow-y-scroll relative rounded-lg shadow-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-300 p-2 md:p-6 mt-0 md:mt-10">
    {/* Header Section */}
    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md shadow-sm">
        <h2 className="text-lg font-bold text-gray-700">Recent Blogs</h2>
        <Link
            to="/add-post"
            element={<AddPost />}
            className="text-blue-500 hover:text-blue-600 font-medium underline"
        >
            Add Post
        </Link>
    </div>

    {/* Posts Section */}
    <div className="mt-1 space-y-1">
        {allPosts.length > 0 ? (
            allPosts.slice(0, 5).map((post) => (
                <div
                    key={post.$id}
                    className="flex items-center gap-4 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                >
                    {/* Post Image */}
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)|| 'https://via.placeholder.com/50'}
                        alt={post.title}
                        className="w-12 h-12 rounded-md object-cover"
                    />
                    {/* Post Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                            {post.title}
                        </h3>
                        <p className="text-xs text-gray-500">By {post.UserName}</p>
                    </div>
                </div>
            ))
        ) : (
            <div className="text-center text-gray-500">No Posts Yet</div>
        )}
    </div>
</div>


            </div>

            {/* <h2>All Unique Posts</h2>
            <div>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.$id}>{post.UserName}</div>
                    ))
                ) : (
                    <div>No unique posts</div>
                )}
            </div>

            <h2>Posts Matching Current User</h2>
            <div>
                {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <div key={post.$id}>{post.UserName}</div>
                    ))
                ) : (
                    <div>No posts for the current user</div>
                )}
            </div> */}
        </div>
    );
};

export default Dashboard;
