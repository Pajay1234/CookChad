const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/createUser', userController.setUser);
router.post('/getUserTokenByLogin', userController.getUserTokenByLogin);
router.post('/getUserByJWTToken', userController.getUserByJWTToken);

module.exports = router;