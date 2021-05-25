const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Wine = require("./models/wine");
const methodOverride = require("method-override");

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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/wines", async (req, res) => {
  const wines = await Wine.find({});
  res.render("wines/index", { wines });
});

app.get("/wines/new", (req, res) => {
  res.render("wines/new");
});

app.post("/wines", async (req, res) => {
  const wine = new Wine(req.body.wine);
  await wine.save();
  res.redirect(`/wines/${wine._id}`);
});

app.get("/wines/:id", async (req, res) => {
  const wine = await Wine.findById(req.params.id);
  res.render("wines/show", { wine });
});

app.get("/wines/:id/edit", async (req, res) => {
  const wine = await Wine.findById(req.params.id);
  res.render("wines/edit", { wine });
});

app.put("/wines/:id", async (req, res) => {
  const { id } = req.params;
  const wine = await Wine.findByIdAndUpdate(id, { ...req.body.wine });
  res.redirect(`/wines/${wine._id}`);
});

app.delete("/wines/:id", async (req, res) => {
  const { id } = req.params;
  await Wine.findByIdAndDelete(id);
  res.redirect("/wines");
});

app.listen(3000, (req, res) => {
  console.log(`Listening on port 3000`);
});
