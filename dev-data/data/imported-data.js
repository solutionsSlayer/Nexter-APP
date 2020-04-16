const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Home = require("../../models/homeModel");
const Review = require("../../models/reviewModel");
const User = require("../../models/userModel");

dotenv.config({
  path: "./config.env"
});

const uri = process.env.DB_HOSTNAME.replace(
  "<password>",
  process.env.DB_PASSWORD
);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const homes = JSON.parse(fs.readFileSync(`${__dirname}/homes.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

const importData = async () => {
  try {
    await Home.create(homes);
    await Review.create(reviews);
    await User.create(users, {
      validateBeforeSave: false
    });
    console.log("Successful importation!");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

const deleteData = async () => {
  try {
    await Home.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log("Successful suppression!");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
}
if (process.argv[2] === "--delete") {
  deleteData();
}