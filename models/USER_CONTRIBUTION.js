const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "USER_CONTRIBUTION",
    {
      cont_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "CONTRIBUTION_INFO", // 외래 키 설정
          key: "cont_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "USER_INFO", // 외래 키 설정
          key: "user_id",
        },
      },
      ms_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "CONTRIBUTION_MISSIONS", // 외래 키 설정
          key: "ms_id",
        },
      },
      cont_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      claim_yn: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "N",
      },
      cont_xp: {
        type: DataTypes.FLOAT(53),
        allowNull: true,
      },
      total_xp: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "USER_CONTRIBUTION",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          fields: ["cont_id", "user_id", "ms_id"], // 복합 기본 키
        },
      ],
    }
  );
};
