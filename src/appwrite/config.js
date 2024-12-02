import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    storage;
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client)

        if (this.client) {
            this.bucket = new Storage(this.client);
        } else {
            console.error("Appwrite client not initialized.");
        }

    }

    async createFeedback({ username, feedback, rating }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteFeedbackId,
                ID.unique(),
                {
                    username,
                    feedback,
                    rating
                }
            );
        } catch (error) {
            console.log("Error creating feedback: ", error);
        }
    }

    async getFeedbacks(queries=[]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteFeedbackId,
                queries
            )
        } catch (error) {
            console.log('Error getting feedback' + error);

        }
    }

    async GetFeedback(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteFeedbackId,
                slug
            )
        } catch (error) {
            console.log('Get Post' + error);
            return false;
        }
    }

    async UpdateFeedback(slug,{feedback, rating}) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteFeedbackId,
                slug,
                {
                    feedback,
                    rating
                }
            )
        } catch (error) {
            console.log('Update Feedback' + error);

        }
    }

    async DeleteFeedback(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteFeedbackId,
                slug
            )
            return true;
        } catch (error) {
            console.log('Delete Feedback' + error);
            return false;
        }
    }

    async CreatePost({ title, content, featuredimage, status, userid, UserName }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                ID.unique(),
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    userid,
                    UserName
                },

            );
        } catch (error) {
            console.log('Create post' + error);
            console.log("userid:", userid);
        }
    }

    async UpdatePost(slug, { title, content, featuredimage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status
                }
            )
        } catch (error) {
            console.log('UpdatePost' + error);

        }
    }

    async updatePostLikes(slug, updatedLikes) {
        try {
            const response = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                { likes: updatedLikes }
            );
            return response;
        } catch (error) {
            console.log('Error updating likes:', error);
        }
    }

    async updatePostComments(slug, updatedComments) {
        try {
            const response = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                { comments: updatedComments }
            )
            return response;
        } catch (error) {
            console.log('Adding Comment' + error);

        }
    }

    async DeletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log('Delete Post' + error);
            return false;
        }
    }

    async GetPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log('Get Post' + error);
            return false;
        }
    }

    async GetPosts(queries = [Query.equal('status', 'active')]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log('List Post ' + error);

        }
    }

    //File Upload services

    async uploadFile(file) {
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log('Upload File' + error);

        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log('Delete File' + error);
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.storage.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }

}
const service = new Service()
export default service;