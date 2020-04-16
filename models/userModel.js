const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'Provide a valid email'],
    unique: true,
    lowercase: true,
    required: [true, 'User must have an email'],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'User must have a password'],
  },
  active: {
    type: Boolean,
    default: true
  },
  passwordConfirm: {
    type: String,
    minlength: 8,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password and password confirm need to be the same',
    },
    required: [true, 'User need to confirm password'],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  tokenExpireAt: Date,
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['guide', 'user', 'admin'],
    default: 'user',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 20000;

  next();
});

userSchema.pre(/^find/, async function (next) {
  this.find({
    active: {
      $ne: false,
    },
  });
});

userSchema.methods.correctPassword = async function (candidatPwd, currPwd) {
  return await bcrypt.compare(candidatPwd, currPwd);
};

userSchema.methods.changePassword = async function (JWTtoken) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return changedTime > JWTtoken;
  }

  return false;
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.tokenExpireAt = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;