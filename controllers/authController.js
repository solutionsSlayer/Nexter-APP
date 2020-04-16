const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  promisify
} = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Email = require("../utils/sendMail");

const signToken = (id) => {
  return jwt.sign({
      id
    },
    process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookiesOptions = {
    expires_in: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true // Can't manipulate the cookie on browser
  };

  if (process.env.NODE_ENV === "prod") cookiesOptions.secure = true; // Only be sent on encrypted connexion (HTTPS)

  res.cookie("jwt", token, cookiesOptions);

  // Reset password before output
  user.password = undefined;
  user.passwordConfirm = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user
  });
};

exports.logout = (req, res, next) => {
  const cookiesOptions = {
    expires_in: new Date(Date.now() + 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "prod") cookiesOptions.secure = true; // Only be sent on encrypted connexion (HTTPS)

  res.cookie("jwt", "Logout", cookiesOptions);

  res.status(200).json({
    status: "success"
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password)
    return next(new AppError("Provide email and password.", 400));

  const user = await User.findOne({
    email: email
  }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect credentials, try again!", 404));

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError("You need to be logged in to acces this ressource."),
      401
    );

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new AppError("The user belong to this token no longer exist."),
      400
    );

  if (await currentUser.changePassword(decoded.iat))
    return next(
      new AppError("User recently change password, logged in again plz", 401)
    );

  req.user = currentUser;

  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have the permission to access this ressource.",
          403
        )
      );
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!user.correctPassword(req.body.passwordCurr, req.user.password)) {
    return next(new AppError("Passwords are not the same, try again."));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email
  });

  if (!user) return next(new AppError("There is no user with this email"), 404);

  const resetToken = await user.createResetToken();
  await user.save({
    validateBeforeSave: false
  });

  try {
    // await sendMail({
    //   email: user.email,
    //   subject: "Reset Password",
    //   message
    // });
    const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;

    await new Email(user, resetUrl).sendResetPwd();

    res.status(200).json({
      status: "success",
      message: "Token send"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.tokenExpireAt = undefined;
    await user.save({
      validateBeforeSave: false
    });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: token,
    tokenExpireAt: {
      $gt: Date.now()
    }
  });

  if (!user)
    return next(new AppError("Token invalid or has exprired, try again!"));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.tokenExpireAt = undefined;
  await user.save();

  createSendToken(user, 200, res);
});