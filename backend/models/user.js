const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  /*
    CONSIDER REVERTING TO THE FOLLOWING 
    instead of saving the role to the user and having to look up that role every time we need to check if they can do something,
    save the the user's capabilities directly on their account. Then we can only look up roles when assigning one to the user,
    or checking which role they have if it matches a preset (if not, the user's role can be shown as "Custom").
    The downside is this will take up a bit more space in the database, but I don't plan on having end users be able to create an account anyway
    so the difference should be minimal.
  */
  roleName: {
    type: String,
  },
});
module.exports = mongoose.model("User", userSchema, "users");
