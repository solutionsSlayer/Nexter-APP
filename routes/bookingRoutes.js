const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get('/', authController.isLoggedIn, authController.protect, bookingController.getAll);
router.get('/checkout-session/:homeId', authController.protect, bookingController.getCheckoutSession);

router.route('/:id')
    .get(authController.isLoggedIn, authController.protect, bookingController.getBooking);

router.route('/:homeId').delete(authController.isLoggedIn, authController.protect, bookingController.deleteBooking);


module.exports = router;