const express = require("express");
const cors = require("cors");
const app = express();
const port = 5001;
app.use(cors());

app.get("/", (req, res) => {
  res.json({ headerText: "Hello World!" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
