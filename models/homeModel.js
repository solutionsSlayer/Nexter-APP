const Review = require('./reviewModel');
const mongoose = require("mongoose");
const slugify = require("slugify");

const homeSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    createAt: Date.now(),
    select: false
  },
  name: {
    type: String,
    required: [true, "Home must have  a name"]
  },
  price: {
    type: Number,
    required: [true, "Home must have a price"]
  },
  slug: String,
  dispo: {
    type: Boolean,
    required: [true, "Home must have disponibility"]
  },
  space: {
    type: String,
    required: [true, "Home must have a metters to define the size"]
  },
  rooms: {
    type: String,
    required: [true, "Home must hve a rooms number"]
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: "Discount price ({VALUE}) must be below the price!"
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [0, "Must be beetween 0 and 5"],
    max: [5, "Must be beetween 0 and 5"]
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  images: [String],
  location: {
    description: String,
    coordinates: [Number],
    address: String,
    type: {
      type: String,
      default: "Point",
      enum: ["Point"]
    }
  },
  startDates: [Date],
  maxGroupSize: {
    type: Number,
    required: [true, "A visit must have a group size"]
  },
  guides: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
  summary: {
    type: String,
    required: [true, "Home must have a summary"]
  },
  description: {
    type: String,
    required: [true, "Home must have a description"]
  },
  imageCover: {
    type: String,
    required: [true, "Home must have an image cover"]
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

homeSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'home',
  localField: '_id'
});

homeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-password"
  });

  next();
});

homeSchema.pre("save", function (next) {
  this.slug = slugify(this.name);

  next();
});

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;