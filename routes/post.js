// routes/post.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middelware/auth');

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const createdBy = req.user._id;

    if (req.user.role !== 'user') {
        return res.status(403).json({ status: false, data: null, error: 'Only regular users can create blog posts.' });
    }

    if (!title || !content) {
        return res.status(400).json({ status: false, data: null, error: 'Title and content are required!' });
    }
    try {
        const newPost = new Post({ title, content, createdBy });
        await newPost.save();
        res.status(201).json({ status: true, data: { blog: newPost }, message: 'Blog created successfully!' });
    } catch (error) {
        res.status(500).json({ status: false, data: null, error: error.message });
    }
});

// Fetch and list posts
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ status: false, data: null, error: 'Only regular users can create blog posts.' });
        }
        const posts = await Post.find({ createdBy: req.user._id }).lean().sort({ createdAt: -1 }).populate('createdBy', 'username');
        res.status(200).json({ status: true, data: { blogs: posts }, message: 'Blogs fetched successfully!' });
    } catch (error) {
        res.status(500).json({ status: false, data: null, error: error.message });
    }
});

// Edit a post
router.patch('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'user') {
        return res.status(403).json({ status: false, data: null, error: 'Only regular users can update blog posts.' });
    }
    try {
        const post = await Post.findOneAndUpdate(
            { _id: id, createdBy: req.user._id },
            req.body,
            { new: true, runValidators: true }
        ).lean()

        if (!post) {
            return res.status(404).json({ status: false, data: null, message: 'Blog not found or not authorized!' });
        }

        res.status(200).json({ status: true, data: { blog: post }, message: 'Blog updated successfully!' });
    } catch (error) {
        res.status(500).json({ status: false, data: null, error: error.message });
    }
});

// Delete a post
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'user') {
        return res.status(403).json({ status: false, data: null, error: 'Only regular users can delete blog posts.' });
    }

    try {
        const post = await Post.findOneAndDelete({ _id: id, createdBy: req.user._id }).lean()

        if (!post) {
            return res.status(404).json({ status: false, data: null, message: 'Blog not found or not authorized!' });
        }

        res.status(200).json({ status: true, data: null, message: 'Blog deleted successfully!' });
    } catch (error) {
        res.status(500).json({ status: false, data: null, error: error.message });
    }
});

module.exports = router;
