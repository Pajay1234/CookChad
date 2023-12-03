const express = require('express')
const postController = require('../controllers/postController')
const router = express.Router()

router.post('/createPost', postController.createPost)
router.post('/getPosts', postController.getPosts)
router.patch('/like/:postId', postController.likePost)

router.get('/getPost/:postId', postController.getPostByID)

router.delete('/delete/:postId', postController.deletePost)
module.exports = router