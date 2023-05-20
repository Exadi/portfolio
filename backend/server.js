const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5001;
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer");
app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

const users = require("./api/users");
app.use("/api/users", users.router);

const options = require("./api/options");
app.use("/api/options", options);

const categories = require("./api/categories");
app.use("/api/categories", categories);

const posts = require("./api/posts");
app.use("/api/posts", posts);

const setup = require("./api/setup");
app.use("/api/setup", setup);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "build")));

app.get("*", function (_, res) {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    res.status(500).send(err);
  });
});

// Serve the theme files
app.use("/themes", express.static(path.join(__dirname, "themes")));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `public/uploads/${req.params.userID}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const returnPath = (req, res) => {
  if (req.body.path) {
    console.log(req.file);
    const newPath = `public\\${req.body.path}\\${
      req.body.filename
        ? req.body.filename + `.${req.file.originalname.split(".").pop()}`
        : req.file.originalname
    }`;
    fs.rename(req.file.path, newPath, (err) => {
      if (err) throw err;
      console.log("file moved");
    });

    let path = newPath.replace(/\\/g, "/").replace("public", "");
    return res.status(200).send({ location: path });
  }
  let path = req.file.path.replace(/\\/g, "/").replace("public", "");
  return res.status(200).send({ location: path });
};

var uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png|bmp|gif/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      "The file's extension is not recognized as an image. (.bmp, .gif, .jpg, .jpeg, .png)."
    );
  },
}).single("file");

app.post("/uploadImage/:userID", (req, res) => {
  console.log(`Attempting upload by user ${req.params.userID}`);
  uploadImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(500).json(err);
    } else if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    returnPath(req, res);
  });
});

const mongoose = require("mongoose");

let envPath = path.resolve(__dirname, "../backend/.env");
require("dotenv").config({ path: envPath });
const uri = process.env.ATLAS_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
