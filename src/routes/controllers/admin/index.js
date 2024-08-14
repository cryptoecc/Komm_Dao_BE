const express = require("express");
const adminController = require("./admin.controller");
const adminUserController = require("./user/admin.user.controller");
const router = express.Router();
const { loginAttemptLimit } = require("../../../utils/utils");

router.post("/admin-login", loginAttemptLimit, adminController.adminLogin);

// User
router.get("/user-list", adminUserController.userList);
router.get("/member-list", adminUserController.memberList);
router.post("/update-status", adminUserController.updateStatus);
router.get("/kommittee-list", adminUserController.kommitteeList);

router.get("/add-kommittee", adminUserController.addkommittee);
router.post("/create-kommittee", adminUserController.createCommittee);

module.exports = router;
