const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5001;
app.use(cors());

require("./database");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

const users = require("./api/users");
app.use("/api/users", users);

app.get("/", (req, res) => {
  res.json({ headerText: "Hello World!" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
