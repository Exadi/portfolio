const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  value: {
    type: String,
  },
  type: { type: String },
});

module.exports = mongoose.model("Option", optionSchema, "options");
