const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const UserInviteContribution = sequelize.define(
    "USER_INVITE_CONTRIBUTION",
    {
      invite_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      cont_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "CONTRIBUTION_MISSIONS",
          key: "cont_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        comment: "CONTRIBUTION_MISSIONS 테이블의 cont_id 외래 키 참조",
      },
      ms_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "CONTRIBUTION_MISSIONS",
          key: "ms_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        comment: "CONTRIBUTION_MISSIONS 테이블의 ms_id 외래 키 참조",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "USER_INFO", // USER_INFO 테이블의 user_id를 참조
          key: "user_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        comment: "USER_INFO 테이블의 user_id 외래 키 참조",
      },
      invite_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "초대 메일을 보낸 이메일",
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "PENDING", // 기본 값은 PENDING으로 설정
        comment: "초대 받은 이메일의 승인 상태 (PENDING/APPROVED/REJECTED)",
      },
    },
    {
      sequelize,
      tableName: "USER_INVITE_CONTRIBUTION",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          fields: [{ name: "invite_id" }],
        },
        {
          name: "ms_id_idx",
          fields: [{ name: "ms_id" }],
        },
        {
          name: "cont_id_idx",
          fields: [{ name: "cont_id" }],
        },
        {
          name: "user_id_idx",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );

  return UserInviteContribution;
};
