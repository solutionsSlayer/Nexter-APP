const mongoose = require("mongoose");

const app = require("./app");

require("dotenv").config({
  path: `${__dirname}/config.env`
});

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const port = process.env.DB_PORT || 3000;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
