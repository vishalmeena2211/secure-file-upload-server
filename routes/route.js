const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { uploadFile, downloadFile, deleteFile } = require('../controllers/fileController');
const upload = require('../config/multer');

const router = express.Router();

// Route to upload a file
router.post('/upload', upload, uploadFile);

// Route to download a file
router.get('/download/:filename', downloadFile);

// Route to delete a file
router.delete('/delete/:filename', deleteFile);

module.exports = router;