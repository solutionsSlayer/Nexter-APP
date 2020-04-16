const mongoose = require("mongoose");

const app = require("./app");

/*eslint-disable-next-line*/
require("dotenv").config({
  path: `${__dirname}/config.env`
});

const uri = process.env.DB_HOSTNAME.replace(
  "<password>",
  process.env.DB_PASSWORD
);
const port = process.env.DB_PORT;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message, err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
