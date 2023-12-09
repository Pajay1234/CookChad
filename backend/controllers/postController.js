const { ObjectId } = require('mongoose').Types
const Post = require('../models/postModel');
const axios = require('axios');
const dotenv = require('dotenv').config()
const { spawn } = require('child_process');

// Handles API calls to create a post
const createPost = async (req, res) => {
  try {
    const { caption, content, userId } = req.body;
    console.log("starting gpt call");
    const pythonProcess = spawn('python', ['backend/scripts/child_process.py', caption, process.env.GPT_KEY]);

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => {
      dataString = `${data}`
    });


    // Handling outputs from Python
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

        // Add post to user's posts
        const userResponse = await axios.post(`http://localhost:5000/api/user/createPostUser`, body);
    
        res.status(201).json(newPost);
      }
      post();
    });   
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

// Get adjusted recipe and returns it from whatever is outputted in Python
const getAdjustedRecipe = async (req, res) => { 
  const { caption, value } = req.query;
  console.log(caption)
  const pythonProcess = spawn('python', ['backend/scripts/adjusted_recipe.py', caption, process.env.GPT_KEY, value]);

  let dataString = '';
  pythonProcess.stdout.on('data', (data) => {
    dataString = `${data}`
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error from Python script: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    
    res.status(200).json({result: dataString});
  });  

}

// Get all posts in database
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// Get the post from the Post ID
const getPostByID = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// Get all posts from a user
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

// Adds likes or remove likes from a post
const likePost = async (req, res) => {
  try {
    const id = req.params.postId;
    const userId = req.body.userId;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    const body = {
      userId: userId,
      postId: id
    }
    let userResponse = {};
    if (isLiked) {
      post.likes.delete(userId);
      userResponse = await axios.post(`http://localhost:5000/api/user/removeFromLiked`, body);
      
    } else {
      post.likes.set(userId, true);
      userResponse = await axios.post(`http://localhost:5000/api/user/addToLiked`, body);
      
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

// Deletes a post from the database using the Post ID and the User ID
const deletePost = async (req, res) => {
  try {
    const id = req.params.postId;
    const userId = req.body.userId;

    const deletedPost = await Post.findByIdAndDelete(id);
    console.log(id)
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// Adds a new comment to the database
const createComment = async (req, res) => {
  try {
    const response = await Post.updateOne({_id: new ObjectId(req.body.pid)}, {$push: {  comments: {uid: new ObjectId(req.body.uid), name: req.body.name, comment: req.body.comment}}});
    if (!response) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json({ message: "Comment added successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

// Fetches all comments from a post
const fetchComments = async (req, res) => {
  try {
    const response = await Post.findOne({_id: new ObjectId(req.params.postId)}, {comments: 1});
    res.status(200).json(response);
  }
  catch (error) {
    res.status(404).json({ message: error.message });
  }
}
module.exports = { createPost, getPosts, getUserPost, likePost, getPostByID, getAdjustedRecipe, deletePost, createComment, fetchComments };