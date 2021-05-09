const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  optionName: {
    type: String,
    unique: true,
  },
  optionValue: {
    type: String,
  },
});

module.exports = mongoose.model("Option", optionSchema, "options");
