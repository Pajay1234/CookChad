const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true, min: 5 },
    friends: { type: Array, default: [] }, 
    posts: { type: Array, default: [] }, 
    likedPosts: { type: Array, default: [] }, 
    savedPosts: { type: Array, default: [] }, 
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);