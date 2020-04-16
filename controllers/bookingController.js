const Home = require("./../models/homeModel");
const Booking = require("./../models/bookingModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const stripe = require("stripe")('sk_test_pw61GlFgzR4mskwzKzuhcZoh009C3z6eLe');

const filterObj = (obj, ...allowFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const home = await Home.findById(req.params.homeId);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        success_url: `${req.protocol}://${req.get("host")}/?home=${req.params.homeId}&user=${req.user._id}&price=${home.price}`,
        cancel_url: `${req.protocol}://${req.get("host")}/home/${home.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.homeId,
        line_items: [{
            name: `${home.name} home`,
            description: home.summary,
            images: [
                "https://r-cf.bstatic.com/images/hotel/max1024x768/174/174371067.jpg"
            ],
            amount: home.price,
            currency: "eur",
            quantity: 1
        }]
    });

    res.status(200).json({
        status: "success",
        session
    });
});

exports.getCheckoutBooking = catchAsync(async (req, res, next) => {
    const {
        home,
        user,
        price
    } = req.query;

    if (!user && !home && !price) return next();

    await Booking.create({
        home,
        user,
        price
    });



    res.redirect(`/`);
});

exports.getAll = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find();

    res.status(200).json({
        results: bookings.length,
        status: 'success',
        bookings
    })
});

exports.getBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return next(new AppError('Provide an id for the research!'));

    res.status(200).json({
        status: 'success',
        booking
    })
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
    const booking = await Booking.findOneAndDelete({
        home: req.params.homeId,
        user: req.user._id
    })

    if (!booking) return next(new AppError('No one booking with this id'));

    res.status(200).json({
        status: 'success',
        data: null
    })
});

exports.updateBooking = catchAsync(async (req, res, next) => {
    const updateBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true
    })
});