const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  parentCategory: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String },
});

module.exports = mongoose.model("Category", categorySchema, "categories");
