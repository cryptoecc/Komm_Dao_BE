require("dotenv").config();
const { UserInfo } = require("../../../../../models/index");
const { KommitteeInfo } = require("../../../../../models/index");

exports.userList = async (req, res) => {
  try {
    const applicants = await UserInfo.findAll();
    res.json(applicants);
  } catch (error) {
    console.error("Error fetching applicants", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.memberList = async (req, res) => {
  try {
    const members = await UserInfo.findAll({ where: { activate_yn: "Y" } });
    res.json(members);
  } catch (error) {
    console.error("Error fetching members", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateStatus = async (req, res) => {
  const { user_id, status } = req.body;

  try {
    await UserInfo.update({ appr_status: status }, { where: { user_id } });
    if (status == "APPLIED") {
      await UserInfo.update({ activate_yn: "Y" }, { where: { user_id } });
      //   await UserInfo.update({ activate_yn: "Y" }, { where: { user_id } });
    } else {
      await UserInfo.update({ activate_yn: "N" }, { where: { user_id } });
    }

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.kommitteeList = async (req, res) => {
  try {
    const kommittees = await KommitteeInfo.findAll({
      include: [
        {
          model: UserInfo,
          as: "user", // `KOMMITTEE_INFO.js`에서 정의한 `as`와 일치해야 합니다.
        },
      ],
    });

    console.log("111", kommittees);
    res.json(kommittees);
  } catch (error) {
    console.error("Error fetching kommittees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
