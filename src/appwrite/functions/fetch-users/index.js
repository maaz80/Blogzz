const { Client, Users } = require('node-appwrite');
const { default: conf } = require('../../../conf/conf');

module.exports = async function (req, res) {
    // Initialize Appwrite client
    const client = new Client();
    const users = new Users(client);

    client
        .setEndpoint(`${conf.appwriteUrl}`) // Your Appwrite endpoint
        .setProject(`${conf.appwriteProjectId}`) // Replace with your Project ID
        .setKey(`${conf.appwriteusersapikey}`); // Replace with your API key with access to the Users scope

    try {
        const allUsers = await users.list(); // Fetch all users
        res.json({
            users: allUsers,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.json({
            error: error.message,
        });
    }
};
