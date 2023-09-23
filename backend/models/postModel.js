import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [String],
  selectedFile: String,
  likes: { type: Map, of: Boolean },
  comments: { type: Array, default: [] },
}, {
  timestamps: true
})

module.exports = mongoose.model("Post", postSchema);