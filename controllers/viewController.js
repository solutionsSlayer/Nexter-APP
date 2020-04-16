const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Home = require("../models/homeModel");
const Booking = require("../models/bookingModel");

exports.getIndex = catchAsync(async (req, res, next) => {
  res.status(200).render("index");
});

exports.getHomes = catchAsync(async (req, res, next) => {
  const homes = await Home.find();

  res.status(200).render("homes", {
    homes
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).render('account');
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login");
});

exports.signup = catchAsync(async (req, res, next) => {
  res.status(200).render("signup");
});

exports.detail = catchAsync(async (req, res, next) => {
  const home = await Home.findOne({
    slug: req.params.slug
  }).populate({
    path: 'reviews'
  });

  if (!home) return next(new AppError("Something wrong, try later.", 404));

  res.status(200).render("detail", {
    home
  });
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({
    user: req.user._id
  })

  const homeIds = bookings.map(el => el.home);
  const homes = await Home.find({
    _id: {
      $in: homeIds
    }
  })

  res.status(200).render("bookings", {
    homes
  });
});