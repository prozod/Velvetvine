const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Wine = require("./models/wine");

mongoose.connect("mongodb://localhost:27017/velvetvine", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/wines", async (req, res) => {
  const wines = await Wine.find({});
  res.render("wines/index", { wines });
});

app.listen(3000, (req, res) => {
  console.log(`Listening on port 3000`);
});
