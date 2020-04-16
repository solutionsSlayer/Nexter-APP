const Home = require("./../models/homeModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/APIFeatures");
const multer = require("multer");
const sharp = require("sharp");

const storageMulter = multer.memoryStorage();

const upload = multer({
  storage: storageMulter,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
      cb(null, true);
    } else {
      cb(new AppError("Please provide images not other documents!", false));
    }
  }
});

exports.uploadHomeImages = upload.fields([
  {
    name: "imageCover",
    maxCount: 1
  },
  {
    name: "images",
    maxCount: 3
  }
]);

exports.resizeHomesImages = catchAsync(async (req, res, next) => {
  if (req.files.imageCover) {
    req.body.imageCover = `home-${req.params.id}-${Date.now()}.jpg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpg")
      .toFile(`public/img/homes/${req.body.imageCover}`);
  }

  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `home-${req.params.id}-${Date.now()}-${i}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .toFile(`public/img/homes/${filename}`);

        req.body.images.push(filename);
      })
    );
  }

  next();
});

exports.getAll = catchAsync(async (req, res, next) => {
  const homes = new APIFeatures(Home.find(), req.query).filter().sort();
  const doc = await homes.query;

  res.status(200).json({
    results: doc.length,
    status: "success",
    doc
  });
});

exports.createHome = catchAsync(async (req, res, next) => {
  const home = await Home.create(req.body);

  res.status(201).json({
    status: "success",
    home
  });
});

exports.updateHome = catchAsync(async (req, res, next) => {
  const home = await Home.findByIdAndUpdate(req.params.id, req.body, {
    returnOriginal: false
  });

  await home.save();

  if (!home) next(new AppError(`No one home with this ${req.params.id}`, 404));

  res.status(200).json({
    status: "success",
    home
  });
});

exports.getHome = catchAsync(async (req, res, next) => {
  const home = await Home.findById(req.params.id);

  if (!home) next(new AppError(`No one home with ${req.params.id}`, 404));

  res.status(200).json({
    status: "success",
    home
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const home = await Home.deleteOne({
    _id: req.params.id
  });

  if (!home) next(new AppError(`No one home with this ${req.params.id}`, 404));

  res.status(200).json({
    status: "success",
    message: "Deleted!"
  });
});
