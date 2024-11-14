import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

function Post() {
    const [post, setPost] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false)
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (post && userData) {
            console.log(userData.labels);
            console.log(post);
            if (userData.labels && userData.labels.includes('admin')) {
                setIsAuthor(true)
                return
            }

            const permissionString = post.$permissions.find(permission => permission.includes('user:'));

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
    }, [post, userData, navigate, slug]);




    useEffect(() => {
        if (slug) {
            appwriteService.GetPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                    console.log('Hey there')
                }
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.DeletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredimage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2 h-[500px]">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-xl w-[100%] object-cover"
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
                <div className="w-full mb-6">
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