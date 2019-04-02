// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/blog');
const inputValidator = require('../controller/input-validation');
const checkAuth = require('../middileware/check-auth');

// Get Express Router Function..
const router = express.Router();

// Main GET posts Router..
router.get('/get-posts', controller.getAllPosts); // http://localhost:5000/api/get-posts
router.get('/get-posts-by-query', controller.getAllPostsByPagination); // http://localhost:5000/api/get-posts
router.post('/create-post', checkAuth, inputValidator.checkPostInput, controller.createPost); // http://localhost:5000/api/create-post
router.get('/get-post/:slugName', controller.getSinglePostBySlug); // http://localhost:5000/api/get-post/:slugName
router.get('/get-post/post-id/:postId', controller.getSinglePostById); // http://localhost:5000/api/get-post/post-id/:postId
router.put('/edit-post/:postId', checkAuth, inputValidator.checkPostInput, controller.updatePost); // http://localhost:5000/api/edit-post/:Id
router.delete('/delete-post/:postId', checkAuth, controller.deletePost); // http://localhost:5000/api/delete-post/:Id
router.get('/get-post-count', controller.blogPostCount); // http://localhost:5000/api/get-post-count

// Export All router..
module.exports = router;