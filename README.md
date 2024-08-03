# Node-blog-post

Here are the key points for your README file:

Node.js and MongoDB Admin & Blog Management System
Project Overview
This project is a Node.js application that uses MongoDB for data storage. It features an admin panel for managing users and a blogging platform for users to create, edit, and delete their blog posts. The project ensures security through JWT authentication and encrypted responses.

# Features

Automatic admin user creation on project start.
Admin can create, edit, and delete users.
Users can create, edit, and delete their own blog posts.
Blog posts are listed with the latest posts appearing first.
Response data is encrypted for added security.

# Getting Started

Prerequisites
Node.js (latest version)
MongoDB (running locally or on a server)

# Installation

git clone https://github.com/ShyambHauper/Node-blog-post.git
cd Node-blog-post

# Install dependencies:

npm install
Create a .env file in the root directory and add your MongoDB URI and JWT secret:

PORT=3000
MONGO_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET_KEY=your_jwt_secret

# Start the project:

npm start
Admin Auto Seeder
On project start, a seeder script runs automatically to create an admin user if it doesn't exist.

# Admin Credentials

Username: admin
Password: admin123

# API Endpoints

1. Login

POST http://localhost:3000/api/v1/users/login
Request Body:
json
Copy code
{
"username": "admin",
"password": "admin123"
}
After successful login, the admin receives a token to manage users.

2. Add User

POST http://localhost:3000/api/v1/users
Request Body:
json
Copy code
{
"username": "newuser",
"password": "userpassword",
}

3. Edit User

PATCH http://localhost:3000/api/v1/users/:id
Request Body:
json
Copy code
{
"username": "updatedusername",
"password": "updatedpassword"
}

4. Delete User

DELETE http://localhost:3000/api/v1/users/:id

# User Endpoints

1. Login

POST http://localhost:3000/api/v1/users/login
Request Body:
json
Copy code
{
"username": "user",
"password": "userpassword"
}

2. Add Blog Post

POST http://localhost:3000/api/v1/blogs
Request Body:
json
Copy code
{
"title": "Blog Title",
"content": "Blog content"
}

3. Get Blog Posts

GET http://localhost:3000/api/v1/blogs

4. Edit Blog Post

PATCH http://localhost:3000/api/v1/blogs/:id
Request Body:
json
Copy code
{
"title": "Updated Blog Title",
"content": "Updated blog content"
}

5. Delete Blog Post

DELETE http://localhost:3000/api/v1/blogs/:id

# Note

Only users can create, edit, and delete their own blog posts.
Admins do not have permissions to manage blog posts.

# Response Encryption

All response data is encrypted for security. To view responses without encryption, comment out line 14 in index.js:

// app.use(encryptResponse); // Encrypt outgoing response body

# Decryption Utility

A decryption function is provided in utils/encryption.js to decrypt encrypted responses:
