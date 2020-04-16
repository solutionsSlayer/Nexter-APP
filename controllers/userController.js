const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const multer = require("multer");
const sharp = require("sharp");

// const storageMulter = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users/");
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   }
// });

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

exports.uploadImageUser = upload.single("photo");
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  // With memoryStorage file is store in req.fle.buffer
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// ADMIN
exports.getAll = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    users
  });
});

// USER PROFIL
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.user.email
  });

  if (!user)
    return next(
      new AppError(
        "You have not the permission for access this ressource.",
        401
      )
    );

  res.status(200).json({
    status: "success",
    user
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {

  console.log(req.file)
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for update password", 400));
  }

  const update = filterObj(req.body, "name", "email");
  if (req.file) update.photo = req.file.filename;
  const user = await User.findOneAndUpdate({
      email: req.user.email
    },
    update, {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: "success",
    user
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    active: false
  });

  res.status(200).json({
    status: "success",
    user
  });
});