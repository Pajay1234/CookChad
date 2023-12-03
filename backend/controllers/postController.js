const { ObjectId } = require('mongoose').Types
const Post = require('../models/postModel');
const axios = require('axios');
const dotenv = require('dotenv').config()

const createPost = async (req, res) => {
  try {
    const { caption, content, userId } = req.body;
    const gptRequest = { 
      "model": "gpt-3.5-turbo",
        "messages": [
          {
              "role": "user",
              "content": `In this caption, detect a food: "${caption}" and give me a recipe for it.`
          }
        ],
      "temperature": 0.7
    }
    const header = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.GPT_KEY
      }
    }
    console.log("starting gpt call");
    //const response = await axios.post('https://api.openai.com/v1/chat/completions', gptRequest, header)
    const newPost = new Post({
      caption: caption,
      content: content,
      creator: userId,
      likes: {},
      comments: [],
      //recipe: response.data.choices[0].message.content
      recipe: "will display recipe later"
    });
    console.log("done with gpt call");
    const doc = await newPost.save();

    const body = {
      uid: userId,
      pid: doc._id
    }
    const userResponse = await axios.post(`http://localhost:5000/api/user/createPostUser`, body);


    res.status(201).json(newPost);
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