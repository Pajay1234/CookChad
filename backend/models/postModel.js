const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  caption: { type: String, required: true },
  content: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [String],
  likes: { type: Map, of: Boolean },
  comments: { type: Array, default: [] },
}, {
  timestamps: true
})

module.exports = mongoose.model("Post", postSchema);