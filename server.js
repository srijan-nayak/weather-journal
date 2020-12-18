const express = require("express");
const app = express();
app.use(express.static("public"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const port = 8080;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}/`);
});
