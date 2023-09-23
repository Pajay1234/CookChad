const mongoose = require('mongoose');
import Post from './postModel.js';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true, min: 5 },
    friends: { type: Array, default: [] }, 
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);