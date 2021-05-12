const express = require("express");
const router = express.Router();

const Option = require("../models/option");

router.get("/", (req, res) => {
  Option.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/setoption", (req, res) => {
  const user = jwt_decode(req.headers.authorization);
  console.log(user);
});

module.exports = router;
