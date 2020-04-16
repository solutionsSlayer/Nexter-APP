const express = require("express");
const homeController = require("../controllers/homeController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect,
    homeController.getAll)
  .post(homeController.createHome);

router
  .route("/:id")
  .get(homeController.getHome)
  .put(
    homeController.uploadHomeImages,
    homeController.resizeHomesImages,
    homeController.updateHome)
  .delete(homeController.delete);

module.exports = router;