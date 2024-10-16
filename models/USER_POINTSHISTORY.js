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
          notEmpty: true, // 빈 값이 들어가지 않도록 유효성 검사 추가
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
          notEmpty: true, // 빈 값이 들어가지 않도록 유효성 검사 추가
        },
      },
      activity: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "사용자가 수행한 활동 (예: Claim XP)",
        validate: {
          notEmpty: true, // 빈 값이 들어가지 않도록 유효성 검사 추가
        },
      },
      xp_earned: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "사용자가 획득한 XP",
        validate: {
          isInt: true, // 정수만 허용
          min: 0, // 음수 XP는 허용하지 않음
        },
      },
      transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "트랜잭션 ID",
        validate: {
          notEmpty: true, // 빈 값이 들어가지 않도록 유효성 검사 추가
          len: [1, 255], // 최대 길이 255까지 허용
        },
      },
    },
    {
      sequelize,
      tableName: "USER_POINTSHISTORY",
      timestamps: false, // 자동 타임스탬프 사용하지 않음
    }
  );
};
