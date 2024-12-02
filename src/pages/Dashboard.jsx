import React, { useEffect, useState } from 'react';
import appwriteService from '../appwrite/config';
import authService from '../appwrite/auth';
import AdminLogo from '../components/images/Admin-Logo.png'
import PostsImage from '../components/images/PostsImage.png'
import ActiveUsers from '../components/images/ActiveUsers.png'
import Comments from '../components/images/Comments.png'
import { Link, useNavigate } from 'react-router-dom';
import AddPost from './AddPost';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend ,Filler} from 'chart.js';
import Button from '../components/Button';
import Popup from '../components/Popup';
import { BeatLoader } from 'react-spinners';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,Filler);

const Dashboard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [postCounts, setPostCounts] = useState({ labels: [], data: [] });
    const [totalLikes, setTotalLikes] = useState('0')
    const [totalComments, setTotalComments] = useState('0')
    const [isPopup, setIsPopup] = useState(false);
    const [feedbacks, setFeedbacks] = useState([])

    useEffect(() => {
        appwriteService.GetPosts().then((allposts) => {
            if (allposts) {

                // Remove duplicates by UserName
                const uniquePosts = allposts.documents.filter((post, index, self) =>
                    index === self.findIndex((p) => p.UserName === post.UserName)
                );

                setPosts(uniquePosts);

                // Reversing post for showing recent posts 
                const reversePost = allposts.documents
                    .slice()
                    .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
                setAllPosts(reversePost);

                // Data for the graph
                const postDates = reversePost.map(post => new Date(post.$createdAt).toLocaleDateString());
                const uniqueDates = [...new Set(postDates)];

                const counts = uniqueDates.map(date => postDates.filter(d => d === date).length);

                setPostCounts({
                    labels: uniqueDates,
                    data: counts
                });
            }
        });
    }, []);

    // Delete post Function
    const deletePost = (postId, featuredImage, e) => {
        e.stopPropagation()
        appwriteService.DeletePost(postId).then((status) => {
            if (status) {
                appwriteService.deleteFile(featuredImage);
                setIsPopup(true);
                setAllPosts(prevPosts => prevPosts.filter(post => post.$id !== postId));
                setTimeout(() => {
                    setIsPopup(false);
                }, 1000);
            }
        });
    };

    useEffect(() => {
        authService.getCurrentUser().then((userData) => {
            if (userData) {

                setCurrentUser(userData.name);

                // Filter posts belonging to the current user
                if (allPosts.length > 0) {
                    const totalLikes = allPosts.reduce((total, post) => total + post.likes.length, 0)
                    setTotalLikes(totalLikes);

                    const totalComments = allPosts.reduce((total, post) => total + post.comments.length, 0)
                    setTotalComments(totalComments);

                }
            }
        });
    }, [allPosts]);

    // Feedbacks 
    useEffect(() => {
        appwriteService.getFeedbacks().then((feedback) => {
            if (feedback) {
                setFeedbacks(feedback.documents);
            }
        });
    }, [allPosts]);

    const handlePostOpen = (e, $id) => {
        e.stopPropagation()
        navigate(`/post/${$id}`)
    }

    if (!currentUser) {
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
        <div className='min-h-screen p-2 xl:p-10 '>
            <h1 className='text-gray-600 text-3xl font-semibold ml-0 xl:-ml-4 mt-0 xl:-mt-5 mb-10'>Welcome Back! 👋</h1>
            <div className="flex flex-wrap justify-around gap-16 xl:gap-0">
                {isPopup && <Popup>Delete Successful!!!</Popup>}

                {/* Admin Info  */}
                <div className="relative w-[99%] xl:w-80 h-56 rounded-md shadow-lg bg-gradient-to-r from-rose-200 to-rose-400 border border-gray-200 p-4">
                    {/* Admin Information */}
                    <div className="text-xl font-semibold text-gray-700">{currentUser}</div>
                    <div className="text-sm font-medium text-gray-500">Owner/Admin</div>
                    <div className="mt-4">
                        <div className="text-lg font-bold text-rose-600">{feedbacks.length}</div>
                        <div className="text-sm font-medium text-gray-600">Total Feedbacks</div>
                    </div>
                    <div className="mt-2">
                        <div className="text-lg font-bold text-rose-600">{totalLikes}</div>
                        <div className="text-sm font-medium text-gray-600">Total Likes</div>
                    </div>
                    {/* Admin Logo */}
                    <div className="absolute w-64 h-80 -top-20 -right-14  flex items-center justify-center">
                        <img src={AdminLogo} alt="Admin Logo" className="w-[100%] h-[100%] object-contain drop-shadow-xl shadow-black" />
                    </div>
                </div>

                {/* For Total Posts  */}
                <div className="w-[99%] xl:w-56 h-56 relative rounded-lg shadow-md bg-gradient-to-r from-rose-200 to-rose-400 border border-gray-200 p-4 hover:shadow-xl transition-shadow duration-300">
                    {/* Image */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-40 h-32">
                        <img src={PostsImage} alt="Posts" className="w-full h-full object-contain " />
                    </div>
                    {/* Content */}
                    <div className="mt-20 text-center">
                        <div className="text-2xl font-bold text-rose-900">{allPosts.length}</div>
                        <div className="text-sm font-medium text-gray-600">Total Posts</div>
                    </div>
                </div>

                {/* For Active Users  */}
                <div className="w-[99%] xl:w-56 h-56 relative rounded-lg shadow-md bg-gradient-to-r from-rose-200 to-rose-400 border border-gray-300 p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
                    <div className="absolute -top-24 w-48 h-48">
                        <img src={ActiveUsers} alt="Active Users" className="w-full h-full object-contain" />
                    </div>
                    <div className="mt-16 text-center">
                        <div className="text-3xl font-bold text-green-700">{posts.length}</div>
                        <div className="text-sm font-medium text-gray-600">Total Active Users</div>
                    </div>
                </div>

                {/* For Total Comments  */}
                <div className="w-[99%] xl:w-56 h-56 relative rounded-lg shadow-md bg-gradient-to-r from-rose-200 to-rose-400 border border-gray-300 p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
                    <div className="absolute -top-20 w-32 h-40">
                        <img src={Comments} alt="Total Comments" className="w-full h-full object-contain" />
                    </div>
                    <div className="mt-16 text-center">
                        <div className="text-3xl font-bold text-red-700">{totalComments}</div>
                        <div className="text-sm font-medium text-gray-600">Total Comments</div>
                    </div>
                </div>

                {/* Latest Posts  */}
                <div className="w-[99%] xl:w-[35%] h-72 overflow-y-scroll relative rounded-lg shadow-md bg-gradient-to-r from-rose-200 to-rose-400 border border-gray-300 p-2 xl:p-6 mt-0 xl:mt-10 hover:shadow-xl transition-shadow duration-300">
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
                                    onClick={(e) => handlePostOpen(e, post.$id)}
                                    className="flex justify-between items-center gap-4 bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex item-center gap-4">
                                        {/* Post Image */}
                                        <img
                                            src={appwriteService.getFilePreview(post.featuredimage) || 'https://via.placeholder.com/50'}
                                            alt={post.title}
                                            className="w-12 h-12 rounded-md object-cover"
                                        />
                                        {/* Post Details */}
                                        <div className='mt-1'>
                                            <h3 className="text-xs md:text-sm font-semibold text-gray-800">
                                                {post.title}
                                            </h3>
                                            <p className="text-[10px] md:text-xs text-gray-500"><span className='font-semibold'>By:</span> {post.UserName}</p>
                                        </div>
                                    </div>
                                    <Button bgColor="bg-rose-500 hover:bg-rose-600 px-1 md:px-4 text-xs md:text-base" onClick={() => deletePost(post.$id, post.featuredimage)}>
                                        Delete
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500">No Posts Yet</div>
                        )}
                    </div>
                </div>

                {/* Graph - Posts per Day */}
                <div className="w-[99%] xl:w-[56%] h-auto xl:h-72 relative rounded-lg shadow-md bg-gradient-to-r from-rose-200 to-rose-400 border border-gray-300 p-1 xl:p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300 mt-0 xl:mt-10">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Posts Per Day</h2>
                    <div className="w-full h-[200px] xl:h-[300px]">
                        <Line
                            data={{
                                labels: postCounts.labels,
                                datasets: [
                                    {
                                        label: 'Posts Per Day',
                                        data: postCounts.data,
                                        borderColor: '#900000',
                                        backgroundColor: 'rgba(76, 110, 245, 0.2)',
                                        tension: 0.4,
                                        fill: true,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false, // Makes the chart take available height
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    tooltip: {
                                        mode: 'index',
                                        intersect: false,
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Date',
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Post Count',
                                        },
                                        min: 0,
                                        ticks: {
                                            stepSize: 1,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;