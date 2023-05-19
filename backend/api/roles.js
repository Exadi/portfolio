const express = require("express");
const router = express.Router();

const Role = require("../models/role");
const jwt_decode = require("jwt-decode");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  Role.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/getrole", (req, res) => {
  Role.findOne({ roleName: req.body })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
