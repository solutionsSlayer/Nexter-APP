const mongoose = require("mongoose");
const Home = require("./homeModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"]
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    home: {
      type: mongoose.Schema.ObjectId,
      ref: "Home",
      required: [true, "Review must belong to an home."]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"]
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

reviewSchema.index(
  {
    home: 1,
    user: 1
  },
  {
    unique: true
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "photo name"
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (homeId) {
  const stats = await this.aggregate([
    {
      $match: {
        home: homeId
      }
    },
    {
      $group: {
        _id: "$home",
        nRating: {
          $sum: 1
        },
        avgRating: {
          $avg: "$rating"
        }
      }
    }
  ]);

  if (stats.length > 0) {
    await Home.findByIdAndUpdate(homeId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Home.findByIdAndUpdate(homeId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.home);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
