const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  text: { type: String },
  excerpt: { type: String },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  datePublished: { type: Date },
  url: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Post", postSchema, "posts");
