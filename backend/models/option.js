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
  //hidden options will not be exposed by the route that gets options, unless user is logged in as administrator.
  //this is so bots can't see your email or other sensitive options by inspecting the redux store or something.
  hidden: { type: Boolean, required: false },
});

module.exports = mongoose.model("Option", optionSchema, "options");
