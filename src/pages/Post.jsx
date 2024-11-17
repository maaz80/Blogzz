import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import authService from "../appwrite/auth";
import Popup from "../components/Popup";


function Post() {
    const [post, setPost] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);
    const [userData, setUserData] = useState(null);
    const [createdAt, setCreatedAt] = useState('')
    const [isPopup, setIsPopup] = useState(false)
    const { slug } = useParams();
    const navigate = useNavigate();

    // Fetching User 
    useEffect(() => {
        const fetchUserData = async () => {
            const user = await authService.getCurrentUser();
            if (user) {
                setUserData(user);
            } else {
                navigate("/login");
            }
        };
        fetchUserData();
    }, []);

    // Fetching post according to slug 
    useEffect(() => {
        if (slug) {
            appwriteService.GetPost(slug).then((fetchedPost) => {
                if (fetchedPost) {
                    setPost(fetchedPost);
                    console.log('Post fetched');
                } else {
                    navigate("/");
                }

            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    // Checking authorization 
    useEffect(() => {
        if (post && userData) {
            console.log(userData.labels);
            console.log(post);
            setCreatedAt(post.$createdAt.slice(0, 10))

            if (userData.labels && userData.labels.includes('admin')) {
                setIsAuthor(true);
                return;
            }

            const permissionString = post.$permissions.find(permission =>
                permission.includes('user:')
            );

            if (permissionString) {
                const match = permissionString.match(/user:([a-zA-Z0-9\-]+)/);
                if (match) {
                    const postUserId = match[1]; // Extracted user ID
                    setIsAuthor(postUserId === userData.$id);
                    console.log(postUserId, userData.$id);
                } else {
                    setIsAuthor(false);
                }
            } else {
                setIsAuthor(false);
            }
        } else {
            setIsAuthor(false);
        }
    }, [post, userData]);

    // Delete post Function 
    const deletePost = () => {
        appwriteService.DeletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredimage);
                setIsPopup(true)
                setTimeout(() => {
                    setIsPopup(false)
                    navigate("/");
                }, 1000);
            }
        });
    };

    return post && userData ? (
        <div className="py-8 mx-2 md:mx-0  min-h-screen">
            <div className="flex flex-col md:flex-row items-start ">
                <div className="w-[100%] md:w-[60%] flex bg-white justify-center mb-4 relative  rounded-xl  h-60 md:h-[600px] mx-0 md:mx-2">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-xl w-[100%] object-cover shadow-md shadow-black"
                    />
                    {isAuthor && (
                        <div className="absolute right-2 md:right-6 top-2 md:top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-cyan-600" className="mr-1 md:mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-rose-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                    {isPopup && <Popup children={'Delete Succesfull!!!'} />}
                </div>
                <div className="flex justify-start items-start flex-col ml-0 md:ml-10 w-[100%] md:w-[30%]">
                    <div className="w-full mb-6 ">
                        <h1 className="text-2xl font-semibold mb-6 ">Created By: {post.UserName}</h1>
                        <h1 className="text-2xl font-semibold">Title : {post.title}</h1>
                    </div>
                    <div className="mb-6 font-semibold">Date: {createdAt}</div>
                    <div className="mb-6 font-semibold">Status: {post.status}</div>
                    <div className="browser-css">
                        {parse(post.content)}
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default Post;
