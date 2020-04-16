const express = require("express");
const morgan = require("morgan");
const path = require("path");
const hpp = require("hpp");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

//START EXPRESS APP !!
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// SECURITY
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ["ratingsQuantity", "ratingsAverage", "price"]
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
});

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

const homeRoutes = require("./routes/homeRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const viewRoutes = require("./routes/viewRoutes");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use("/api", limiter);

app.use("/", viewRoutes);
app.use("/api/v1/homes", homeRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`No routes for ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;