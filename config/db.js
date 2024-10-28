const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the connection string from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB,
        });

        // Log success message with the host name
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log error message and exit process with failure
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Export the connectDB function
module.exports = connectDB;