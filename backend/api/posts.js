const express = require("express");
const router = express.Router();

const Post = require("../models/post");
const jwt_decode = require("jwt-decode");
const mongoose = require("mongoose");
const Category = require("../models/category");

const capabilities = require("../enums").capabilities;
const getUserByName = require("./users").getUserByName;

router.get("/", (req, res) => {
  Post.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/", async (req, res) => {
  const query = { ...req.body };

  if (req.body.categories) {
    if (!mongoose.Types.ObjectId.isValid(req.body.categories)) {
      try {
        const category = await Category.findOne({
          slug: req.body.categories,
        }).lean();
        query.categories = { $in: [category._id] };
      } catch {
        res
          .status(400)
          .json({ err: `Error finding category '${req.body.categories}'.` });
        return;
      }
    } else {
      query.categories = { $in: [req.body.categories] };
    }
  }

  Post.find(query)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get("/getAggregatedPosts", (req, res) => {
  /*instead of returning author and category IDs only, this route
    replaces author and categories fields with the full user/category objects
    */
  Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "categories",
        localField: "categories",
        foreignField: "_id",
        as: "categories",
      },
    },
  ]).then((posts) => {
    console.log(posts);
    res.json(posts);
  });
});

router.post("/addPost", async (req, res) => {
  const user = await getUserByName(jwt_decode(req.headers.authorization).name);

  if (
    (user && user.capabilities.includes(capabilities.admin)) ||
    user.capabilities.includes(capabilities.createPosts)
  ) {
    const post = new Post(req.body);
    console.log(post);

    post
      .save()
      .then((post) => res.json(post))
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
          message: err._message,
        });
      });
  } else {
    res.status(401);
  }
});

router.post("/updatePost", async (req, res) => {
  const user = await getUserByName(jwt_decode(req.headers.authorization).name);
  const post = await Post.find({ _id: req.body._id });
  if (!post) {
    res.status(400).json({
      error: err,
      message: "Post not found",
    });
  }
  if (
    (user && user.capabilities.includes(capabilities.admin)) ||
    (user.capabilities.includes(capabilities.createPosts) &&
      user._id === post.author)
  ) {
    Post.updateOne({ _id: req.body._id }, { ...req.body })
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
          message: err._message,
        });
      });
  } else {
    res.status(401);
  }
});

router.delete("/deletePost", async (req, res) => {
  const user = await getUserByName(jwt_decode(req.headers.authorization).name);
  const post = await Post.findOne({ _id: req.body._id });
  if (
    (user && user.capabilities.includes(capabilities.admin)) ||
    user._id === post.author
  ) {
    console.log(`User is authorized. Attempting to delete post ${post.title}`);

    try {
      const deletedPost = await post.delete();
      res.json(deletedPost);
    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: err,
        message: "Error deleting post",
      });
    }
  } else {
    res.status(401);
  }
});

module.exports = router;
