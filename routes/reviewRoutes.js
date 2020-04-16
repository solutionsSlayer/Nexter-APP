const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(authController.restrictTo('admin'), reviewController.getAllReviews)
    .post(authController.restrictTo('user'), reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview)
    .put(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;