const mongoose = require("mongoose");
const path = require("path");

let envPath = path.resolve(__dirname, "../backend/.env");
require("dotenv").config({ path: envPath });
const uri = process.env.ATLAS_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.log(err));
