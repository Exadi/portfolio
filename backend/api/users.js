const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Role = require("../models/role");

const validateLoginInput = require("../validation/login");

const hashPassword = (user) => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
};

const getUserByName = async (userName) => {
  console.log(`getUserByName ${userName}`);
  try {
    const user = await User.findOne({ userName: userName });
    const role = await Role.findOne({ roleName: user.roleName });
    return { ...user._doc, capabilities: role.capabilities };
  } catch (err) {
    console.log(err);
    return null;
  }
};

router.post("/register", (req, res) => {
  if (!(req.body.userName && req.body.password)) {
    return res.status(400);
  }
  const { userName } = req.body;
  User.findOne({ userName: userName }).then((user) => {
    if (user) {
      return res.status(400).json({ error: "Username already exists." });
    } else {
      const newUser = new User(req.body);

      hashPassword(newUser);

      newUser
        .save()
        .then((user) => res.json(user))
        .catch((err) => {
          res.status(400).json({
            error: err,
            message: "Error creating account",
          });
        });
    }
  });
});

router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json({ loginerror: errors });
  }
  const userName = req.body.userName;
  const password = req.body.password;
  User.findOne({ userName })
    .select("+password")
    .then((user) => {
      // Check if user exists
      if (!user) {
        return res
          .status(404)
          .json({ loginerror: "Username or password is invalid." });
      } // Check password

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.userName,
          }; // Sign token
          jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
              });
            }
          );
        } else {
          //if no password is set inform the user it must be reset
          bcrypt.compare("", user.password).then((isMatch) => {
            if (isMatch) {
              return res.status(400).json({
                loginerror: "The password of this account must be reset.",
              });
            } else {
              return res
                .status(400)
                .json({ loginerror: "Username or password is invalid." });
            }
          });
        }
      });
    });
});

module.exports = { router, getUserByName: getUserByName };
