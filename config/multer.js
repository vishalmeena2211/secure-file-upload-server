const multer = require('multer');
const path = require('path');
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

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB in bytes
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('file');

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        logger.error(`File upload error: Invalid file type - ${file.originalname}`);
        cb(new Error('Error: This File Type is not Allowed!'));
    }
}

module.exports = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            logger.error(`File upload error: ${err.message}`);
            return res.status(400).send({ error: err.message });
        }
        next();
    });
};