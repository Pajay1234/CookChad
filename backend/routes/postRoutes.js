const express = require('express')
const postController = require('../controllers/postController')
const router = express.Router()

router.post('/createPost', postController.createPost)
router.post('/getPosts', postController.getPosts)
router.get('/getPost/:postId', postController.getPostByID)
module.exports = router