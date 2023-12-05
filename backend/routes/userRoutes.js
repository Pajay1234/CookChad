const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/createUser', userController.setUser);
router.post('/getUserTokenByLogin', userController.getUserTokenByLogin);
router.post('/getUserByJWTToken', userController.getUserByJWTToken);
router.get('/getUser/:userId', userController.getUserByID);
router.post('/createPostUser', userController.createPostUser);
router.post('/getUserPosts', userController.getUserPosts);
router.post('/getUserPosts', userController.getUserPosts);
router.post('/addToLiked', userController.addToLiked);
router.post('/removeFromLiked', userController.removeFromLiked);


module.exports = router;