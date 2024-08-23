require("dotenv").config();
const {
  KohortInfo,
  KohortMember,
  KommitteeInfo,
  UserInfo,
} = require("../../../../../models/index");
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
      membersToRemove,
    } = req.body;

    console.log("Treasury Members:", treasury_members);
    console.log("Governance Members:", governance_members);
    console.log("Program Members:", program_members);
    console.log("Members to Remove:", membersToRemove);

    // 1. 삭제할 멤버들 처리
    if (membersToRemove && membersToRemove.length > 0) {
      await KommitteeInfo.destroy({
        where: {
          user_id: {
            [Op.in]: membersToRemove, // 삭제할 멤버의 ID들
          },
          komm_ver: committee_name, // 동일한 커미티 버전 내에서만 삭제
        },
      });
    }

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

// Kohort
exports.addMemberList = async (req, res) => {
  const { selectedCommittee } = req.query;
  console.log(selectedCommittee);
  try {
    // 1. selectedCommittee에 속한 유저들만 가져오기
    const committeeMembers = await KommitteeInfo.findAll({
      where: {
        komm_name: selectedCommittee, // 선택된 커미티에 속한 유저들만 필터링
      },
      include: [
        {
          model: UserInfo,
          as: "user",
          where: { activate_yn: "Y" }, // 활성화된 유저만 가져오기
          attributes: [
            "user_id",
            "user_name",
            "wallet_addr",
            "user_image_link",
          ],
        },
      ],
    });

    // 2. selectedCommittee가 아닌 다른 커미티에 속해 있지 않은 유저들의 ID 가져오기
    const excludedMemberIds = await KommitteeInfo.findAll({
      where: {
        komm_name: { [Op.ne]: selectedCommittee }, // selectedCommittee가 아닌 커미티에 속한 유저들
      },
      attributes: ["user_id"],
    }).then((results) => results.map((result) => result.user_id));

    // 3. KOMMITTEE_INFO에 등록되지 않은 유저들 가져오기 (selectedCommittee와 다른 커미티에 속해 있지 않은 유저들)
    const nonCommitteeMembers = await UserInfo.findAll({
      where: {
        activate_yn: "Y",
        user_id: {
          [Op.notIn]: excludedMemberIds, // 다른 커미티에 속하지 않은 유저들
        },
      },
      attributes: ["user_id", "user_name", "wallet_addr", "user_image_link"],
    });

    // 4. 중복 제거 및 두 결과를 합쳐서 반환
    const allMembersMap = new Map();

    // committeeMembers 추가
    committeeMembers.forEach((member) => {
      allMembersMap.set(member.user_id, {
        ...member.user.dataValues,
        added: false, // 이미 selectedCommittee에 추가된 유저임을 표시
      });
    });

    // nonCommitteeMembers 추가 (기존에 추가된 유저는 덮어쓰지 않음)
    nonCommitteeMembers.forEach((user) => {
      if (!allMembersMap.has(user.user_id)) {
        allMembersMap.set(user.user_id, {
          ...user.dataValues,
          added: false, // 아직 selectedCommittee에 추가되지 않은 유저임을 표시
        });
      }
    });

    // Map을 배열로 변환하여 반환
    const allMembers = Array.from(allMembersMap.values());

    res.json(allMembers);
  } catch (error) {
    console.error("Error adding members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createKohort = async (req, res) => {
  const {
    teamName,
    maxParticipants,
    contributionCategory,
    selectedCommittee,
    startDate,
    endDate,
    description,
    telegramUsername,
    teamGroupChatLink,
    members,
    leader_user_id,
  } = req.body;

  const selectedMembers = JSON.parse(members);
  console.log("Member:", selectedMembers);

  try {
    const profileImageLink = req.files.profileImage
      ? `uploads/${req.files.profileImage[0].filename}`
      : `uploads/logo_default.png`;

    const bannerImageLink = req.files.bannerImage
      ? `uploads/${req.files.bannerImage[0].filename}`
      : `uploads/banner_default.png`;

    const newKohort = await KohortInfo.create({
      kohort_name: teamName,
      leader_user_id,
      description,
      start_date: startDate ? new Date(startDate) : null,
      end_date: endDate ? new Date(endDate) : null,
      profile_image_url: profileImageLink,
      banner_image_url: bannerImageLink,
      contribution: contributionCategory,
      committee: selectedCommittee,
      approval_date: null,
      appr_status: "PENDING",
      activate_yn: "N",
      max_participants: maxParticipants, // 이 컬럼이 있는 경우 추가
      telegram_username: telegramUsername, // 이 컬럼이 있는 경우 추가
      team_group_chat_link: teamGroupChatLink, // 이 컬럼이 있는 경우 추가
    });

    if (selectedMembers && selectedMembers.length > 0) {
      const membersData = selectedMembers.map((member) => ({
        kohort_id: newKohort.kohort_id,
        user_id: member.user_id,
      }));
      await KohortMember.bulkCreate(membersData);
    }

    res
      .status(200)
      .send({ success: true, message: "Kohort created successfully." });
  } catch (error) {
    console.error("Error creating Kohort:", error.message);
    res.status(500).send({
      success: false,
      message: `Failed to create Kohort: ${error.message}`,
    });
  }
};

// Kohort list
exports.kohortList = async (req, res) => {
  try {
    const response = await KohortInfo.findAll({
      include: [
        {
          model: UserInfo,
          as: "leader", // leader_user_id와 연결된 user 정보
          attributes: ["user_name"], // user_name만 가져옴
        },
        {
          model: UserInfo,
          as: "members", // KOHORT_MEMBERS를 통해 연결된 멤버 정보
          attributes: ["user_id", "user_name"], // user_id와 user_name만 가져옴
          through: {
            attributes: [], // KOHORT_MEMBERS 테이블 자체의 데이터는 제외
          },
        },
      ],
      order: [
        ["appr_status", "ASC"], // PENDING 상태가 먼저 오도록 정렬
        ["start_date", "DESC"], // 그 다음은 start_date로 정렬
      ],
    });

    res.json(response);
  } catch (error) {
    console.error("Error fetching applicants", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Kohort update status
exports.approveKohort = async (req, res) => {
  const { kohort_id, status } = req.body;
  console.log(kohort_id, status);
  try {
    if (status === "APPLIED") {
      await KohortInfo.update(
        {
          appr_status: status,
          activate_yn: "Y",
          approval_date: new Date(), // 현재 시간으로 approval_date 업데이트
        },
        { where: { kohort_id } }
      );
    } else {
      await KohortInfo.update(
        {
          appr_status: status,
          activate_yn: "N",
          approval_date: null, // 승인되지 않은 상태에서는 approval_date를 null로 설정할 수 있습니다.
        },
        { where: { kohort_id } }
      );
    }
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
