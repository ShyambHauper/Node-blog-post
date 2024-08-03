// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const { encryptResponse } = require('./middelware/encryptionMiddleware');


const app = express();
const PORT = process.env.PORT || 3000;

// Information route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "This is the 8DOTS interview task.",
        liveURL: "https://node-blog-post-hm95.vercel.app/",
        gitURL: "https://github.com/ShyambHauper/Node-blog-post.git",
        postmanCollection: "https://api.postman.com/collections/27182980-5e0e139d-3b7c-4b1d-a1a2-30859a897069?access_key=PMAT-01J4CR1RM3DJXZATS5PDE2KQB2",
    });
});

// Middleware
app.use(bodyParser.json());
app.use(encryptResponse); // Encrypt outgoing response body

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(async () => {
    console.log('Connected to MongoDB');

    // Run the seeder to check/create admin user
    const seedAdmin = require('./seeder');
    await seedAdmin();

    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Routes
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', postRouter);

