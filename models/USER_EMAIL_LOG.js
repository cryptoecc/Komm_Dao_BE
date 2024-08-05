// models/EmailLog.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "USER_EMAIL_LOG",
    {
      send_seq: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      request_dt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: "발송요청일시",
      },
      from_addr: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "",
        comment: "발송메일주소",
      },
      to_addr: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "",
        comment: "수신메일주소",
      },
      pin_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "",
        comment: "PIN 코드",
      },
      pin_expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "PIN 만료 일시",
      },
      send_stat_cd: {
        type: DataTypes.STRING(6),
        allowNull: false,
        defaultValue: "",
        comment: "발송상태코드",
      },
      send_stat_cd_nm: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "",
        comment: "발송상태코드명",
      },
      registed_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "등록자",
      },
      regist_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        comment: "등록일자",
      },
      modified_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: "수정자",
      },
      modify_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        onUpdate: DataTypes.NOW,
        comment: "수정일자",
      },
    },
    {
      sequelize,
      tableName: "USER_EMAIL_LOG",
      timestamps: false,
    }
  );
};
