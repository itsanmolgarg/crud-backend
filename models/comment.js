const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    profile: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    user: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    mbti: { type: String },
    zodiac: { type: String },
    enneagram: { type: String },
    title: { type: String },
    description: { type: String },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
