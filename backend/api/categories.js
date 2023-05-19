const express = require("express");
const router = express.Router();

const Category = require("../models/category");
const Post = require("../models/post");
const jwt_decode = require("jwt-decode");

const capabilities = require("../enums").capabilities;
const getUserByName = require("./users").getUserByName;

router.get("/", (req, res) => {
  Category.aggregate([
    {
      $sort: { order: 1 },
    },
    {
      $graphLookup: {
        from: "categories",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parentCategory",
        as: "children",
        depthField: "depth",
      },
    },
    {
      $match: {
        parentCategory: null,
      },
    },
  ])
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/", (req, res) => {
  Category.find(req.body)
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

const addCategoryAndChildrenToArray = async (array, category) => {
  if (category.depth === undefined) category.depth = 0;

  array.push(category);
  const cat = await Category.find({ parentCategory: category._id }).lean();

  for (const c of cat) {
    c.depth = category.depth + 1;
    array = await addCategoryAndChildrenToArray(array, c);
  }

  return array;
};

router.get("/orderedCategories", async (req, res) => {
  //get the top level categories and recursively add their descendants to the array
  //such that child categories are directly after their parents
  //and adding a depth field so they can be indented on the front end

  //aggregation pipeline ended up not giving me what I want but I don't see a reason to change this
  //to a different way of getting the categories with no parent.
  Category.aggregate([
    {
      $match: {
        parentCategory: null,
      },
    },
  ])
    .then(async (categories) => {
      let newCategories = [];

      //use a recursive function to put the top-level categories and their children into a
      //new, flat array in the correct order
      for (const topLevelCategory of categories) {
        newCategories = await addCategoryAndChildrenToArray(
          newCategories,
          topLevelCategory
        );
      }

      res.json(newCategories);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.post("/getCategoryByName", (req, res) => {
  Category.findOne({ name: req.body.name })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/addCategory", async (req, res) => {
  const user = await getUserByName(jwt_decode(req.headers.authorization).name);

  if (user && user.capabilities.includes(capabilities.admin)) {
    const category = new Category(req.body);

    category
      .save()
      .then((category) => res.json(category))
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
          message: "Error creating category",
        });
      });
  } else {
    res.status(401);
  }
});

router.post("/updateCategory", async (req, res) => {
  const user = await getUserByName(jwt_decode(req.headers.authorization).name);
  if (user && user.capabilities.includes(capabilities.admin)) {
    const category = new Category(req.body);
    category.isNew = false;

    category
      .save()
      .then((category) => {
        res.json(category);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
          message: "Error updating category",
        });
      });
  } else {
    res.status(401);
  }
});

router.delete("/deleteCategory", async (req, res) => {
  const user = await getUserByName(jwt_decode(req.headers.authorization).name);
  if (user && user.capabilities.includes(capabilities.admin)) {
    const category = new Category(req.body);
    category.isNew = false;
    console.log(
      `User is authorized. Attempting to delete category ${category.name}`
    );

    try {
      const categoriesResult = await Category.updateMany(
        { parentCategory: category._id },
        { parentCategory: null }
      );
      console.log(
        `Removed category references from ${categoriesResult.nModified} categories.`
      );

      const postsResult = await Post.updateMany(
        { categories: { $in: [category._id] } },
        { $pull: { categories: category._id } }
      );
      console.log(
        `Removed category references from ${postsResult.nModified} posts.`
      );

      const deletedCategory = await category.delete();
      res.json(deletedCategory);
    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: err,
        message: "Error deleting category",
      });
    }
  } else {
    res.status(401);
  }
});

module.exports = router;
