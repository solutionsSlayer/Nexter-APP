const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.post("/sign-up", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.use(authController.protect);

router.get("/me", userController.getMe);
router.put(
  "/update-me",
  userController.uploadImageUser,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.put("/update-password", authController.updatePassword);
router.delete("/delete-me", userController.deleteMe);

router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAll);

module.exports = router;
