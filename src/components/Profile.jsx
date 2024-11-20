import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import authService from '../appwrite/auth';
import AdminLogo from './images/Admin-Logo.png'
import Button from './Button';
import { Input } from './index';
import { useForm } from 'react-hook-form';

const Profile = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState('Unknown');
    const [currentUserEmail, setCurrentUserEmail] = useState('Unknown');
    const [userLabel, setUserLabel] = useState('')
    const { register: registerName, handleSubmit: handleSubmitName } = useForm()
    const { register: registerPassword, handleSubmit: handleSubmitPassword } = useForm()
    const { register: registerEmail, handleSubmit: handleSubmitEmail } = useForm()
    const [userNameEditable, setUserNameEditable] = useState(false)
    const [userEmailEditable, setUserEmailEditable] = useState(false)

    useEffect(() => {
        appwriteService.GetPosts().then((allposts) => {
            if (allposts) {
                console.log('Total Posts:', allposts.documents.length);

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
                console.log('User ID:', userData.$id);
                setCurrentUser(userData.name);
                setCurrentUserEmail(userData.email);

                if (userData.labels.includes('admin')) {
                    setUserLabel('Admin')
                } else {
                    setUserLabel('User')
                }
                console.log(userData);

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

    const handleEmail=(userEmail)=>{
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

    return (
        <div className='min-h-screen p-2 xl:p-10 '>
            <h1 className='text-gray-600 text-3xl font-semibold ml-0 xl:-ml-4 mt-0 xl:-mt-5 mb-10'>Welcome Back! 👋</h1>
            <div className="flex flex-wrap justify-around gap-2 xl:gap-0">

                <div className='w-[100%] md:w-[50%]'>
                    {/* User Card  */}
                    <div className="relative w-[99%] xl:w-80 h-56 rounded-md shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-200 p-4">
                        {/* Admin Information */}
                        <div className="text-xl font-semibold text-gray-700">{currentUser}</div>
                        <div className="text-sm font-medium text-gray-500">{userLabel}</div>
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
                </div>

                {/* Personal Details */}
                <div className="w-[100%] md:w-[50%] ">
                    <h2 className="text-gray-600 text-2xl font-semibold mt-0 md:-mt-[80px]">Personal Details</h2>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md rounded-md p-6 ">
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
                            <Button bgColor='bg-blue-400' className='mr-3' textColor='text-white' type='button' onClick={handleNameEditable}>Change UserName</Button>
                            {userNameEditable && (
                                <Button bgColor='bg-green-400' textColor='text-white' type='submit' >Save UserName</Button>
                            )}
                        </form>
                    </div>

                    {/* Email form  */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md rounded-md p-6 mt-2">
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
                                        onChange:(e)=>setCurrentUserEmail(e.target.value)
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
                            <Button bgColor='bg-blue-400' className='mr-0 md:mr-3' textColor='text-white' type='button' onClick={handleEmailEditable}>Change Email</Button>
                            {userEmailEditable && (
                                <Button bgColor='bg-green-400' textColor='text-white' type='submit' >Save UserName</Button>
                            )}
                        </form>
                    </div>

                    {/* Password COntainer  */}
                    <div className='bg-gradient-to-r from-blue-50 to-blue-100 shadow-md rounded-md p-6 mt-2'>
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
                            <Button bgColor='bg-blue-400' textColor='text-white' type='submit'>Change Password</Button>
                        </form>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Profile
