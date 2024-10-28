const mongoose = require("mongoose");

// Define the schema for the file model
const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        unique: true,
    },
    path: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    mimetype: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
});

// Create the model from the schema
const File = mongoose.model("File", fileSchema);

// Export the model to be used in other parts of the application
module.exports = File;
