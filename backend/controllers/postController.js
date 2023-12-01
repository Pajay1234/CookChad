const Post = require('../models/postModel');


const createPost = async (req, res) => {
  try {
    const { caption, content, userId } = req.body;
    const newPost = new Post({
      caption: caption,
      content: content,
      creator: userId,
      likes: {},
      comments: [],
    });
    await newPost.save();

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

const getUserPost = async (req, res) => {
  try {
    const {userId } = req.params;
    const post = await Post.find({ creator: userId });
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.body.userId;

    if (!post.likes[userId]) {
      post.likes[userId] = true;
    } else {
      post.likes[userId] = !post.likes[userId];
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

module.exports = { createPost, getPosts, getUserPost, likePost };