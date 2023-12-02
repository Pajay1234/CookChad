const express = require('express')
const postController = require('../controllers/postController')
const router = express.Router()

router.post('/createPost', postController.createPost)
router.post('/getPosts', postController.getPosts)

module.exports = router