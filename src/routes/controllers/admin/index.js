const express = require("express");
const adminController = require("./admin.controller");
const adminUserController = require("./user/admin.user.controller");
const router = express.Router();
const { loginAttemptLimit } = require("../../../utils/utils");
const upload = require("../../../../src/utils/multer");
const { verifyToken } = require("../../../utils/utils");

router.post("/admin-login", loginAttemptLimit, adminController.adminLogin);
router.get("/user-info/:user_id", adminController.getUserInfo);

// User
router.get("/user-list", adminUserController.userList);
router.get("/member-list", adminUserController.memberList);
router.post("/update-status", adminUserController.updateStatus);
router.get("/kommittee-list", adminUserController.kommitteeList);

router.get("/add-kommittee", adminUserController.addkommittee);
router.post(
  "/create-kommittee",

  adminUserController.createCommittee
);

// Khort
router.get("/addmemberlist", adminUserController.addMemberList);
router.post(
  "/create-kohort",

  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  adminUserController.createKohort
);
router.get("/kohort-list", adminUserController.kohortList);
router.post("/kohort-status-update", adminUserController.approveKohort);

// Token 검증
router.post("/verify-token", adminController.verifyToken);

module.exports = router;
