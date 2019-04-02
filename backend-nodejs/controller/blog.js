// Require Main Modules..
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');

// Require Post Schema from Model..
const Post = require('../models/posts');

// GET All Posts Controller..
const getAllPosts = (req, res, next) => {
    Post.find().sort({ createdAt: -1 })
    .then(posts => {
        // Main Response..
        res.status(200).json({
            post: posts,
            message: 'Get All Posts Succesfully!'
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}

// Get All Posts by Query Pagination..
const getAllPostsByPagination = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = req.query.page;
    const postQuery = Post.find().sort({ createdAt: -1 });
    let featchedPosts;

    if(pageSize && currentPage) {
        postQuery
        .skip(pageSize * (currentPage - 1 ))
        .limit(pageSize);
    }
    postQuery.then(document => {
        featchedPosts = document;
        return Post.countDocuments();
    })
    .then(countDocument => {
        // Main Response..
        res.status(200).json({
            post: featchedPosts,
            maxPosts: countDocument,
            message: 'Get All Posts Succesfully!'
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}

const blogPostCount = (req, res, next) => {
    Post.find()
    .then(document => {
        return Post.countDocuments();
    })
    .then(blogCount => {
        // Main Response..
        res.status(200).json({
            postCounter: blogCount,
            message: 'Get All Posts Count!'
        });
    });
}

// CREATE new post Controller..
const createPost = (req, res, next) => {
    const error = validationResult(req);
    // Check Input validation Error with Error Handelar..
    if(!error.isEmpty()) {
        const error = new Error('Input Validation Error!');
        error.statusCode = 422;
        throw error;
    }
    // Check Image validation Error with Error Handelar..
    if (!req.file) {
        const error = new Error('No Image Provided!');
        error.statusCode = 422;
        throw error;
    }
    // Main..
    const baseurl = req.protocol + '://' + req.get("host");
    const title = req.body.title;
    const content = req.body.content;
    const slugName = req.body.slugName;
    // const imageUrl = baseurl + req.file.path;
    const imageUrl = baseurl + "/images/" + req.file.filename;
    // const creator = req.body.creator;

    // Create Post on MongoDB..
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        slugName: slugName,
        creator: { name: 'Md Iqbal' }
    });
    post.save()
    .then(result => {
        res.status(201).json({
            post: result,
            message: 'Post Created Successfully!'
        });
        // console.log(result);
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })

}

// GET Single Post By Slug Controller..
const getSinglePostBySlug = (req, res, next) => {
    const slugName = req.params.slugName;
    Post.findOne({slugName: slugName})
        .then(post => {
            // When This Post are not available with Error Handelar..
            if (!post) {
                const error = new Error('Sorry! This post are not available.');
                error.statusCode = 404;
                throw error;
            }
            // Main Response..
            res.status(200).json({
                post: post,
                message: 'Succesfully Get The Post.'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

// GET Single Post By ID Controller..
const getSinglePostById = (req, res, next) => {
    const id = req.params.postId;
    Post.findById(id)
        .then(post => {
            // When This Post are not available with Error Handelar..
            if (!post) {
                const error = new Error('Sorry! This post are not available.');
                error.statusCode = 404;
                throw error;
            }
            // Main Response..
            res.status(200).json({
                post: post,
                message: 'Succesfully Get The Post.'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

// Edit/Update Single Post Controller..
const updatePost = (req, res, next) => {
    // Get Id From router..
    const id = req.params.postId;
    // Check Input validation Error with Error Handelar..
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const error = new Error('Input Validation Error!');
        error.statusCode = 422;
        throw error;
    }
    // Put Editted Value..
    const edtTitle = req.body.title;
    const edtContent = req.body.content;
    let edtImageUrl = req.body.imageUrl;
    const edtSlugName = req.body.slugName;
    // If Image Changes..
    if(req.file) {
        const baseurl = req.protocol + '://' + req.get("host");
        edtImageUrl = baseurl + "/images/" + req.file.filename;
    }
    // If No Image..
    if (!edtImageUrl) {
        const error = new Error('No Image file pick!');
        error.statusCode = 404;
        throw error;
    }
    // Main..
    Post.findById(id)
        .then(post => {
            // When This Post are not available with Error Handelar..
            if (!post) {
                const error = new Error('Sorry! This post are not available.');
                error.statusCode = 404;
                throw error;
            }
            // For Remove Unused Image..
            if (edtImageUrl.replace('http://localhost:5000/', '') !== post.imageUrl.replace('http://localhost:5000/', '')) {
                clearImage(post.imageUrl.replace('http://localhost:5000/', ''))
            }
            // Update Information..
            post.title = edtTitle;
            post.content = edtContent;
            post.imageUrl = edtImageUrl;
            post.slugName = edtSlugName;
            return post.save();
        })
        .then(result => {
            // Main Response..
            res.status(200).json({
                post: result,
                message: 'Succesfully Update The Post.'
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}

const deletePost = (req, res, next) => {
    // Get Id From router..
    const id = req.params.postId;
    // Main..
    Post.findById(id)
        .then(post => {
            // When This Post are not available with Error Handelar..
            if (!post) {
                const error = new Error('Sorry! This post are not available.');
                error.statusCode = 404;
                throw error;
            }
            let onlyImgPath = post.imageUrl;
            onlyImgPath = onlyImgPath.replace('http://localhost:5000/', '');
            // For Remove Unused Image..
            clearImage(onlyImgPath);
            return Post.findByIdAndRemove(id);
        })
        .then(result => {
            // Main Response..
            res.status(200).json({
                message: 'Succesfully Delete The Post.'
            });
            // console.log(result);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

// For Delete Image File from Folder..
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}

// Exports All Function..
exports.getAllPosts = getAllPosts;
exports.getAllPostsByPagination = getAllPostsByPagination;
exports.createPost = createPost;
exports.getSinglePostBySlug = getSinglePostBySlug;
exports.getSinglePostById = getSinglePostById;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.blogPostCount = blogPostCount;