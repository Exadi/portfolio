const express = require("express");
const router = express.Router();

const Option = require("../models/option");
const jwt_decode = require("jwt-decode");
const capabilities = require("../enums").capabilities;

const getUserByName = require("./users").getUserByName;

router.get("/", (req, res) => {
  Option.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/setoption", async (req, res) => {
  //saves/updates an array of options that may or may not already exist in the database

  const user = await getUserByName(jwt_decode(req.headers.authorization).name);

  if (user && user.capabilities.includes(capabilities.admin)) {
    for (i in req.body) {
      const option = new Option(req.body[i]);
      const foundOption = await Option.findOne({ _id: option._id });
      if (foundOption) option.isNew = false;
      await option.save();
    }
    Option.find().then((result) => {
      res.json({ success: true, options: result });
    });
  } else {
    res.json({ success: false });
  }
});

module.exports = router;
