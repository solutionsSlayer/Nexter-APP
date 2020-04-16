const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// router.get("/login", viewController.login);
// router.get("/signup", viewController.signup);

// router.get("/", bookingController.getCheckoutBooking, authController.isLoggedIn, viewController.getIndex);
// router.get("/homes", authController.isLoggedIn, viewController.getHomes);
// router.get("/home/:slug", authController.isLoggedIn, viewController.detail);

// router.get('/me', authController.isLoggedIn, authController.protect, viewController.getMe);
// router.get('/my-bookings', authController.isLoggedIn, authController.protect, viewController.getMyBookings);


module.exports = router;