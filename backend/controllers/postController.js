const { ObjectId } = require('mongoose').Types
const Post = require('../models/postModel');
const axios = require('axios');
const dotenv = require('dotenv').config()
const { spawn } = require('child_process');

const createPost = async (req, res) => {
  try {
    const { caption, content, userId } = req.body;
    console.log("starting gpt call");
    const pythonProcess = spawn('python3', ['backend/scripts/child_process.py', caption, process.env.GPT_KEY]);

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => {
      dataString = `${data}`
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python script: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      const post = async () => { 
        const newPost = new Post({
          caption: caption,
          content: content,
          creator: userId,
          likes: {},
          comments: [],
          recipe: dataString
        });
        console.log("done with gpt call");
        const doc = await newPost.save();
    
        const body = {
          uid: userId,
          pid: doc._id
        }
        const userResponse = await axios.post(`http://localhost:5000/api/user/createPostUser`, body);
    
        res.status(201).json(newPost);
      }
      post();
    });


   
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const getPostByID = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const getUserPost = async (req, res) => {
  try {
    const { userID }  = req.params;
    console.log(userID);
    const param = new ObjectId(userID);
    console.log(param);
    const post = await Post.find({ creator: param});
    console.log("bruh");
    console.log(post)
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const likePost = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.body.userId;
    const post = await Post.findById(req.params.id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    )

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = { createPost, getPosts, getUserPost, likePost, getPostByID };