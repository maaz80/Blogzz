const conf={
    appwriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteFeedbackCollectionId:String(import.meta.env.VITE_APPWRITE_FEEDBACK_COLLECTION_ID),
    appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    tinymceapikey:String(import.meta.env.VITE_TINYMCE_API_KEY)
}

  // process.env.<Nameofthevariable> in react
  // in vite use import.meta.env.Nameofthevariable
export default conf