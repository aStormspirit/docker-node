const express = require('express');

const postController = require('../controllers/postController');
const protect = require('../middleware/authMiddleware')

const router = express.Router();

router.route('/').get(postController.getAllPost).post(protect, postController.createPost)

router.route('/:id').get(postController.getSinglePost).patch(postController.updatePost).delete(postController.deletePost)

module.exports = router