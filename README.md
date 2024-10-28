# Secure Local File Upload using Node.js, Express, and Multer

This project demonstrates a secure local file upload system using Node.js, Express, and Multer. It supports uploading image files and PDFs.

## Features

- Upload image files (JPEG, PNG) and PDFs.
- Secure file handling.
- Simple and easy-to-understand codebase.

## API Documentation

### Routes

#### Upload a File
```
POST http://localhost:3000/api/upload
```
- **Consumes**: `multipart/form-data`
- **Parameters**:
    - `file` (form-data): The file to be uploaded.
- **Responses**:
    - `200`: An object containing the uploaded file details.
    - `default`: Unexpected error.

#### Download a File
```
GET http://localhost:3000/api/download/{filename}
```
- **Parameters**:
    - `filename` (path): The name of the file to be downloaded.
- **Responses**:
    - `200`: The requested file.
    - `default`: Unexpected error.

#### Delete a File
```
DELETE http://localhost:3000/api/delete/{filename}
```
- **Parameters**:
    - `filename` (path): The name of the file to be deleted.
- **Responses**:
    - `200`: An object containing the status of the deletion.
    - `default`: Unexpected error.

## Prerequisites

- Node.js installed on your machine.
- Basic knowledge of Node.js and Express.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/vishalmeena2211/secure-file-upload-server.git
    ```
2. Navigate to the project directory:
    ```sh
    cd secure-file-upload-server
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the server:
    ```sh
    npm run dev
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## File Upload

- The upload form accepts image files (JPEG, PNG) and PDFs.
- Files are stored in the `uploads` directory.

## Code Overview

### Dependencies

- **express**: Web framework for Node.js.
- **multer**: Middleware for handling `multipart/form-data`.


