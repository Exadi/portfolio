const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Role = require("../models/role");
const Category = require("../models/category");
const capabilities = require("../enums").capabilities;

const validateLoginInput = require("../validation/login");

router.get("/setupRoles", (req, res) => {
  /*TODO this will error if either of the roles already exists since their names must be unique. 
  However, I may wish for users to be able to edit role names later, so the setup should probably put a flag in the database
  once complete. The setup routes can then check for that flag and do nothing if the setup was already completed.
  */

  const roles = [
    { roleName: "Admin", capabilities: [capabilities.admin] },
    { roleName: "Author", capabilities: [capabilities.createPosts] },
  ];

  Role.insertMany(roles, (error, savedRoles) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error saving roles" });
    }
    console.log("Roles saved successfully!");
    console.log(savedRoles);
    return res.status(200).json({ message: "Roles saved successfully!" });
  });
});

router.get("/setupCategories", (req, res) => {
  //as above, this will error if the categories have been created already, but this should be improved later
  const categories = [
    {
      name: "Projects",
      description: "",
      slug: "projects",
      parentCategory: null,
    },
  ];
  Category.insertMany(categories, (error, savedCategories) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error saving categories" });
    }
    console.log("Categories saved successfully!");
    console.log(savedCategories);
    return res.status(200).json({ message: "Categories saved successfully!" });
  });
});

router.get("/setupOptions", (req, res) => {
  //as above, this will error if the categories have been created already, but this should be improved later
  const options = [
    {
      name: "Site Title",
      value: "My Site",
      type: "text",
    },
    {
      name: "Header Text",
      value: "Welcome to the site!",
      type: "text",
    },
    {
      name: "Theme",
      value: "default",
      type: "theme",
    },
  ];
  Option.insertMany(options, (error, savedOptions) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error saving options" });
    }
    console.log("Options saved successfully!");
    console.log(savedOptions);
    return res.status(200).json({ message: "Options saved successfully!" });
  });
});

module.exports = router;
