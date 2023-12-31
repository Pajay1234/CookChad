const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ObjectId } = require('mongoose').Types
const Post = require('../models/postModel');

// Adds a user to the database from the registration form
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

// Gets the user token from the email and password.
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


// Gets the user token from the JWT token
const getUserByJWTToken = async (req, res) => {
  try {
    const { JWTToken } = req.body;
    jwt.verify(JWTToken, process.env.JWT_SECRET)
    const userID = jwt.decode(JWTToken);
    const user = await User.findOne({ _id: userID.id }, { name: 1, email: 1 });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// Adds the post to the user's list of posts
const createPostUser = async (req, res) => {
  try {

    console.log(req.body);
    const response = await User.updateOne({ _id: new ObjectId(req.body.uid) }, { $push: { post: req.body.pid } });
    console.log(response);
    res.status(200).json({ msg: 1 });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


// Gets the user by the user ID
const getUserByID = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: new ObjectId(userId) }, { name: 1, email: 1, followers: 1, following: 1, post: 1, likedPosts: 1 });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// Gets all the posts from the users
const getUserPosts = async (req, res) => {
  try {

    const posts = await User.find({ _id: new ObjectId(req.body.uid) }, { post: 1 }).exec();

    const fullPosts = await Promise.all(
      posts[0].post.map((id) => Post.findById(id))
    );

    res.status(200).json(fullPosts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


// Add to list of user's liked posts
const addToLiked = async (req, res) => {
  try {
    console.log(req.body);
    const uid = req.body.userId;
    const pid = req.body.postId;
    const doc = await User.updateOne({ _id: new ObjectId(uid) }, { $push: { likedPosts: `${pid}` } });

    res.status(200).json({ msg: 1 });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


// remove from list of likes
const removeFromLiked = async (req, res) => {
  try {
    const uid = req.body.userId;
    const pid = req.body.postId;
    const doc = await User.updateOne({ _id: new ObjectId(uid) }, { $pull: { likedPosts: `${pid}` } });
    res.status(200).json({ msg: 1 });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


// get user friends
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

// when unfollowing or following, remove or push to following / followers 
const addRemoveFriend = async (req, res) => {
  try {
    const id = req.params.currUserId;
    const friendId = req.params.friendId;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user.following.includes(friendId)) {
      user.following.push(friendId);
      friend.followers.push(id);
    } else {
      user.following = user.following.filter((id) => id !== friendId);
      friend.followers = friend.followers.filter((id) => id !== id);
    }

    await user.save();
    await friend.save();

    res.status(200).json("Added / Removed Friend");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  setUser,
  getUserTokenByLogin,
  getUserByJWTToken,
  getUserByID,
  getUserFriends,
  createPostUser,
  getUserPosts,
  addToLiked,
  removeFromLiked,
  addRemoveFriend
};
