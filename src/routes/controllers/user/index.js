const express = require("express");
const userController = require("./user.controller");
const upload = require("../../../utils/multer");
const profileRouter = require("./profile");
const watchlistRouter = require("./watchlist");

const router = express.Router();

router.post("/send-email", userController.sendEmail);
router.post("/verify-pin", userController.verifyPin);
router.post(
  "/submit",
  upload.single("user_image_link"),
  (req, res, next) => {
    next();
  },
  userController.submit
);
router.use("/profile", profileRouter);
router.use("/watchlist", watchlistRouter);

module.exports = router;
