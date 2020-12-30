const express = require("express");
const app = express();
app.use(express.static("public"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const projectData = [];

// router for handling handle requests to /entries/*
const entriesRouter = express.Router();
app.use("/entries", entriesRouter);

// GET route for entries; returns the global project data
entriesRouter.get("/", (req, res) => {
  res.send(projectData);
  console.log("Data fetched through GET route:");
  console.log(projectData);
});

// POST route for entries; adds new entry data to the global project data
entriesRouter.post("/post", (req, res) => {
  const newEntry = req.body;
  projectData.unshift(newEntry); // add new entry at the beginning
  console.log("New entry added through POST route:");
  console.log(newEntry);
  res.send("New entry added");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}/`);
});
