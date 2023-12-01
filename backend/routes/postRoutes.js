const express = require('express')
const postController = require('../controllers/postController')
const router = express.Router()

router.post('/createPost', postController.createPost)

module.exports = router