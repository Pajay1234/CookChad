const express = require('express')
const postController = require('../controllers/postController')
const router = express.Router()

router.post('/createPost', postController.createPost)
router.post('/getPosts', postController.getPosts)
router.get('/getPost/:postId', postController.getPostByID)
router.get('/getUserPost/:userID', postController.getUserPost)
router.get('/getRecipe', postController.getAdjustedRecipe)

module.exports = router