const File = require("../models/fileModel");
const fs = require("fs");
const path = require("path");
const { z } = require("zod");
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/upload.log' })
    ]
});

// Define schema for file validation using zod
const fileSchema = z.object({
    filename: z.string(),
    path: z.string(),
    size: z.number(),
    mimetype: z.string(),
});

// Controller function to handle file upload
exports.uploadFile = async (req, res) => {
    // Check if file is uploaded
    if (!req.file) {
        logger.warn("No file uploaded");
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Prepare file data for validation and saving
    const fileData = {
        filename: req.file.filename,
        path: path.resolve(req.file.path),
        size: req.file.size,
        mimetype: req.file.mimetype,
    };

    // Validate file data
    const validation = fileSchema.safeParse(fileData);

    // Handle validation errors
    if (!validation.success) {
        logger.warn("File validation failed", validation.error.errors);
        return res.status(400).json({ errors: validation.error.errors });
    }

    try {
        // Save file data to the database
        const file = new File(fileData);
        await file.save();

        file.path = undefined; // Remove file path from response
        file.__v = undefined; // Remove version key from response

        logger.info(`File uploaded and saved successfully: ${file.filename}`);
        res.status(200).json({
            message: "File uploaded and saved successfully",
            file,
        });
    } catch (error) {
        logger.error("Error saving file to database:", error);
        // Handle duplicate file name error
        if (error.code === 11000) {
            return res.status(409).json({ error: "File name already exists" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};
// Controller function to handle file download
exports.downloadFile = async (req, res) => {
    try {
        let file;
        // Check if filename is provided
        if (req.params.filename) {
            file = await File.findOne({ filename: req.params.filename });
        } else {
            logger.warn("Filename not provided");
            return res.status(400).json({ error: "Filename not provided" });
        }

        if (!file) {
            logger.warn(`File not found: ${req.params.filename}`);
            return res.status(404).json({ error: "File not found" });
        }

        const filePath = path.resolve(file.path);
        if (!fs.existsSync(filePath)) {
            logger.warn(`File path does not exist: ${filePath}`);
            return res.status(404).json({ error: "File not found on server" });
        }

        logger.info(`File downloaded: ${file.filename}`);
        res.download(filePath, file.filename);
    } catch (error) {
        logger.error("Error downloading file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to handle file deletion
exports.deleteFile = async (req, res) => {
    try {
        let file;
        // Check if filename is provided
        if (req.params.filename) {
            file = await File.findOne({ filename: req.params.filename });
        } else {
            logger.warn("Filename not provided");
            return res.status(400).json({ error: "Filename not provided" });
        }

        if (!file) {
            logger.warn(`File not found: ${req.params.filename}`);
            return res.status(404).json({ error: "File not found" });
        }

        const filePath = path.resolve(file.path);
        if (!fs.existsSync(filePath)) {
            logger.warn(`File path does not exist: ${filePath}`);
            return res.status(404).json({ error: "File not found on server" });
        }

        fs.unlinkSync(filePath);
        await file.remove();

        logger.info(`File deleted successfully: ${file.filename}`);
        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        logger.error("Error deleting file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
