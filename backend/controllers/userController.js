const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 
const { ObjectId } = require('mongoose').Types
const Post = require('../models/postModel');

const setUser = async (req, res) => {
  const user = req.body;
  user.email = user.email.toLowerCase();
  user.password = await bcrypt.hash(user.password, 10);
  const newUser = new User(user);
  try {
    await newUser.save(); 
    res.status(201).json(newUser);
  } catch (error) {
    console.log("error: " + error.message);
    res.status(409).json({ message: error.message });
  }
}

const getUserTokenByLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerCaseEmail });
    let token = null;
    if (await bcrypt.compare(password, user.password)) {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(200).json(token);
    }
    else {
      res.status(200).json(null);
    }
    
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


const getUserByJWTToken = async (req, res) => {
  try {
    const { JWTToken } = req.body;
    jwt.verify(JWTToken, process.env.JWT_SECRET)
    const userID = jwt.decode(JWTToken);
    const user = await User.findOne({ _id: userID.id }, {name: 1, email: 1});
    res.status(200).json(user);
  } catch (error) {  
    res.status(404).json({ message: error.message });
  } 
}

const createPostUser = async (req, res) => {
  try {

    console.log(req.body);
    const response = await User.updateOne({_id: new ObjectId(req.body.uid)}, {$push: {post: req.body.pid}});
    console.log(response);
    res.status(200).json({msg: 1});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const getUserByID = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: new ObjectId(userId) }, {name: 1, email: 1});
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  } 
}

const getUserPosts = async (req, res) => {
  try {
    
    const posts = await User.find({_id: new ObjectId(req.body.uid)}, {post: 1}).exec();
    
    const fullPosts = await Promise.all(
      posts[0].post.map((id) => Post.findById(id))
    );
   
    res.status(200).json(fullPosts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const addToLiked = async (req, res) => {
  try {
    console.log(req.body);
    const uid = req.body.userId;
    const pid = req.body.postId;
    const doc = await User.updateOne({_id: new ObjectId(uid)}, { $push: { likedPosts: `${pid}`} });
    
    res.status(200).json({msg : 1});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const removeFromLiked = async (req, res) => {
  try {
    const uid = req.body.userId;
    const pid = req.body.postId;
    const doc = await User.updateOne({_id: new ObjectId(uid)}, { $pull: { likedPosts: `${pid}`} });
    res.status(200).json({msg : 1});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


// not completed
const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    res.status(200).json(friends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = { setUser, getUserTokenByLogin, getUserByJWTToken, getUserByID, getUserFriends, createPostUser, getUserPosts, addToLiked, removeFromLiked };
