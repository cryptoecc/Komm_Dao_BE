require("dotenv").config();
const { UserInfo } = require("../../../../../models/index");
const { KommitteeInfo } = require("../../../../../models/index");
const { Op } = require("sequelize");

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
    const members = await UserInfo.findAll({
      where: { activate_yn: "Y" },
      include: [
        {
          model: KommitteeInfo, // KOMMITTEE_INFO 모델과의 연관
          as: "kommittees", // USER_INFO 모델에서 정의한 별칭
          attributes: ["komm_name"], // 가져올 속성
        },
      ],
    });
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

exports.addkommittee = async (req, res) => {
  const { selectedCommittee } = req.query; // 프론트엔드에서 selectedCommittee를 쿼리로 전달받음

  try {
    // 1. KOMMITTEE_INFO에서 selectedCommittee에 해당하는 유저들 가져오기
    const committeeMembers = await KommitteeInfo.findAll({
      where: {
        komm_name: selectedCommittee,
      },
      include: [
        {
          model: UserInfo,
          as: "user",
          where: { activate_yn: "Y" },
          attributes: [
            "user_id",
            "user_name",
            "wallet_addr",
            "user_image_link",
          ],
        },
      ],
    });

    // committeeMembers에서 user_id 추출
    const committeeMemberIds = committeeMembers.map((member) => member.user_id);

    // 2. KOMMITTEE_INFO에 등록된 유저들 중, selectedCommittee가 아닌 커미티에 속한 유저들의 user_id를 가져오기
    const excludedMemberIds = await KommitteeInfo.findAll({
      where: {
        komm_name: { [Op.ne]: selectedCommittee }, // selectedCommittee가 아닌 커미티에 속한 유저들
      },
      attributes: ["user_id"],
    }).then((results) => results.map((result) => result.user_id));

    // 3. KOMMITTEE_INFO에 등록되지 않은 USER_INFO의 유저들 가져오기
    const nonCommitteeMembers = await UserInfo.findAll({
      where: {
        activate_yn: "Y",
        user_id: {
          [Op.notIn]: [...excludedMemberIds, ...committeeMemberIds], // 중복되지 않도록 committeeMemberIds도 제외
        },
      },
      attributes: ["user_id", "user_name", "wallet_addr", "user_image_link"],
    });

    // 4. 두 결과를 합쳐서 반환
    const allMembers = [
      ...committeeMembers.map((member) => ({
        ...member.user.dataValues,
        added: true, // 이미 커미티에 추가된 유저임을 표시
      })),
      ...nonCommitteeMembers.map((user) => ({
        ...user.dataValues,
        added: false, // 아직 커미티에 추가되지 않은 유저임을 표시
      })),
    ];

    res.json(allMembers);
  } catch (error) {
    console.error("Error fetching members", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createCommittee = async (req, res) => {
  try {
    const {
      committee_name,
      start_date,
      end_date,
      treasury_members,
      governance_members,
      program_members,
    } = req.body;

    console.log("Treasury Members:", treasury_members);
    console.log("Governance Members:", governance_members);
    console.log("Program Members:", program_members);

    // 중복 체크 및 저장 로직
    const saveMembers = async (members, committeeName) => {
      for (const member of members) {
        if (!member) {
          console.error(`Missing member data for committee ${committeeName}`);
          continue; // `member`가 비어있는 경우 해당 멤버를 건너뜁니다.
        }

        const exists = await KommitteeInfo.findOne({
          where: {
            user_id: member,
            komm_name: committeeName,
            komm_ver: committee_name,
          },
        });

        if (!exists) {
          await KommitteeInfo.create({
            komm_name: committeeName,
            user_id: member,
            komm_ver: committee_name,
            start_date: start_date,
            end_date: end_date,
            create_date: new Date(),
            update_date: Date.now(),
          });
        }
      }
    };

    await saveMembers(treasury_members, "Treasury");
    await saveMembers(governance_members, "Governance");
    await saveMembers(program_members, "Program");

    res
      .status(200)
      .json({ message: "Kommittee and members added successfully" });
  } catch (error) {
    console.error("Error saving kommittee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
