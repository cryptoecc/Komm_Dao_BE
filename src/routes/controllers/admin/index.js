const express = require("express");
const adminController = require("./admin.controller");
const adminUserController = require("./user/admin.user.controller");
const adminContractController = require("./contract/admin.contract.controller");
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

router.get("/contract-list", adminContractController.contractList);
router.get("/contract-query/:name", adminContractController.queryContract);

module.exports = router;
