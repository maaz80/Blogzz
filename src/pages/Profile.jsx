import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import authService from '../appwrite/auth';
import AdminLogo from '../components/images/Admin-Logo.png'
import Button from '../components/Button';
import { Input } from '../components/index';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import AddPost from './AddPost';
import { BeatLoader } from 'react-spinners';

const Profile = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [userLikes, setUserLikes] = useState([])
    const [userComments, setUserComments] = useState([])
    const [currentUser, setCurrentUser] = useState('Unknown');
    const [currentUserEmail, setCurrentUserEmail] = useState('Unknown');
    const [userLabel, setUserLabel] = useState('')
    const { register: registerName, handleSubmit: handleSubmitName } = useForm()
    const { register: registerPassword, handleSubmit: handleSubmitPassword } = useForm()
    const { register: registerEmail, handleSubmit: handleSubmitEmail } = useForm()
    const [userNameEditable, setUserNameEditable] = useState(false)
    const [userEmailEditable, setUserEmailEditable] = useState(false)
    const [creationDate, setCreationDate] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        appwriteService.GetPosts().then((allposts) => {
            if (allposts) {
                // Reversing post for showing recent posts 
                const reversePost = allposts.documents
                    .slice()
                    .sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
                setAllPosts(reversePost);
            }
        });
    }, []);

    useEffect(() => {
        authService.getCurrentUser().then((userData) => {
            if (userData) {
                setCurrentUser(userData.name);
                setCurrentUserEmail(userData.email);

                if (userData.labels.includes('admin')) {
                    setUserLabel('Admin')
                } else {
                    setUserLabel('User')
                }

                // Filter posts belonging to the current user
                if (allPosts.length > 0) {

                    // Posts 
                    const filteredPosts = allPosts.filter(
                        (post) => post.UserName === userData.name
                    );
                    setUserPosts(filteredPosts);

                    // Likes 
                    const filteredLikes = allPosts.filter(
                        (like) => like.likes.includes(userData.email)
                    )
                    setUserLikes(filteredLikes.length)

                    // comments
                    const filteredComments = allPosts.filter(
                        (post) => post.comments.some((comment) => comment.split(':')[0].trim() === userData.name)
                    )
                    setUserComments(filteredComments.length)

                    // Account creation date
                    const createdAt = new Date(userData.$createdAt);
                    const currentDate = new Date();
                    const diffInMilliseconds = currentDate - createdAt;
                    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
                    setCreationDate(`${diffInDays}`)


                }
            }
        });
    }, [allPosts]);

    // Delete post Function
    const deletePost = (postId, featuredImage, e) => {
        e.stopPropagation();
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

    const handleUpdatePass = async (data) => {
        try {
            await authService.updatePassword(data)
            alert('Password Updated')
        } catch (error) {
            console.log("Appwrite service :: Update password :: error", error);

        }
    }
    const handleName = async () => {
        if (!currentUser || currentUser.length > 128) {
            console.error("Invalid name: must be between 1 and 128 characters.");
            return;
        }
        try {
            const result = await authService.updateName(currentUser);
            setUserNameEditable(false)
            alert("Name updated successfully:", result);
        } catch (error) {
            console.error("Appwrite service :: updateName :: error", error);
        }
    };

    const handleEmail = (userEmail) => {
        try {
            authService.updateEmail(userEmail)
            alert('Email Updated!!!');
            setCurrentUserEmail(false)
        } catch (error) {
            console.error("Appwrite service :: update Email :: error", error);
        }
    }

    const handleNameEditable = () => {
        setUserNameEditable(!userNameEditable)
    }
    const handleEmailEditable = () => {
        setUserEmailEditable(!userEmailEditable)
    }

    const handlePostOpen = (e, $id) => {
        e.stopPropagation()
        navigate(`/post/${$id}`)
    }

    if (!userLabel) {
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
            <div className="flex flex-wrap justify-around gap-2 xl:gap-0">

                <div className='w-[100%] md:w-[50%]'>
                    {/* User Card  */}
                    <div className="relative w-[99%] h-56 rounded-md shadow-lg bg-gradient-to-r from-rose-200 to-rose-300 border border-gray-200 p-4 mb-4">
                        {/* Admin Information */}
                        <div className="text-xl font-semibold text-gray-700">{currentUser ? currentUser : <BeatLoader size={10} />}</div>
                        <div className="text-sm font-medium text-gray-500">{userLabel ? userLabel : <BeatLoader size={10} />}</div>

                        <div className='flex items-center gap-5 md:gap-10'>
                            <div className="mt-4">
                                <div className="text-lg font-bold text-rose-600">{userPosts ? userPosts.length : <BeatLoader size={10} />}</div>
                                <div className="text-sm font-medium text-gray-600">Total Posts</div>
                            </div>
                            <div className="mt-4">
                                <div className="text-lg font-bold text-rose-600">{userComments ? userComments : <div>0</div> }</div>
                                <div className="text-sm font-medium text-gray-600">Comments</div>
                            </div>
                        </div>

                        <div className='flex items-center gap-5 md:gap-10'>
                            <div className="mt-2">
                                <div className="text-lg font-bold text-rose-600">{userLikes ? userLikes : <div>0</div>}</div>
                                <div className="text-sm font-medium text-gray-600">Total Likes</div>
                            </div>
                            <div className="mt-2">
                                <div className="text-lg font-bold text-rose-600">{creationDate ? creationDate : <BeatLoader size={10} />} </div>
                                <div className="text-sm font-medium text-gray-600">Joining Days</div>
                            </div>
                        </div>

                        {/* Admin Logo */}
                        <div className="absolute w-64 h-80 -top-20 -right-14  flex items-center justify-center">
                            <img src={AdminLogo} alt="Admin Logo" className="w-[100%] h-[100%] object-contain drop-shadow-xl shadow-black" />
                        </div>
                    </div>

                    {/* Recent Posts  */}
                    <div className="relative w-[99%] h-[340px] overflow-y-scroll rounded-md shadow-lg bg-gradient-to-r from-rose-200 to-rose-300 border border-gray-200 p-2 md:p-4 ">
                        {/* Header Section */}
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md shadow-sm mb-1">
                            <h2 className="text-lg font-bold text-gray-700">Recent Blogs</h2>
                            <Link
                                to="/add-post"
                                element={<AddPost />}
                                className="text-blue-500 hover:text-rose-600 font-medium underline"
                            >
                                Add Post
                            </Link>
                        </div>
                        {userPosts.length > 0 ? (
                            userPosts.slice(0, 5).map((post) => (
                                <div
                                    key={post.$id}
                                    onClick={(e) => handlePostOpen(e, post.$id)}
                                    className="flex items-center justify-between gap-4 bg-white p-1 md:p-3 rounded-md shadow-sm hover:shadow-md transition-shadow mb-1"
                                >
                                    <div className="flex item-center  gap-3">
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

                {/* Personal Details */}
                <div className="w-[100%] md:w-[50%] mt-16 xl:mt-0">
                    <h2 className="text-gray-600 text-2xl font-semibold mt-0 md:-mt-[80px]">Personal Details</h2>
                    <div className="bg-gradient-to-r from-rose-200 to-rose-300 shadow-md rounded-md p-6 ">
                        <form onSubmit={handleSubmitName(handleName)}>
                            {/* Username */}
                            <div className="mb-4">

                                <Input
                                    label="UserName "
                                    type="text"
                                    value={currentUser}
                                    className={`w-full px-4 py-3 rounded-md shadow-sm border border-gray-300  ${userNameEditable && 'focus:outline-none focus:ring-2focus:ring-blue-500'}`}
                                    placeholder="Enter your Name"
                                    readOnly={!userNameEditable}
                                    {...registerName("name", {
                                        required: "Name is required",
                                        onChange: (e) => setCurrentUser(e.target.value),
                                    })}
                                />
                            </div>
                            <Button bgColor='bg-rose-500 hover:bg-rose-600' className='mr-3' textColor='text-white' type='button' onClick={handleNameEditable}>Change UserName</Button>
                            {userNameEditable && (
                                <Button bgColor='bg-rose-400 hover:bg-rose-600' textColor='text-white' type='submit' >Save UserName</Button>
                            )}
                        </form>
                    </div>

                    {/* Email form  */}
                    <div className="bg-gradient-to-r from-rose-200 to-rose-300 shadow-md rounded-md p-6 mt-2">
                        <form onSubmit={handleSubmitEmail(handleEmail)} >
                            <div className='flex flex-col md:flex-row justify-between '>
                                <div className='mb-4'>
                                    <Input
                                        label="Email "
                                        type="email"
                                        value={currentUserEmail}
                                        readOnly={!userEmailEditable}
                                        className={`w-full px-4 py-3 rounded-md shadow-sm border border-gray-300   ${userEmailEditable && 'focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                                        placeholder="Enter your email"
                                        {...registerEmail("email", {
                                            required: "Email is required",
                                            onChange: (e) => setCurrentUserEmail(e.target.value)
                                        })}
                                    />
                                </div>
                                <div className="mb-4">
                                    <Input
                                        label="Password "
                                        type="password"
                                        readOnly={!userEmailEditable}
                                        className={`w-full px-4 py-3 rounded-md shadow-sm border border-gray-300   ${userEmailEditable && 'focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                                        placeholder="Enter your password"
                                        {...registerEmail("password", {
                                            required: "Password is required",
                                        })}
                                    />
                                </div>
                            </div>
                            <Button bgColor='bg-rose-500 hover:bg-rose-600' className='mr-0 md:mr-3' textColor='text-white' type='button' onClick={handleEmailEditable}>Change Email</Button>
                            {userEmailEditable && (
                                <Button bgColor='bg-rose-400 hover:bg-rose-600' textColor='text-white' type='submit' >Save UserName</Button>
                            )}
                        </form>
                    </div>

                    {/* Password COntainer  */}
                    <div className='bg-gradient-to-r from-rose-200 to-rose-300 shadow-md rounded-md p-6 mt-2'>
                        <form onSubmit={handleSubmitPassword(handleUpdatePass)} className='space-y-6'>

                            <div className="mb-4">
                                <Input
                                    label="Old Password "
                                    type="password"
                                    className='w-full px-4 py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder="Enter your password"
                                    {...registerPassword("oldpassword", {
                                        required: "Password is required",
                                    })}
                                />
                            </div>
                            <div className="mb-4">
                                <Input
                                    label="New Password "
                                    type="password"
                                    className='w-full px-4 py-3 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder="Enter your password"
                                    {...registerPassword("newpassword", {
                                        required: "Password is required",
                                    })}
                                />
                            </div>
                            <Button bgColor='bg-rose-500 hover:bg-rose-600' textColor='text-white' type='submit'>Change Password</Button>
                        </form>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Profile
