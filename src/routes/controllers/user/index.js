const express = require("express");
const userController = require("./user.controller");
const upload = require("../../../utils/multer");
const profileRouter = require("./profile");

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

module.exports = router;
