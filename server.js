const mongoose = require("mongoose");

const app = require("./app");

/*eslint-disable-next-line*/
require("dotenv").config({
  path: `${__dirname}/config.env`
});

const uri = 'mongodb+srv://Dorian:m5UwTj2mgpWtJxRr@cluster0-f3gw3.mongodb.net/test?retryWrites=true'
const port = process.env.DB_PORT || 3000;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});