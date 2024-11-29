import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Call another method
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            if (error.code === 401) {
                console.log("No authenticated user. User is a guest.");
                return null; 
            }
            console.error("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }
    

    async updateName(name) {
        try {
            return await this.account.updateName(name)
        } catch (error) {
            console.log("Appwrite service :: updateName :: error", error);
        }
    }
    
    async updateEmail({ email, password }) {
        try {
            return await this.account.updateEmail(email, password)
        } catch (error) {
            console.log("Appwrite service :: updateEmail :: error", error);
        }
    }

    async updatePassword({ newpassword, oldpassword }) {
        try {
            return await this.account.updatePassword(newpassword, oldpassword)
        } catch (error) {
            console.log("Appwrite service :: updatePassword :: error", error);
        }
    }
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }


}

const authService = new AuthService();

export default authService;
