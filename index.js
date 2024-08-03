// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const { encryptResponse } = require('./middelware/encryptionMiddleware');


const app = express();
const PORT = process.env.PORT || 3000;

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

