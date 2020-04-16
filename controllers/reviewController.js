const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) return next(new AppError('No review belong to this id.', 404));

    res.status(200).json({
        status: 'success',
        review
    })
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        reviews
    })
});

exports.createReview = catchAsync(async (req, res, next) => {
    const review = await Review.create(req.body);

    if (!review) return next(new AppError('Something wrent wrong', 400));

    await review.save();

    res.status(201).json({
        status: 'success',
        review
    })
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'success',
        data: null
    })
});

exports.updateReview = catchAsync(async (req, res, next) => {
    const reviewUp = await Review.findOneAndUpdate({
        _id: req.params.id
    }, req.body, {
        new: true
    });

    if (!reviewUp) return next(new AppError('Something wrong, try again later!'));

    res.status(200).json({
        status: 'success',
        review
    })
});