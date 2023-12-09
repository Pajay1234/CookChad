const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true, min: 5 },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] }, 
    post: { type: Array, default: [] },
    likedPosts: { type: Array, default: []}
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);