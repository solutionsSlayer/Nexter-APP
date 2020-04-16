const mongoose = require("mongoose");

const app = require("./app");

require('dotenv').config({
  path: `${__dirname}/config.env`
})

const uri = process.env.DB_HOSTNAME.replace(
  "<password>",
  process.env.DB_PASSWORD
);
const port = process.env.DB_PORT;

const DB = mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});