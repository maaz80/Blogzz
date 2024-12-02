import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button } from "../components";
import parse from "html-react-parser";
import authService from "../appwrite/auth";
import Popup from "../components/Popup";
import { BeatLoader } from "react-spinners";

function Post() {
    const [post, setPost] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);
    const [userData, setUserData] = useState(null);
    const [createdAt, setCreatedAt] = useState('');
    const [isPopup, setIsPopup] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [])

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
    }, [navigate]);

    // Fetching post according to slug
    useEffect(() => {
        if (slug) {
            appwriteService.GetPost(slug).then((fetchedPost) => {
                if (fetchedPost) {
                    setPost(fetchedPost);

                    setComments(fetchedPost.comments || []); // Initialize comments
                    setCreatedAt(fetchedPost.$createdAt.slice(0, 10));
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
            if (userData.labels && userData.labels.includes('admin')) {
                setIsAuthor(true);
                return;
            }

            const permissionString = post.$permissions.find(permission =>
                permission.includes('user:')
            );

            if (permissionString) {
                const match = permissionString.match(/user:([a-zA-Z0-9-]+)/);

                if (match) {
                    const postUserId = match[1];
                    setIsAuthor(postUserId === userData.$id);
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
                setIsPopup(true);
                setTimeout(() => {
                    setIsPopup(false);
                    navigate("/");
                }, 1000);
            }
        });
    };

    // Handle comment submission
    const handleCommentSubmit = async () => {
        if (comment.trim() === "") return;

        // Ensure each comment is stored as a string
        const updatedComments = [...comments, `${userData.name}: ${comment}`];
        const response = await appwriteService.updatePostComments(slug, updatedComments);

        if (response) {
            setComments(updatedComments);
            setComment(''); // Clear the comment box
        }
    };

    if (!userData) {
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

    return post && userData ? (
        <div className="py-8 mx-2 md:mx-0 min-h-screen">
            <div className="flex flex-col md:flex-row items-start ">
                <div className="w-[100%] md:w-[60%] flex bg-white justify-center mb-4 relative rounded-xl h-60 md:h-[450px] mx-0 md:mx-2">
                    <img
                        src={appwriteService.getFilePreview(post.featuredimage)}
                        alt={post.title}
                        className="rounded-xl w-[100%] object-cover shadow-md shadow-black"
                    />
                    {isAuthor && (
                        <div className="absolute right-2 md:right-6 top-2 md:top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-rose-400" className="mr-1 md:mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-rose-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                    {isPopup && <Popup>Delete Successful!!!</Popup>}

                </div>
                <div className="flex justify-start items-start flex-col ml-0 md:ml-10 w-[100%] md:w-[35%]">
                    <div className="w-full mb-6">
                        <h1 className="text-2xl font-semibold">Title : {post.title}</h1>
                    </div>
                    <h1 className="text-lg font-semibold mb-6">Created By: {post.UserName}</h1>
                    <div className="mb-6 font-semibold">Date: {createdAt}</div>
                    <div className="mb-6 font-semibold">Liked by {post.likes.length} people</div>
                    <div className="mb-6 font-semibold">Status: {post.status}</div>
                    <div className="browser-css h-52 w-full overflow-y-scroll">{parse(post.content)}</div>
                </div>
            </div>
            <div className="mt-6 mx-2">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                <div>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => {
                            const [name, commentText] = comment.split(": ");
                            return (
                                <div key={index} className="mb-4 p-4 border rounded-md bg-gray-100">
                                    <p className="font-medium text-blue-600">{name}</p>
                                    <p className="text-gray-800">{commentText}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
                    )}
                </div>
                <div className="mt-4">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-2 border rounded-md"
                    />
                    <Button bgColor="bg-blue-500 mt-2" onClick={handleCommentSubmit}>
                        Comment
                    </Button>
                </div>
            </div>

        </div>
    ) : null;
}

export default Post;
