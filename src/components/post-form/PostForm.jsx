import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import authService from "../../appwrite/auth";
import Popup from "../Popup";

export default function PostForm({ post }) {
    const [currentUserData, setCurrentUserData] = useState("");
    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
            userid: post?.userid || "",
            UserName: currentUserData || "Unknown",
        },
    });
    const [isPopup, setIsPopup] = useState(false);
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setCurrentUserData(currentUser.name);
            } else {
                console.log("User Not Found");
            }
        };
        fetchUserData();
    }, [post, navigate]);

    useEffect(() => {
        if (currentUserData) {
            setValue("UserName", currentUserData);
        }
    }, [currentUserData, setValue]);

    const submit = async (data) => {
        if (!data.userid) {
            data.userid = `user-${Math.floor(Math.random() * 1000000)}`;
        } else {
            data.userid = userData?.$id || data.userid;
        }
    
        const defaultImageUrl = "https://www.eadion.com/templates/yootheme/cache/1e/CELEBRATING-1e3f94e3.jpeg";
        
        // Check if image is provided by user
        const file = data.image && data.image[0] 
            ? await appwriteService.uploadFile(data.image[0]) 
            : null;
    
        if (post) {
            if (!file) {
                // Use default image if no new image is provided
                data.featuredimage = post.featuredimage || defaultImageUrl;
            } else {
                // Upload new image and delete old one
                if (post.featuredimage) {
                    appwriteService.deleteFile(post.featuredimage);
                }
                data.featuredimage = file.$id;
            }
    
            const dbPost = await appwriteService.UpdatePost(post.$id, {
                ...data,
                featuredimage: data.featuredimage,
            });
    
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            if (!file) {
                // Use default image for new post if no image provided
                data.featuredimage = defaultImageUrl;
            } else {
                data.featuredimage = file.$id;
            }
    
            const dbPost = await appwriteService.CreatePost({ ...data, userid: data.userid });
            setIsPopup(true);
            setTimeout(() => {
                setIsPopup(false);
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }, 1000);
        }
    };    

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap flex-col md:flex-row">
            <div className="w-full md:w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", {
                        required: "Title is required",
                        minLength: { value: 10, message: "Title must be at least 10 characters" },
                        maxLength: { value: 17, message: "Title cannot exceed 17 characters" },
                        validate: (value) =>
                            /^[a-zA-Z\s]+$/.test(value) || "Title must only contain letters and spaces",
                    })}
                    
                />
                {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}

                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                {errors.slug && (
                    <p className="text-red-500 text-sm">{errors.slug.message}</p>
                )}

                <RTE
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                />
                {errors.content && (
                    <p className="text-red-500 text-sm">Content is required</p>
                )}
            </div>

            <div className="w-full md:w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post && "Featured image is required" })}
                />
                {errors.image && (
                    <p className="text-red-500 text-sm">{errors.image.message}</p>
                )}

                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredimage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: "Status is required" })}
                />
                {errors.status && (
                    <p className="text-red-500 text-sm">{errors.status.message}</p>
                )}

                <Button type="submit" bgColor={post ? "bg-rose-800" : undefined} className="w-full bg-rose-600 hover:bg-rose-800">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
            {isPopup && <Popup children={"Post Updated Successfully!!"} />}
        </form>
    );
}
