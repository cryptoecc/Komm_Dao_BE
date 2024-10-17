const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "USER_POINTSHISTORY",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      wallet_addr: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          is: /^0x[a-fA-F0-9]{40}$/, // 이더리움 주소 형식 유효성 검사
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // 트랜잭션 발생 시간을 기록
        validate: {
          isDate: true, // 유효한 날짜 형식인지 검사
        },
      },
      participation: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "사용자의 참여 활동 설명",
        validate: {
          notEmpty: true,
        },
      },
      activity: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "사용자가 수행한 활동 (예: Claim XP)",
        validate: {
          notEmpty: true,
        },
      },
      xp_earned: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "사용자가 획득한 XP",
        validate: {
          isInt: true,
          min: 0,
        },
      },
      transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "트랜잭션 ID",
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // 프로젝트 ID는 필수
        comment: "참여한 프로젝트 ID",
      },
    },
    {
      sequelize,
      tableName: "USER_POINTSHISTORY",
      timestamps: false,
    }
  );
};
