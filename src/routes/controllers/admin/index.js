const express = require("express");
const adminController = require("./admin.controller");
const adminUserController = require("./user/admin.user.controller");
const adminContractController = require("./contract/admin.contract.controller");
const adminDiscoverController = require("./discover/admin.discover.controller");
const adminContributionController = require("./contribution/admin.contribution.controller");
const adminDealController = require("./deal/admin.deal.controller");
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
router.get("/contract-list", adminContractController.contractList);
router.get("/contract-query/:name", adminContractController.queryContract);

// Discover
router.get("/project-list", adminDiscoverController.projectList);
router.get("/applied-project", adminDiscoverController.appliedProject);
router.post("/apply-project", adminDiscoverController.projectApply);
router.post("/update-project", adminDiscoverController.projectUpdate);

// Contribution
router.get("/contribution-list", adminContributionController.contributionList);
router.post(
  "/create-contribution",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  adminContributionController.cerateContribution
);
router.put(
  "/contribution-status",
  adminContributionController.updateContributionStatus
);

router.get(
  "/invite-details/:cont_id",
  adminContributionController.getInviteDetail
);

// Deal
router.post(
  "/create-deal",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  adminDealController.createDeal
);

router.put(
  "/deals/:dealId",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  adminDealController.updateDeal
);

router.get("/deal-list", adminDealController.dealList);
router.delete("/deals/:dealId", adminDealController.deleteDeal);
router.get("/deal-interest", adminDealController.getDealInterest);
router.post("/deal-interestMsg", adminDealController.sendEmailNotifications);
router.put("/update-payment-period", adminDealController.updatePaymentPeriod);
router.put("/update-verify-status", adminDealController.verifyPaymentStatus);
router.put("/update-complete-status", adminDealController.updateCompleteStatus);

module.exports = router;
