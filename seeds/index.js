const mongoose = require("mongoose");
const cities = require("all-the-cities");
const Wine = require("../models/wine");
const { type, variety, description } = require("../seeds/seedHelpers");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Wine.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const price = Math.floor(Math.random() * 60) + 10;
    const wine = new Wine({
      title: `${sample(type)} ${sample(variety)}`,
      location: `${randomCity.name}, ${randomCity.country}`,
      image: `https://source.unsplash.com/collection/9011778`,
      description: `${sample(description)}`,
      price,
    });
    await wine.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
