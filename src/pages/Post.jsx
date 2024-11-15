import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import authService from "../appwrite/auth";


function Post() {
    const [post, setPost] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);
    const [userData, setUserData] = useState(null);
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
                navigate("/");
            }
        });
    };

    return post && userData ? (
        <div className="py-8 mx-2 md:mx-0">
            <Container>
                <div className="w-full flex bg-white justify-center mb-4 relative  rounded-xl  h-[500px] mx-0 md:-mx-2">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-xl w-[100%] object-cover shadow-md shadow-rose-400"
                    />
                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6 ">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}

export default Post;
