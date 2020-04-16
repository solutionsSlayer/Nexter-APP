const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    home: {
        type: mongoose.Schema.ObjectId,
        ref: 'Home',
        required: [true, 'Booking muste belong to a home']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking muste belong to a user']
    },
    price: Number,
    paid: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'home',
        select: 'name'
    })

    next();
})

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;